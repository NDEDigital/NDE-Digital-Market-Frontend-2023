import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy() {
    this.next();
    this.complete();
  }
}

// Custom operator
import { MonoTypeOperatorFunction } from 'rxjs';

export function takeUntilDestroyed<T>(
  destroy$: Observable<void>
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.pipe(takeUntil(destroy$));
}
