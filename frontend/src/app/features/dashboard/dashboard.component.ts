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
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
