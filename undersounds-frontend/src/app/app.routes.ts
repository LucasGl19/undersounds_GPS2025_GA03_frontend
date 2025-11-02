import { Routes } from '@angular/router';
import { SongsComponent } from './pages/songs/songs.component';
import { LayoutBasicoComponent } from './layouts/layout-basico/layout-basico.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { ArtistsComponent } from './pages/artists/artists.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicoComponent,
    children: [
      { path: 'songs', component: SongsComponent },
      { path: 'artists', component: ArtistsComponent },
      { path: 'home', component: EmptyComponent }
    ]
  }
];
