import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-share-button',
  imports: [MatIconModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.css',
})
export class ShareButtonComponent {
  @Input() url: string = '';

  buttonText: string = 'Compartir';

  copyLink(){
    if (!this.url) return;
    navigator.clipboard.writeText(this.url);
    this.buttonText = '¡Enlace copiado!';
    setTimeout(() => {
      this.buttonText = 'Compartir';
    }, 2000);
  }
}
