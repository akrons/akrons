import { BadRequestError, NotImplementedError } from '@akrons/service-utils';
import { getAuthenticatedGraphClient } from '../graph/graph-client';
import { getApiOauthToken } from '../auth/api-auth';
import { lastDayOfMonth, addMonths, addMinutes, isBefore, getMonth, getYear } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Event, DateTimeTimeZone } from '@microsoft/microsoft-graph-types';
import ical from 'ical-generator';
import { TimeSpan } from '../time-span';
import { Db, Collection } from 'mongodb';
import { mongoConnection } from '../mongo';
import { getEnvironment } from '../env';
import { Permissions } from './permissions';
import { GraphError } from '@microsoft/microsoft-graph-client';

const CALENDAR_USER = '3f2139cd-5ee3-42c8-9dd8-82798c3c33e3';
const ICAL = {
    name: 'Kalender',
    ttl: {
        hours: 5,
    }
}
export class Calendar {
    private static instance: Calendar | undefined;
    public static getInstance(): Calendar {
        if (!this.instance) {
            this.instance = new Calendar();
        }
        return this.instance;
    }

    getICal(events: ICalendarEvent[]): string {
        let calendar = ical({
            name: ICAL.name,
            ttl: TimeSpan.toSeconds(ICAL.ttl),
        });
        for (let event of events) {
            calendar.createEvent({
                start: event.start,
                end: event.end,
                summary: event.subject,
                id: event.id,
                location: event.location,
                description: event.description
            });
        }
        return calendar.toString();
    }

    getCsvForMonth(events: ICalendarEvent[], month: number, year: number): string {
        throw new NotImplementedError();
        // let csvResult = '';
        // for (let i = 0; i < events.length; i++) {
        //     let event = events[i];
        //     csvResult += `${i};${this.dayOfWeekToString(getDay(new Date(year, month, i))().DayOfWeek)};\"`;

        //     csvResult += calendereventsToString(events.FindAll(e => (e.start.Day == i && e.start.Month == month && e.start.Year == year)));
        //     //     csvResult += "\"\n";

        // }
        // return csvResult;
    }

    async loadEventsForMonth(month: string | undefined, year: string | undefined): Promise<ICalendarEvent[]> {
        if (!month || !year) throw new BadRequestError();
        let monthNumber: number = parseInt(month);
        let yearNumber: number = parseInt(year);
        if (isNaN(monthNumber) || isNaN(yearNumber)) throw new BadRequestError();
        return await this.loadMonthFromCache(monthNumber, yearNumber);
    }

    async loadEventsForMonthWithSpan(plusMonth: number, minusMonth: number): Promise<ICalendarEvent[]> {
        const result: ICalendarEvent[] = [];
        let currentMonth = addMonths(new Date(), -minusMonth);
        for (let i = 0; i < plusMonth + minusMonth; i++) {
            result.push(...await this.loadMonthFromCache(getMonth(currentMonth) + 1, getYear(currentMonth)));
            currentMonth = addMonths(currentMonth, 1);
        }
        return result;
    }

    private mapGraphEventToICalendarEvent(graphEvent: Event): ICalendarEvent {
        return {
            id: graphEvent.iCalUId!,
            start: this.deZoneTime(graphEvent.start),
            end: this.deZoneTime(graphEvent.end),
            subject: graphEvent.subject || '',
            description: graphEvent.body?.content || undefined,
            location: graphEvent.location?.displayName || undefined,
        };
    }

    private async queryEventsTimeSpan(from: Date, to: Date): Promise<ICalendarEvent[]> {
        const apiAccessToken = await getApiOauthToken();
        let graphClient = getAuthenticatedGraphClient(apiAccessToken);
        let graphEvents: Event[] = await graphClient
            .api(`/users/${CALENDAR_USER}/calendarView`)
            .query({ 'startDateTime': from.toISOString(), 'endDateTime': to.toISOString() })
            .orderby(['Start/DateTime'])
            .top(200)
            .get()
            .then(x => <Event[]>x.value);
        let notCanceledEvents = graphEvents.filter(event => !event.isCancelled);
        let authorizedEvents: Event[] = <any>(await Promise.all(
            notCanceledEvents.map(event => this.checkForEventPermissions(event).then(x => x ? event : undefined))
        )).filter(Boolean);
        return authorizedEvents
            .map((event: Event) => this.mapGraphEventToICalendarEvent(event));
    }

    private async checkForEventPermissions(event: Event): Promise<boolean> {
        const organizerMail = event.organizer?.emailAddress?.address;
        if (!organizerMail) {
            return false;
        }
        const permissionsInstance = Permissions.getInstance();
        let permissions: string[] = [];
        try {
            permissions = await permissionsInstance.loadUserPermissions({ mail: organizerMail });
        } catch (err) {
            if (err instanceof GraphError && err.statusCode === 404) {
                permissions = await permissionsInstance.loadGroupPermissionsByEmail(organizerMail);
            } else {
                throw err;
            }
        }
        return permissionsInstance.hasPermission('api.backend.event.organizer', permissions);
    }

    private deZoneTime(zonedTime: DateTimeTimeZone | undefined | null): Date {
        if (!zonedTime || !zonedTime.dateTime) return new Date();
        if (!zonedTime.timeZone) return new Date(zonedTime.dateTime);
        return zonedTimeToUtc(zonedTime.dateTime, zonedTime.timeZone);
    }

    private loadMonthFromCache(month: number, year: number): Promise<ICalendarEvent[]> {
        return mongoConnection(async (db) => {
            let collection = this.getCollection(db);
            let eventMonth = await collection.findOne({ year, month });
            let TTLDate = addMinutes(new Date(), -(getEnvironment().CALENDAR_EVENT_TTL || 0));
            if (eventMonth && isBefore(new Date(eventMonth.loadingDate), TTLDate)) {
                eventMonth = null;
                await collection.deleteOne({ month, year });
            }
            if (!eventMonth) {
                let monthStart = new Date(year, month - 1, 1);
                let monthEnd = lastDayOfMonth(monthStart);
                let events = await this.queryEventsTimeSpan(monthStart, monthEnd);
                eventMonth = {
                    month,
                    year,
                    events,
                    loadingDate: new Date(),
                };
                await collection.insertOne(eventMonth);
            }
            return eventMonth.events;
        });
    }

    getCollection(db: Db): Collection<IEventMonth> {
        return db.collection<IEventMonth>('calendar');
    }

}

interface IEventMonth {
    events: ICalendarEvent[];
    month: number;
    year: number;
    loadingDate: Date;
}

export interface ICalendarEvent {
    id: string;
    subject: string;
    start: Date;
    end: Date;
    location?: string;
    description?: string;
}
