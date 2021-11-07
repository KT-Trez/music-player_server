import {albumContent, albumData, albumsData, song, songData, songsData} from './types/interfaces';
import cors from 'cors';
import express, {NextFunction, Request, Response} from 'express';
import fs from 'fs';
import ResponseHandler from './classes/ResponseHandler.js';


const app = express();
const publicDir = 'public';
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.static(publicDir));


app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile('index.html');
    next();
});

app.get('/admin', (req: Request, res: Response) => {
    res.sendFile('admin.html'); // todo: fix
});

app.get('/getAlbumsList', (req: Request, res: Response) => {
    const mp3Uri: string = 'mp3'
    const mp3DirRelativePath: string = publicDir + '/' + mp3Uri;

    fs.readdir('./' + mp3DirRelativePath, (err: Error, files: string[]) => {
        if (err)
            return ResponseHandler.handleServerError(res, err, 'Cannot read albums list');

        let dirs: string[] = files.filter((file: string) => fs.lstatSync('./' + mp3DirRelativePath + '/' + file).isDirectory());

        let albums: albumsData = dirs.map((dirName: string): albumData => {
            let dirContent = fs.readdirSync('./' + mp3DirRelativePath + '/' + dirName);
            let cover: string | null = dirContent.find((file: string) => file.endsWith('.jpg') || file.endsWith('.png'));
            return {
                cover: {
                    exists: !!cover,
                    name: cover,
                    url: mp3Uri + '/' + dirName + '/' + cover
                },
                name: dirName,
                url: mp3Uri + '/' + dirName
            };
        });

        res.send(JSON.stringify(albums));
    });
});


app.post('/getAlbumContent', (req: Request, res: Response) => {
    req.on('data', (data: string) => {
        let albumData: albumData = JSON.parse(data);

        fs.readdir('./' + publicDir + '/' + albumData.url, (err: Error, files: string[]) => {
            if (err)
                return ResponseHandler.handleServerError(res, err, 'Cannot read album\'s content');

            let dirSize = 0;
            files.forEach((fileName: string) => dirSize += fs.statSync('./' + publicDir + '/' + albumData.url + '/' + fileName).size);

            let songs = files.filter((fileName: string) => fileName.endsWith('mp3')).map((songName: string): song => {
                return {
                    name: songName,
                    url: albumData.url + '/' + songName
                }
            });

            let albumContent: albumContent = Object.assign(albumData, {
                songs: songs,
                size: dirSize
            });

            res.send(JSON.stringify(albumContent));
        });
    });
});

app.post('/getAlbumTracksList', (req: Request, res: Response) => {
    req.on('data', (data: string) => {
        let albumData: albumData = JSON.parse(data);

        fs.readdir('./' + publicDir + '/' + albumData.url, (err: Error, files: string[]) => {
            if (err)
                return ResponseHandler.handleServerError(res, err, 'Cannot read album\'s songs');

            let songs: songsData = files.filter((fileName: string) => fileName.endsWith('.mp3')).map((songName: string): songData => {
                let size = fs.statSync('./' + publicDir + '/' + albumData.url + '/' + songName).size;

                return {
                    album: {
                        name: albumData.name,
                        url: albumData.url
                    },
                    name: songName,
                    size: size,
                    url: albumData.url + '/' + songName
                }
            });

            res.send(JSON.stringify(songs));
        });
    });
});


app.listen(port, function() {
    console.log(
        `-------------------------` + '\n' +
        `Server started` + '\n' +
        ` > port: ${port}` + '\n' +
        `-------------------------`
    );
});