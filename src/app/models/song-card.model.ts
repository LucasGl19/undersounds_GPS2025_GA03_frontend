export interface SongCard {
  id: number;
  artistId: number;
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
