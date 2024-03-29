import { FilmService } from './../../../../../services/film.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'modal-film-create',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule],
  templateUrl: './film-create.component.html',
  styleUrl: './film-create.component.css',
})
export class ModalFilmCreateComponent implements OnChanges {
  @Input()
  visible: boolean = false;
  @Output()
  visibleChange = new EventEmitter<boolean>();

  protected formFilmCreateSubmitted: boolean = false;
  protected formFilmCreate: FormGroup = this.fb.group(this.getFilmFormGroup());
  protected btnDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private filmService: FilmService,
    private messageService: MessageService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  protected get titleControl(): FormControl {
    return this.formFilmCreate.get('title') as FormControl;
  }

  protected get resumeControl(): FormControl {
    return this.formFilmCreate.get('resume') as FormControl;
  }

  protected get genresControl(): FormControl {
    return this.formFilmCreate.get('genres') as FormControl;
  }

  protected get durationControl(): FormControl {
    return this.formFilmCreate.get('duration') as FormControl;
  }

  protected get publishedInControl(): FormControl {
    return this.formFilmCreate.get('publishedIn') as FormControl;
  }

  protected get coverImageControl(): FormControl {
    return this.formFilmCreate.get('coverImage') as FormControl;
  }

  protected onSubmit(): void {
    this.formFilmCreateSubmitted = true;
    if (this.formFilmCreate.valid) {
      const film = this.formFilmCreate.value;
      this.filmService.create(film).subscribe({
        next: () => {
          this.changeVisibilityModal(false);
          this.filmService.notifyChangesToFilmsData();
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

  public selectCoverImage(event: any): void {
    this.btnDisabled = true;
    const image = event.currentTarget.files[0];
    this.filmService.convertImageToBase64(image, (base64: string) => {
      this.formFilmCreate.get('coverImage')?.setValue(base64);
      this.btnDisabled = false;
    });
  }

  protected changeVisibilityModal(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
    this.initializeForm();
  }

  private initializeForm(): void {
    this.formFilmCreateSubmitted = false;
    this.formFilmCreate = this.fb.group(this.getFilmFormGroup());
  }

  private getFilmFormGroup() {
    return {
      title: ['', [Validators.required, Validators.maxLength(120)]],
      resume: ['', [Validators.required, Validators.maxLength(500)]],
      genres: ['', [Validators.required, Validators.maxLength(255)]],
      duration: ['', [Validators.required, Validators.max(3000)]],
      publishedIn: ['', [Validators.required]],
      coverImage: ['', [Validators.required]],
      coverImageFile: ['', [Validators.required]],
    };
  }
}
