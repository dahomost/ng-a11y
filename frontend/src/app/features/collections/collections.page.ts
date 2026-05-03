import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import type { CollectionDto } from '../../shared/models/api.types';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';
import { UiModalComponent } from '../../shared/ui/ui-modal/ui-modal.component';
import { UiTableComponent } from '../../shared/ui/ui-table/ui-table.component';
import { CollectionsService } from './collections.service';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    UiButtonComponent,
    UiCardComponent,
    UiModalComponent,
    UiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-ui-card title="Collections" subtitle="Catalog items available to patrons." headingId="collections-heading">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <a class="btn btn-outline-secondary" routerLink="/dashboard">Back to dashboard</a>
        @if (canManage()) {
          <app-ui-button [busy]="saving()" (clicked)="openCreate()">Add collection</app-ui-button>
        }
      </div>

      <app-ui-table caption="Library collections" [columns]="columns()">
        @for (c of rows(); track c.id) {
          <tr>
            <td>{{ c.title }}</td>
            <td>{{ c.author ?? '—' }}</td>
            <td>{{ c.category ?? '—' }}</td>
            <td>{{ c.language ?? '—' }}</td>
            <td class="text-end">
              @if (canManage()) {
                <app-ui-button variant="outline" (clicked)="openEdit(c)">Edit</app-ui-button>
                <app-ui-button variant="danger" class="ms-2" [busy]="deletingId() === c.id" (clicked)="remove(c)">
                  Delete
                </app-ui-button>
              }
            </td>
          </tr>
        }
      </app-ui-table>
    </app-ui-card>

    <app-ui-modal
      [open]="modalOpen()"
      [title]="modalTitle()"
      titleId="collection-modal-title"
      (close)="closeModal()"
      (backdropClose)="closeModal()"
    >
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label" for="col-title">Title</label>
            <input
              id="col-title"
              class="form-control"
              formControlName="title"
              required
              aria-required="true"
              [attr.aria-invalid]="form.controls.title.invalid && form.controls.title.touched ? 'true' : 'false'"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="col-author">Author</label>
            <input id="col-author" class="form-control" formControlName="author" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="col-category">Category</label>
            <input id="col-category" class="form-control" formControlName="category" />
          </div>
          <div class="col-12">
            <label class="form-label" for="col-desc">Description</label>
            <textarea id="col-desc" class="form-control" rows="3" formControlName="description"></textarea>
          </div>
          <div class="col-md-4">
            <label class="form-label" for="col-pub">Published date</label>
            <input id="col-pub" type="date" class="form-control" formControlName="publishedDate" />
          </div>
          <div class="col-md-4">
            <label class="form-label" for="col-isbn">ISBN</label>
            <input id="col-isbn" class="form-control" formControlName="isbn" />
          </div>
          <div class="col-md-4">
            <label class="form-label" for="col-lang">Language</label>
            <input id="col-lang" class="form-control" formControlName="language" />
          </div>
        </div>
        <div class="mt-4 d-flex gap-2 justify-content-end">
          <app-ui-button variant="outline" type="button" (clicked)="closeModal()">Cancel</app-ui-button>
          <app-ui-button type="submit" [busy]="saving()" [disabled]="form.invalid">Save</app-ui-button>
        </div>
      </form>
    </app-ui-modal>
  `,
})
export class CollectionsPage implements OnInit {
  private readonly api = inject(CollectionsService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly rows = signal<CollectionDto[]>([]);
  protected readonly modalOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<string | null>(null);

  protected readonly canManage = computed(() => this.auth.canManageCatalog());
  protected readonly columns = signal([
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' },
    { key: 'language', label: 'Language' },
    { key: 'actions', label: 'Actions' },
  ]);

  protected readonly modalTitle = computed(() => (this.editingId() ? 'Edit collection' : 'New collection'));

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(512)]],
    author: [''],
    description: [''],
    category: [''],
    publishedDate: [''],
    isbn: [''],
    language: [''],
  });

  ngOnInit(): void {
    this.reload();
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', author: '', description: '', category: '', publishedDate: '', isbn: '', language: '' });
    this.modalOpen.set(true);
  }

  protected openEdit(row: CollectionDto): void {
    this.editingId.set(row.id);
    this.form.patchValue({
      title: row.title,
      author: row.author ?? '',
      description: row.description ?? '',
      category: row.category ?? '',
      publishedDate: row.publishedDate ?? '',
      isbn: row.isbn ?? '',
      language: row.language ?? '',
    });
    this.modalOpen.set(true);
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Please fix validation errors.');
      return;
    }
    const v = this.form.getRawValue();
    const payload = {
      title: v.title,
      author: v.author || null,
      description: v.description || null,
      category: v.category || null,
      publishedDate: v.publishedDate || null,
      isbn: v.isbn || null,
      language: v.language || null,
    };
    this.saving.set(true);
    const id = this.editingId();
    const req$ = id ? this.api.update(id, payload) : this.api.create(payload);
    req$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.show('Saved.');
          this.closeModal();
          this.reload();
        },
      });
  }

  protected remove(row: CollectionDto): void {
    this.deletingId.set(row.id);
    this.api
      .remove(row.id)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe({
        next: () => {
          this.toast.show('Deleted.');
          this.reload();
        },
      });
  }

  private reload(): void {
    this.api.list().subscribe({
      next: (res) => this.rows.set(res.collections),
    });
  }
}
