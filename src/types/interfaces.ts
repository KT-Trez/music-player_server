export interface Album {
	cover: {
		cdn: string | undefined;
		hasCover: boolean;
		name: string;
	}
	id: string;
	name: string;
	path?: string;
	size: number;
}

export interface Song {
	album: {
		id: string;
		name: string;
	}
	cover: {
		cdn: string | undefined;
		hasCover: boolean;
		name: string;
	}
	id: string;
	cdn: string;
	name: string;
	path?: string;
	size: number;
}