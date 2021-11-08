import AlbumsList from './components/AlbumsList';
import {Box, Drawer} from '@mui/material';
import React, {useState} from 'react';
import Player from './components/Player';

const drawerWidth = 240;


export default function AppRoot() {
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    return (
        <Box sx={{display: 'flex', height: 1, width: 1}}>
            <Drawer
                anchor='left'
                sx={{
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    }
                }}
                variant='permanent'>
                <AlbumsList setSelectedAlbum={setSelectedAlbum}/>
            </Drawer>
            <Player selectedAlbum={selectedAlbum}/>
        </Box>
    );
}