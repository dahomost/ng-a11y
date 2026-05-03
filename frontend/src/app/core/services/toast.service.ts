import { Injectable, signal } from '@angular/core';

/** Accessible status region content for API failures */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);

  show(text: string): void {
    this.message.set(text);
  }

  clear(): void {
    this.message.set(null);
  }
}
