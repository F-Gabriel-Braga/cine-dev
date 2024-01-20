import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagUserComponent } from '../../../../tag-user/tag-user.component';
import { ModalUserEditComponent } from '../user-edit/user-edit.component';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'modal-user-info',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    TagUserComponent,
    ModalUserEditComponent,
    DatePipe,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class ModalUserInfoComponent {
  @Input({ required: true })
  user: any;
  @Input()
  visible: boolean = false;
  @Output()
  visibleChange = new EventEmitter<boolean>();
  visibilityEditModal: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  protected changeVisibilityModal(visible: boolean): void {
    this.visibleChange.emit(visible);
    if (!visible) this.user = null;
  }

  protected openModalUserEdit(): void {
    this.visibilityEditModal = true;
  }

  protected changeVisibilityEditModal(value: boolean): void {
    this.visibilityEditModal = value;
  }

  protected disableUser(user: any): void {
    const uuid: string = user.uuid;
    this.userService.disable(uuid).subscribe({
      next: () => {
        this.changeVisibilityModal(false);
        this.userService.notifyChangesToUsersData();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'ERRO',
          detail: 'Algo deu errado. Tente mais tarde.',
        });
      },
    });
  }

  protected enableUser(user: any): void {
    const uuid: string = user.uuid;
    this.userService.enable(uuid).subscribe({
      next: () => {
        this.changeVisibilityModal(false);
        this.userService.notifyChangesToUsersData();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'ERRO',
          detail: 'Algo deu errado. Tente mais tarde.',
        });
      },
    });
  }
}
