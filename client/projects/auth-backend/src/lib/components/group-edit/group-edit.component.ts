import { IGroup } from '@akrons/common-auth';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'akrons-auth-backend-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {

  permissionsValidPattern = `^[a-z0-9]+(\\.[a-z0-9]+)*(\\.\\*)?$`;

  groupName = new FormControl(this.selectedGroup.name, [Validators.required]);
  permissions: FormControl[] = this.selectedGroup.permissions.map(
    permission => new FormControl(permission, [Validators.pattern(this.permissionsValidPattern)]),
  );

  showValidationErrors = false;
  processing = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public selectedGroup: IGroup,
    private groupsService: GroupsService,
  ) { }

  ngOnInit(): void {
  }

  addPermission(): void {
    this.permissions.push(new FormControl('', [Validators.pattern(this.permissionsValidPattern)]));
  }

  removePermission(permissionControl: FormControl): void {
    this.permissions = this.permissions.filter(x => x !== permissionControl);
  }

  async save(): Promise<void> {
    this.processing = true;
    try {
      if (
        !this.groupName.valid &&
        !this.permissions.reduce<boolean>((acc, val) => val.valid && acc, true)
      ) {
        this.showValidationErrors = true;
      }
      if (this.selectedGroup.id) {
        await this.groupsService.update(this.selectedGroup.id, {
          name: this.groupName.value,
          permissions: this.permissions.map(control => control.value).filter(Boolean),
        });
      } else {
        await this.groupsService.insert({
          name: this.groupName.value,
          permissions: this.permissions.map(control => control.value).filter(Boolean),
        });
      }
      this.dialogRef.close();
    } finally {
      this.processing = false;
    }
  }

  discardChanges() {
    this.dialogRef.close();
  }


}
