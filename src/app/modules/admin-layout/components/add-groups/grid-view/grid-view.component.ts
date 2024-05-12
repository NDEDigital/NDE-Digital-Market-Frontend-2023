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
@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.css'],
})
export class GridViewComponent {
  @Input() group!: any;
  @Input() i!: any;
  @Input() btnIndex!: any;
  @Output() checkboxSelectedEvent = new EventEmitter<{
    groupId: number;
    event: any;
  }>();
  @Output() updateIsActiveEvent = new EventEmitter<{
    isActive: boolean;
    productGroupId: number;
  }>();

  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  @ViewChild('productGroupImageInput') ProductImageInput!: ElementRef;
  @ViewChild('addGroupModalCenterG') AddGroupModalCenterG!: ElementRef;
  //@ViewChild('modalGroupImage') ModalGroupImage!: ElementRef;

  @ViewChild('modalGroupImage') ModalGroupImage!: ElementRef<HTMLImageElement>;
  @ViewChild('allselected', { static: true })
  allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  isHovered: any | null = null;

  addGroupForm!: FormGroup;
  alertMsg = '';
  showProductDiv: boolean = false;
  groupList: any;
  isError: boolean = false;
  isEditMode = false;
  existingImagePath: string = '';
  currentGroup: any = null;
  activeGroupId: number | null = null;
  imagePathPreview: string = '';
  alertTitle: any;

  constructor(private addProductService: AddProductService) {}
  onCheckboxSelected(event: { groupId: any; event: any }) {
    console.log(event.groupId);
    this.checkboxSelectedEvent.emit({
      groupId: event.groupId,
      event: event.event,
    });
  }

  updateIsActive(event: { isActive: boolean; productGroupId: number }) {
    const { isActive, productGroupId } = event;
    this.updateIsActiveEvent.emit({ isActive, productGroupId });
  }
}
