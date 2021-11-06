export interface album {
    cover: {
        exists: boolean;
        name: string | null;
        url: string | null;
    };
}

export interface albumContent extends albumData {
    size: number;
    songs: song[];
}

export interface albumData extends album {
    name: string;
    url: string;
}

export interface song {
    name: string;
    url: string;
}

export interface songData extends song {
    album: {
        name: string;
        url: string;
    }
    size: number;
}


export type albumsData = albumData[];

export type songsData = songData[];