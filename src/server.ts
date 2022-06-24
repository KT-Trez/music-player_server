import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';
import {albumsRouter} from './routes/albums.js';
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
app.use('/albums', albumsRouter);


// return main page
app.get('/', (req: express.Request, res: express.Response) => {
	res.sendFile('index.html');
});


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