import {song} from '../types/interfaces';
import {Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader} from '@mui/material';
import React from 'react';


interface TracksListProps {
    isFetching: boolean;
    selectSong: Function;
    songs: song[];
}

export default function TracksList({isFetching, selectSong, songs}: TracksListProps) {
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
                            <ListItemButton onClick={() => selectSong(trackData)}>
                                <ListItemText
                                    primary={trackData.name}
                                    primaryTypographyProps={{ noWrap: true}}
                                    secondary={(trackData.size / 1048576).toFixed(2) + ' MB'}
                                    secondaryTypographyProps={{ noWrap: true}}
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