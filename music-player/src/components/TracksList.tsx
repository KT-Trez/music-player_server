import {song} from '../types/interfaces';
import {Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader} from '@mui/material';
import React from 'react';


interface TracksListProps {
    isFetching: boolean;
    setSongUri: Function;
    songs: song[];
}

export default function TracksList({isFetching, setSongUri, songs}: TracksListProps) {
    return (
        <List dense>
            <ListSubheader component="div" id="nested-list-subheader">
                Utwory
            </ListSubheader>

            {isFetching &&
            <ListItem>
                <ListItemText primary={'Wybierz album'}/>
            </ListItem>
            }

            {songs.map((trackData: song, i: number) => {
                return (
                    <React.Fragment key={i}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setSongUri(trackData.url)}>
                                <ListItemText
                                    primary={trackData.name}
                                    secondary={(trackData.size / 1048576).toFixed(2) + ' MB'}
                                />
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                    </React.Fragment>
                );
            })}
        </List>
    );
}