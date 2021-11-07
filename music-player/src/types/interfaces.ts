export interface album {
    cover: {
        exists: boolean;
        name: string | undefined;
        url: string | undefined;
    };
    name: string;
    url: string;
}

export interface albumContent extends album {
    size: number;
    songs: song[];
}

export interface song {
    album: {
        name: string;
        url: string;
    }
    name: string;
    size: number;
    url: string;
}