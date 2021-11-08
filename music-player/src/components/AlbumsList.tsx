import {album} from '../types/interfaces';
import {
    Avatar,
    Box,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    ListSubheader
} from '@mui/material';
import React, {useEffect, useState} from 'react';


interface AlbumListProps {
    setSelectedAlbum: Function
}

export default function AlbumsList({setSelectedAlbum}: AlbumListProps) {
    const [albums, setAlbums] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/getAlbumsList')
            .then(res => res.json())
            .then(albumsArr => {
                setAlbums(albumsArr);
                setIsFetching(false);
            })
            .catch(err => console.log(err));
    }, [isFetching]);

    return (
        <Box sx={{ overflow: 'hidden' }}>
            <List>
                <ListSubheader component="div" id="nested-list-subheader">
                    Albumy
                </ListSubheader>

                {isFetching &&
                <ListItem>
                    <CircularProgress/>
                </ListItem>
                }

                {albums.map((albumData: album, i: number) => {
                    return (
                        <React.Fragment key={i}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => setSelectedAlbum(albumData)}>
                                    <ListItemAvatar>
                                        <Avatar alt={albumData.cover.name} src={albumData.cover.url} variant="square"/>
                                    </ListItemAvatar>
                                    <ListItemText primary={albumData.name} primaryTypographyProps={{noWrap: true}}/>
                                </ListItemButton>
                            </ListItem>
                            <Divider/>
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );
}