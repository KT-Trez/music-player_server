import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';
import albumRouter from './routes/album.js';
import updateAlbumsDB from './utils/update-albums-db.js';


const app = express();
const cdnAudioURL = process.env.AUDIO_CDN_URL ?? 'audio';
const cdnBaseURL = process.env.CDN_BASE_URL ?? 'cdn';
const port = process.env.PORT || 3000;

// refresh server config
updateAlbumsDB();


app.use(cors());
app.use('/cdn', express.static(path.resolve(cdnBaseURL)));
// routers
app.use('/album', albumRouter);


// return main page
app.get('/', (req: express.Request, res: express.Response) => {
	res.sendFile('index.html');
});

//app.post('/getAlbumContent', (req: Request, res: Response) => {
//	req.on('data', (data: string) => {
//		let albumData: albumData = JSON.parse(data);
//
//		fs.readdir('./' + cdnBaseURL + '/' + albumData.url, (err: Error, files: string[]) => {
//			if (err)
//				return ResponseHandler.handleServerError(res, err, 'Cannot read album\'s content');
//
//			let dirSize = 0;
//			files.forEach((fileName: string) => dirSize += fs.statSync('./' + cdnBaseURL + '/' + albumData.url + '/' + fileName).size);
//
//			let songs = files.filter((fileName: string) => fileName.endsWith('mp3')).map((songName: string): Song => {
//				return {
//					name: songName,
//					url: albumData.url + '/' + songName
//				}
//			});
//
//			let albumContent: AlbumContent = Object.assign(albumData, {
//				songs: songs,
//				size: dirSize
//			});
//
//			res.send(JSON.stringify(albumContent));
//		});
//	});
//});
//
//app.post('/getAlbumTracksList', (req: Request, res: Response) => {
//	req.on('data', (data: string) => {
//		let albumData: albumData = JSON.parse(data);
//
//		fs.readdir('./' + cdnBaseURL + '/' + albumData.url, (err: Error, files: string[]) => {
//			if (err)
//				return ResponseHandler.handleServerError(res, err, 'Cannot read album\'s songs');
//
//			let songs: songsData = files.filter((fileName: string) => fileName.endsWith('.mp3')).map((songName: string): songData => {
//				let size = fs.statSync('./' + cdnBaseURL + '/' + albumData.url + '/' + songName).size;
//
//				return {
//					album: {
//						name: albumData.name,
//						url: albumData.url
//					},
//					name: songName,
//					size: size,
//					url: albumData.url + '/' + songName
//				}
//			});
//
//			res.send(JSON.stringify(songs));
//		});
//	});
//});


export {
	cdnAudioURL,
	cdnBaseURL
}


app.listen(port, function () {
	console.log(
		`-------------------------` + '\n' +
		`Server started` + '\n' +
		` > port: ${port}` + '\n' +
		`-------------------------`
	);
});