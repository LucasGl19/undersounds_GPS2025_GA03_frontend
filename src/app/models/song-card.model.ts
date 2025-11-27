export interface SongCard {
  id: number | string; // Puede ser number (mock) o string (backend UUID)
  artistId: number | string; // Backend usa UUID string, mock usa number
  title: string;
  artist: string;
  description: string;
  format: string;
  price: string;
  image: string;
  audio: string;
  durationSec: number;
  createdAt: string;
  // Campos adicionales del backend
  albumId?: string;
  labelId?: string;
  genre?: string;
  genres?: string[];
  tag?: string;
  tags?: string[];
  language?: string;
  releaseDate?: string;
  trackNumber?: number;
  playCount?: number;
}
