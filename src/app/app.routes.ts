import { Routes } from '@angular/router';
import { SongsComponent } from './pages/songs/songs.component';
import { LayoutBasicoComponent } from './layouts/layout-basico/layout-basico.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { CartComponent } from './pages/cart/cart.component';
import { MerchandisingComponent } from './pages/merchandising/merchandising.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { HelpComponent } from './pages/help/help.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { RegisterComponent } from './pages/register/register.component';
import { UploadSongComponent } from './upload-song/upload-song.component';
import { UploadAlbumComponent } from './upload-album/upload-album.component';
export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicoComponent,
    children: [
      { path: 'songs', component: SongsComponent },
      { path: 'artists', component: ArtistsComponent },
      { path: 'merchandising', component: MerchandisingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'home', component: EmptyComponent },
      { path: 'cart', component: CartComponent },
      { path: 'about', component: AboutComponent },
      { path: 'help', component: HelpComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'upload-song', component: UploadSongComponent },
      {path: 'upload-album', component: UploadAlbumComponent}
    ],
  },
];
