import { Component } from '@angular/core';
import { HeaderComponent } from "../../component/header/header.component";
import { SubheaderComponent } from "../../component/subheader/subheader.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-basico',
  imports: [HeaderComponent, SubheaderComponent, RouterOutlet, CommonModule],
  templateUrl: './layout-basico.component.html',
  styleUrl: './layout-basico.component.css'
})
export class LayoutBasicoComponent {

}
