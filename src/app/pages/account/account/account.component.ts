import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../components/layout/layout.component';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { FormProfileComponent } from '../form-profile/form-profile.component';
import { FormAccessComponent } from '../form-access/form-access.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [LayoutComponent, FormProfileComponent, FormAccessComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  protected DEFAULT_PERSON: string = 'assets/images/placeholders/person.jpg';
  user: User | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const { uuid } = this.authService.getAuthUser();
    this.userService.findById(uuid).subscribe((user) => {
      this.user = user;
    });
  }

  protected changeProfilePicture(event: any): void {
    const image = event.currentTarget.files[0];
    this.userService.convertImageToBase64(image, (base64: string) => {
      if (this.user) {
        const uuid = this.user.uuid;
        this.userService.updateProfilePicture(uuid, base64).subscribe(() => {
          this.loadData();
          this.messageService.add({
            summary: 'FEITO',
            severity: 'success',
            detail: 'Foto de perfil alterada.',
          });
        });
      }
    });
  }
}
