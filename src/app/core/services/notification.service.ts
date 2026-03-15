import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  success(message: string, title = 'Sucesso'): void {
    this.toastr.success(message);
  }

  error(message: string, title = 'Erro'): void {
    this.toastr.error(message);
  }

  info(message: string, title = 'Informação'): void {
    this.toastr.info(message);
  }

  warning(message: string, title = 'Atenção'): void {
    this.toastr.warning(message);
  }
}
