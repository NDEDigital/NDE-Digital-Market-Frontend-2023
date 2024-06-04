import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-unit-list-grid-view',
  templateUrl: './unit-list-grid-view.component.html',
  styleUrls: ['./unit-list-grid-view.component.css'],
})
export class UnitListGridViewComponent {
  @Input() unit!: any;
  @Input() i!: any;
  @Input() isHovered!: any;
  @Input() activeGroupId!: any;
  @Input() btnIndex!: any;
  @Output() checkboxSelectedEvent = new EventEmitter<{
    unitId: any;
    event: any;
  }>();
  @Output() updateIsActiveEvent = new EventEmitter<{
    status: any;
    unitIds: any;
  }>();
  checkboxSelected(unitId: any, event: any) {
    console.log(unitId);
    this.checkboxSelectedEvent.emit({
      unitId: unitId,
      event: event,
    });
  }
  updateIsActive(status: any, unitIds: any) {
    this.updateIsActiveEvent.emit({
      status: status,
      unitIds: unitIds,
    });
  }
}
