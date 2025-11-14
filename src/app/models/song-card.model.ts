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
  createdAt: string
}
