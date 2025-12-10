import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toastMessage$ = new BehaviorSubject<{ type: string, message: string } | null>(null);

  // generic show
  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage$.next({ type, message });

    setTimeout(() => {
      this.toastMessage$.next(null);
    }, 3000);
  }

  // success toast
  success(message: string) {
    this.show(message, 'success');
  }

  // error toast
  error(message: string) {
    this.show(message, 'error');
  }

  // info toast
  info(message: string) {
    this.show(message, 'info');
  }
}
