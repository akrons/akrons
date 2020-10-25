import { Component, OnInit } from '@angular/core';
import { IElementComponent } from '@akrons/cms';

@Component({
  selector: 'akrons-default-cms-elements-title-element',
  templateUrl: './title-element.component.html',
  styleUrls: ['./title-element.component.css']
})
export class TitleElementComponent implements OnInit, IElementComponent<ITitleElementData> {
  data: ITitleElementData;
  constructor() { }

  ngOnInit(): void {
  }

}

export interface ITitleElementData {
  text: string;
  level: number;
}
