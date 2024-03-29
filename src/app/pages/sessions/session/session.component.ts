import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../components/layout/layout.component';
import { Session } from '../../../interfaces/session';
import { SessionService } from '../../../services/session.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SessionCardComponent } from '../../../components/session-card/session-card.component';
import { DatePipe } from '@angular/common';
import { HourPipe } from '../../../pipes/hour.pipe';
import { TimePipe } from '../../../pipes/time.pipe';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [
    LayoutComponent,
    ButtonModule,
    RouterLink,
    SessionCardComponent,
    DatePipe,
    HourPipe,
    TimePipe,
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css',
})
export class SessionComponent implements OnInit, OnDestroy {
  protected DEFAULT_COVER: string =
    'assets/images/placeholders/cover-image.jpg';
  protected loadingSessions: boolean = true;
  private subscriptions: Subscription[] = [];
  protected session: Session | undefined;
  protected sessions: Session[] = [];

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {}

  public ngOnInit(): void {
    this.loadData();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadData(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const uuid: string = params['uuid'];
        this.sessionService.findByIdPublic(uuid).subscribe((session) => {
          this.session = session;
          const genres = this.extractFirstGenre(session?.film?.genres);
          this.loadSessionsByGenres(genres);
        });
      })
    );
  }

  private loadSessionsByGenres(genres: string): void {
    this.sessionService.findByGenres(genres).subscribe((sessions) => {
      this.sessions = sessions;
      this.loadingSessions = false;
    });
  }

  private extractFirstGenre(text: string): string {
    return text.split(', ')[0];
  }
}
