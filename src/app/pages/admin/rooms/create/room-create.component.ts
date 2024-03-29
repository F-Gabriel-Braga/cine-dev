import { SeatMapCreatorComponent } from '../../../../components/seat-map/creator/map-creator.component';
import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../../components/layout/layout.component';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../../../services/room.service';
import { MessageService } from 'primeng/api';
import { Area } from '../../../../interfaces/area';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LayoutComponent,
    RouterLink,
    InputTextModule,
    SeatMapCreatorComponent,
    ButtonModule,
    NgClass,
  ],
  templateUrl: './room-create.component.html',
  styleUrl: './room-create.component.css',
})
export class RoomCreateComponent {
  formSubmitted: boolean = false;
  form: FormGroup = this.fb.group({
    uuid: [''],
    number: ['', [Validators.required]],
    projectionType: ['', [Validators.required]],
    map: this.fb.group({
      uuid: [''],
      width: ['', [Validators.required, Validators.min(1)]],
      height: ['', [Validators.required, Validators.min(1)]],
      areas: this.fb.array([]),
    }),
  });

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    private messageService: MessageService
  ) {}

  protected get mapGroup(): FormGroup {
    return this.form.get('map') as FormGroup;
  }

  protected get numberControl(): FormGroup {
    return this.form.get('number') as FormGroup;
  }

  protected get projectionTypeControl(): FormGroup {
    return this.form.get('projectionType') as FormGroup;
  }

  protected onSubmit(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const room = this.form.value;
      room.map.areas = room.map.areas.flat();
      this.roomService.create(room).subscribe({
        next: () => {
          this.router.navigate(['/admin/rooms']);
        },
        error: ({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERRO',
            detail: error.message,
          });
        },
      });
    }
  }
}
