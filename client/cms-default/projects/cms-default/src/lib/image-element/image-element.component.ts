import { Component, OnInit } from '@angular/core';
import { IElementComponent } from '@akrons/cms';

@Component({
  selector: 'akrons-default-cms-elements-image-element',
  templateUrl: './image-element.component.html',
  styleUrls: ['./image-element.component.css']
})
export class ImageElementComponent implements OnInit, IElementComponent<IImageElementData> {
  data: IImageElementData;
  constructor() { }

  ngOnInit(): void {
  }

  getStyleString(fixed: boolean): string {
    return [
      ...(fixed ? [`background-image: url(${this.data.url})`] : []),
      `height: ${this.getHeight()}`,
      `width: ${this.data.width ? this.data.width + '%' : '80%'}`,
    ].join(';');
  }

  getHeight(): string {
    if (!this.data.height || !this.data.heightUnit || this.data.heightUnit === 'auto') {
      return 'auto';
    }
    return this.data.height + this.data.heightUnit;
  }

}

export interface IImageElementData {
  description: string;
  width: number;
  height: number;
  heightUnit: string;
  url: string;
  fixed: boolean;
}
