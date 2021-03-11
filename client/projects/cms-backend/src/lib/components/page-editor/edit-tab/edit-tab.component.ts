import { cms } from '@akrons/types';
import { Component, OnInit, Input } from '@angular/core';
import { BackendElementManagerService } from '../../../services/backend-element-manager.service';

@Component({
  selector: 'app-edit-tab',
  templateUrl: './edit-tab.component.html',
  styleUrls: ['./edit-tab.component.scss']
})
export class EditTabComponent implements OnInit {
  @Input() selectedPage: cms.IPage;
  constructor(
    private backendElementManagerService: BackendElementManagerService,
  ) { }

  ngOnInit(): void {
  }

  addElement(elementType: string): void {
    if (!this.selectedPage) {
      return;
    }
    const elementDefinition = this.backendElementManagerService.getElement(elementType);
    if (!elementDefinition) {
      throw new Error(`The element-type '${elementType}' is unknown. Maybe the plugin module is missing!`);
    }
    const newElement: cms.IPayload = {
      type: elementType,
      data: elementDefinition.create(),
    };
    this.selectedPage.elements.push(newElement);
  }

}
