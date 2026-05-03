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
  templateUrl: './collections.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
