export interface Album {
    id: number;
    title: string;
    description: string;
    artistId: number;
    releaseDate: string;
    releaseState: string;
    price: number;
    currency: string;
    genres: string[];
    cover: string;
    artistName: string;
}
