import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BackendElementManagerService } from '../../../../services/backend-element-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-element',
  templateUrl: './add-element.component.html',
  styleUrls: ['./add-element.component.scss']
})
export class AddElementComponent implements OnInit {

  @Output() selected: EventEmitter<string>;

  selectionOpen = false;

  elementTypes: { name: string, icon: string, value: string }[] = [];
  // { name: 'Titel', icon: 'title', value: 'titleElement' },
  // { name: 'Text', icon: 'text_fields', value: 'textElement' },
  // { name: 'Bild', icon: 'insert_photo', value: 'imageElement' },
  // // { name: 'Inhaltsverzeichnis', icon: 'list', value: 'indexElement' },
  // { name: 'Kalender', icon: 'calendar_today', value: 'calendarElement' },
  // { name: 'Predigtliste', icon: 'mic', value: 'sermentListElement' },
  // // { name: 'Emailadresse', icon: 'alternate_email', value: 'mailAddressElement' },
  // { name: 'Trennlinie', icon: 'minimize', value: 'horizontalLineElement' },
  // { name: 'Youtube - Video', icon: 'video_library', value: 'youtube' },
  // // { name: 'Tabelle', icon: 'view_list', value: 'tableElement' },


  constructor(
    private backendElementManagerService: BackendElementManagerService,
  ) {
    this.selected = new EventEmitter();
  }

  ngOnInit(): void {
    this.elementTypes = this.backendElementManagerService.getElements()
      .map(x => ({ name: x.name, icon: x.icon, value: x.type }));
  }

  open(): void {
    this.selectionOpen = true;
  }
  close(): void {
    this.selectionOpen = false;
  }

  select(value: string): void {
    this.selectionOpen = false;
    this.selected.next(value);
  }

}
