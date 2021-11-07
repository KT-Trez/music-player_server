import {albumContent} from '../types/interfaces';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Icon,
    IconButton, LinearProgress,
    Skeleton, Switch,
    Typography
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import TracksList from './TracksList';


interface PlayersProps {
    selectedAlbum: albumContent | null;
}

export default function Player({selectedAlbum}: PlayersProps) {
    const [isFetching, setIsFetching] = useState(true);
    const [progress, setProgress] = useState(0);
    const [songs, setSongs] = useState([]);
    const [songUri, setSongUri] = useState(null);

    useEffect(() => {
        if (selectedAlbum)
            fetch('http://localhost:3000/getAlbumTracksList', {
                body: JSON.stringify(selectedAlbum),
                method: 'post'
            })
                .then(res => res.json())
                .then(songsArr => {
                    setSongs(songsArr);
                    setIsFetching(true);
                })
                .catch(err => console.log(err));
    }, [selectedAlbum]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden', height: 1, width: 1 }}>
            <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 0.35, margin: '5px' }}>

                <CardContent sx={{ flexGrow: 1 }}>
                    {selectedAlbum ?
                        <CardMedia alt={selectedAlbum?.cover.name} component='img' image={selectedAlbum?.cover.url} sx={{ height: 200, width: 200 }}/> :
                        <Skeleton animation={false} height={200} variant='rectangular' width={200}/>
                    }

                    <Typography component="div" style={{marginTop: '15px'}} variant="h5">
                        {selectedAlbum ? selectedAlbum.name : 'Nazwa albumu'}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {selectedAlbum ? selectedAlbum.size : 'Rozmiar albumu'} // todo: refactor server response
                    </Typography>
                </CardContent>

                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>

                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                        <audio>
                            <source src={songUri ? songUri : undefined} type='audio/mpeg'/>
                            Twoja przeglądarka nie wspiera odtwarzania audio.
                        </audio>

                        <CardContent sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton>
                                <Icon sx={{ fontSize: '60px'}}>skip_previous</Icon>
                            </IconButton>
                            <IconButton>
                                <Icon sx={{ fontSize: '60px'}}>play_arrow</Icon>
                            </IconButton>
                            <IconButton>
                                <Icon sx={{ fontSize: '60px'}}>skip_next</Icon>
                            </IconButton>
                        </CardContent>

                        <CardContent sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton>
                                <Icon sx={{ fontSize: '25px'}}>repeat</Icon>
                            </IconButton>
                            <Switch checkedIcon={<Icon sx={{ fontSize: '25px'}} style={{ marginTop: "calc(51.5px / 2 - 28px)" }}>play_circle_rounded</Icon>}/>
                            <IconButton>
                                <Icon sx={{ fontSize: '25px'}}>shuffle</Icon>
                            </IconButton>
                        </CardContent>
                    </CardContent>

                    <CardContent sx={{ flexGrow: 1 }}>
                            <LinearProgress variant="determinate" value={progress}/>
                    </CardContent>

                </CardContent>

            </Card>
            <Card sx={{ height: 0.65, margin: '5px', overflow: 'auto' }}>
                <TracksList isFetching={isFetching} setSongUri={setSongUri} songs={songs}/>
            </Card>
        </Box>
    );
}