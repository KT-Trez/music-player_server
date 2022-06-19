export interface Album {
	cover: {
		cdn: string;
		name: string;
	}
	hasCover: boolean;
	id: number;
	name: string;
	path?: string;
	size: number;
}

export interface Song {
	album: {
		id: number;
		name: string;
	}
	cdn: string;
	name: string;
	size: number;
}