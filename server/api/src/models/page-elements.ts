export interface pageElementComponentInterface {
    data: IPageElement;
}

export interface IPageElement {
    type: string;
    edit?: Boolean;
}

export interface ITitleElement extends IPageElement {
    text: string;
    level: number;
}

export interface ITextElement extends IPageElement {
    text: string;
    html?: boolean;
}

export interface IImageElement extends IPageElement {
    description: string;
    url: string;
}

export interface IIndexElement extends IPageElement {
    menulocation: string;
}

export interface ICalendarElement extends IPageElement {

}

export interface ISermentListElement extends IPageElement {

}

export interface IMailAddressElement extends IPageElement {
    email: string;
}

export interface IHorizontalLineElement extends IPageElement {

}

export interface ITableElement extends IPageElement {
    header: string[];
    content: string[][];
}
