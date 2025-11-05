import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
type SongCard = {
  title: string;
  artist: string;
  description: string;
  format: string;
  price: string;
  image: string;
};

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css',
})
export class SongsComponent {
  readonly songs: SongCard[] = [
    {
      title: 'Ocean Echoes',
      artist: 'Luna Waves',
      description: 'Ambient etéreo grabado en cinta con texturas analógicas y voces soñadoras.',
      format: 'Álbum digital',
      price: '7 €',
      image: 'assets/images/covers/cover-ambient.svg',
    },
    {
      title: 'Noches de neón',
      artist: 'Club Prisma',
      description: 'Synthwave nocturno inspirado en paseos urbanos y luces neón interminables.',
      format: 'Cassette edición limitada',
      price: '11 €',
      image: 'assets/images/covers/cover-synth.svg',
    },
    {
      title: 'Café de medianoche',
      artist: 'La Pluie',
      description: 'Beats lofi cálidos para estudiar, relajarse o escapar de la lluvia.',
      format: 'Streaming + descarga',
      price: 'Nombre tu precio',
      image: 'assets/images/covers/cover-lofi.svg',
    },
    {
      title: 'Sueños en Super 8',
      artist: 'Aurora Fade',
      description: 'Shoegaze nebuloso con capas de guitarras y voces reverberadas.',
      format: 'Vinilo de 12"',
      price: '18 €',
      image: 'assets/images/covers/cover-dream.svg',
    },
    {
      title: 'Luz primera',
      artist: 'Valle Naciente',
      description: 'Folk experimental con arreglos orquestales y grabaciones de campo.',
      format: 'CD artesanal',
      price: '12 €',
      image: 'assets/images/covers/cover-sunrise.svg',
    },
    {
      title: 'Ritmo subterráneo',
      artist: 'BPM95',
      description: 'House profundo directo desde la escena independiente latinoamericana.',
      format: 'Descarga + stems',
      price: '9 €',
      image: 'assets/images/covers/cover-club.svg',
    },
  ];
}

