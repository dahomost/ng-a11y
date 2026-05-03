import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';
import { CollectionsService } from '../collections/collections.service';
import { TagsService } from '../tags/tags.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, UiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-3">
      <div class="col-md-6">
        <app-ui-card title="Collections" headingId="dash-collections" subtitle="Total cataloged items.">
          <p class="display-6 mb-3" aria-live="polite">{{ collectionCount() }}</p>
          <a class="btn btn-primary" routerLink="/collections">Manage collections</a>
        </app-ui-card>
      </div>
      <div class="col-md-6">
        <app-ui-card title="Tags" headingId="dash-tags" subtitle="Controlled vocabulary size.">
          <p class="display-6 mb-3" aria-live="polite">{{ tagCount() }}</p>
        </app-ui-card>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly collections = inject(CollectionsService);
  private readonly tags = inject(TagsService);
  protected readonly auth = inject(AuthService);

  protected readonly collectionCount = signal<number | null>(null);
  protected readonly tagCount = signal<number | null>(null);

  ngOnInit(): void {
    forkJoin({
      collections: this.collections.list(),
      tags: this.tags.list(),
    }).subscribe({
      next: ({ collections, tags }) => {
        this.collectionCount.set(collections.collections.length);
        this.tagCount.set(tags.tags.length);
      },
    });
  }
}
