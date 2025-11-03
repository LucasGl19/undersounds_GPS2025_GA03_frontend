import { Component } from '@angular/core';
import { HeaderComponent } from '../../component/header/header.component';
import { SubheaderComponent } from '../../component/subheader/subheader.component';
import { BackToTopButtonComponent } from '../../component/back-to-top-button/back-to-top-button.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../component/footer/footer.component';

@Component({
  selector: 'app-layout-basico',
  imports: [
    HeaderComponent,
    SubheaderComponent,
    BackToTopButtonComponent,
    FooterComponent,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './layout-basico.component.html',
  styleUrls: ['./layout-basico.component.css'],
})
export class LayoutBasicoComponent {}
