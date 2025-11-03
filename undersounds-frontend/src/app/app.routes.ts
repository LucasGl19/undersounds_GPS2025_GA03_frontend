import { Routes } from '@angular/router';
import { SongsComponent } from './pages/songs/songs.component';
import { LayoutBasicoComponent } from './layouts/layout-basico/layout-basico.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { CartComponent } from './pages/cart/cart.component';
import { MerchandisingComponent } from './pages/merchandising/merchandising.component';
import { ProfileComponent } from './pages/profile/profile.component';
export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicoComponent,
    children: [
      { path: 'songs', component: SongsComponent },
      { path: 'artists', component: ArtistsComponent },
      { path: 'merchandising', component: MerchandisingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'home', component: EmptyComponent },
      { path: 'cart', component: CartComponent }
    ]
  }
];
