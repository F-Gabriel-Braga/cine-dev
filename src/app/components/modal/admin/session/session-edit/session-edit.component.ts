import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FilmService } from '../../../../../services/film.service';
import { RoomService } from '../../../../../services/room.service';
import { Film } from '../../../../../interfaces/film';
import { Room } from '../../../../../interfaces/room';
import { SessionService } from '../../../../../services/session.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'modal-session-edit',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule],
  templateUrl: './session-edit.component.html',
  styleUrl: './session-edit.component.css',
})
export class ModalSessionEditComponent implements OnChanges, OnInit {
  @Input()
  visible: boolean = false;
  @Output()
  visibleChange = new EventEmitter<boolean>();
  @Input({ required: true })
  session: any = null;

  protected films: Film[] = [];
  protected rooms: Room[] = [];

  protected formSessionEditSubmitted: boolean = false;
  protected formSessionEdit: FormGroup = this.fb.group({
    uuid: ['', [Validators.required]],
    date: ['', [Validators.required]],
    hour: ['', [Validators.required]],
    ticketPrice: ['', [Validators.required]],
    film: this.fb.group({
      uuid: ['', [Validators.required]],
    }),
    room: this.fb.group({
      uuid: ['', [Validators.required]],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private filmService: FilmService,
    private roomService: RoomService,
    private sessionService: SessionService,
    private messageService: MessageService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const session = changes['session']?.currentValue;
    if (session) this.initializeForm(session);
  }

  public ngOnInit(): void {
    this.filmService.findAll().subscribe((films) => {
      this.films = films;
    });
    this.roomService.findAll().subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  protected get dateControl(): FormControl {
    return this.formSessionEdit.get('date') as FormControl;
  }

  protected get hourControl(): FormControl {
    return this.formSessionEdit.get('hour') as FormControl;
  }

  protected get ticketPriceControl(): FormControl {
    return this.formSessionEdit.get('ticketPrice') as FormControl;
  }

  protected get filmGroup(): FormGroup {
    return this.formSessionEdit.get('film') as FormGroup;
  }

  protected get roomGroup(): FormGroup {
    return this.formSessionEdit.get('room') as FormGroup;
  }

  protected get filmIdControl(): FormGroup {
    return this.filmGroup.get('uuid') as FormGroup;
  }

  protected get roomIdControl(): FormGroup {
    return this.roomGroup.get('uuid') as FormGroup;
  }

  protected onSubmit(): void {
    this.formSessionEditSubmitted = true;
    if (this.formSessionEdit.valid) {
      const session = this.formSessionEdit.value;
      const { uuid }: { uuid: string } = session;
      this.sessionService.update(uuid, session).subscribe({
        next: () => {
          this.changeVisibilityModal(false);
          this.sessionService.notifyChangesToSessionsData();
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

  changeVisibilityModal(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
    if (!visible) this.session = null;
  }

  private initializeForm(session: any): void {
    this.formSessionEditSubmitted = false;
    this.formSessionEdit.patchValue({
      uuid: session?.uuid,
      date: session?.date,
      hour: session?.hour,
      film: { uuid: session?.film?.uuid },
      room: { uuid: session?.room?.uuid },
      ticketPrice: session?.ticketPrice,
    });
  }
}
