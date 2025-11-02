import { Routes } from '@angular/router';
import { SongsComponent } from './pages/songs/songs.component';
import { LayoutBasicoComponent } from './layouts/layout-basico/layout-basico.component';
import { EmptyComponent } from './pages/empty/empty.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicoComponent,
    children: [
      { path: 'songs', component: SongsComponent },
            { path: '', pathMatch: 'full', redirectTo: 'home' }, // redirige a una ruta "home" vacía
      { path: 'home', component: EmptyComponent }
    ]
  }
];
