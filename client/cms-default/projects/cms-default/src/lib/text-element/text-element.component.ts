import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IElementComponent } from '@akrons/cms';

@Component({
  selector: 'akrons-default-cms-elements-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.css']
})
export class TextElementComponent implements OnInit, IElementComponent<ITextElementData> {
  data: ITextElementData;
  htmlData: SafeHtml;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.data.text);
  }

}

export interface ITextElementData {
  text: string;
  html?: boolean;
}
