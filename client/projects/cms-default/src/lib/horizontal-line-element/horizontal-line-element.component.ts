import { Component, OnInit } from '@angular/core';
import { IElementComponent } from '@akrons/cms';

@Component({
  selector: 'akrons-default-cms-elements-horizontal-line-element',
  templateUrl: './horizontal-line-element.component.html',
  styleUrls: ['./horizontal-line-element.component.css']
})
export class HorizontalLineElementComponent implements OnInit, IElementComponent<{}> {
  data: {};
  constructor() { }

  ngOnInit(): void {
  }

}
