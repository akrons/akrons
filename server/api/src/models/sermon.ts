export interface ISermon {
    preacher: {
        id?: string,
        name?: string,
    };
    date: Date;
    title: string;
    id: string;
    availableUntil?: Date;
}
