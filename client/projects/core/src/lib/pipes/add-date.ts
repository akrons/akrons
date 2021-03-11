import { Pipe, PipeTransform } from '@angular/core';
import { addDays, addHours, addMinutes, addMonths, addSeconds, addYears } from 'date-fns';
@Pipe({
    name: 'addToDate'
})

export class AddToDatePipe implements PipeTransform {
    transform(value: Date, type: 'seconds' | 'minute' | 'hour' | 'day' | 'month' | 'year', amount: number): Date {
        switch (type){
            case 'day':
                return addDays(value, amount);
            case 'hour':
                return addHours(value, amount);
            case 'minute':
                return addMinutes(value, amount);
            case 'month':
                return addMonths(value, amount);
            case 'seconds':
                return addSeconds(value, amount);
            case 'year':
                return addYears(value, amount);
            default:
                return value;
        }
    }
}
