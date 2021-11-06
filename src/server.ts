import {albumContent, albumData, albumsData, song, songData, songsData} from './types/interfaces';
import express, {NextFunction, Request, Response} from 'express';
import fs from 'fs';
import ResponseHandler from './classes/ResponseHandler.js';


const app = express();
const publicDir = 'public';
const port = process.env.PORT || 3000;


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

        let dirs: string[] = files.map((file: string) => {
            if (fs.lstatSync('./' + mp3DirRelativePath + '/' + file).isDirectory())
                return file;
        });

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

//const sRes = {
//    handleBadRequestError(message, error) {
//        sRes.setCORS();
//        res.writeHead(404);
//        res.end();
//        console.error('\u001b[31m' + ccs.beautifyTime(new Date()) + ' [ERROR] ' + message + ': ', error + '\u001b[0m');
//    },
//    handleDataResponse(contentType, resData) {
//        sRes.setCORS(res);
//        res.writeHead(200, {
//            'content-type': contentType,
//        });
//        res.end(resData);
//    },
//    handleDataResponseMultipleHeaders(headers, resData) {
//        sRes.setCORS();
//        res.writeHead(200, headers);
//        res.end(resData);
//    },
//    handleResponse(message, object) {
//        sRes.setCORS();
//        res.end();
//        console.error('\u001b[35m' + ccs.beautifyTime(new Date()) + ' [WARNING] ' + message + ': ', object + '\u001b[0m');
//    },
//    setCORS() {
//        res.setHeader('Access-Control-Allow-Origin', '*');
//        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
//        res.setHeader(
//            'Access-Control-Allow-Headers',
//            'Origin, X-Requested-With, Content-Type, Accept'
//        );
//    }
//};


app.listen(port, function() {
    console.log(
        `-------------------------` + '\n' +
        `Server started` + '\n' +
        ` > port: ${port}` + '\n' +
        `-------------------------`
    );
});