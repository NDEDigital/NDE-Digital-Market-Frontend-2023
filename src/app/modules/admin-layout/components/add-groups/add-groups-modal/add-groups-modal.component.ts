import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';
AddProductService;
@Component({
  selector: 'app-add-groups-modal',
  templateUrl: './add-groups-modal.component.html',
  styleUrls: ['./add-groups-modal.component.css'],
})
export class AddGroupsModalComponent {
  @Output() resetFormEvent = new EventEmitter<{}>();
  @Output() isFieldInvalidEvent = new EventEmitter<{ status: any }>();
  @Input() isEditMode!: any;
  @Input() id!: any;
  @Input() addGroupForm!: any;
  @Input() imagePathPreview!: any;
  @Input() productGroupImageInput!: any;
  constructor(private addProductService: AddProductService) {}
  resetForm(): void {
    this.resetFormEvent.emit();
  }
  isFieldInvalid(status: any): any {
    this.isFieldInvalidEvent.emit({ status });
  }
}
