//noinspection JSIgnoredPromiseFromCall

import styled from '@emotion/styled';
import Tools from '../classes/Tools';
import {albumContent, song} from '../types/interfaces';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Icon,
    IconButton,
    Skeleton, Slider, Switch,
    Typography
} from '@mui/material';
import React, {Component} from 'react';
import TracksList from './TracksList';


interface PlayersProps {
    selectedAlbum: albumContent | null;
}

interface PlayerState {
    flags: {
        autoplay: boolean;
        mixin: boolean;
        repeat: boolean;
    };
    isFetching: boolean;
    songIsPaused: boolean;
    songSelected: song | null;
    songSelectedIndex: number | null;
    songs: song[] | null;
    time: {
        current: number | null;
        max: number | null;
    }
}

const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: 0.2,
    marginTop: '2px',
    opacity: 0.38
});

//noinspection DuplicatedCode
export default class Player extends Component<PlayersProps, PlayerState> {
    private readonly audioRef: React.RefObject<HTMLAudioElement>;

    constructor(props: PlayersProps) {
        super(props);

        this.audioRef = React.createRef();

        this.audioEnded = this.audioEnded.bind(this);
        this.audioLoaded = this.audioLoaded.bind(this);
        this.audioUptime = this.audioUptime.bind(this);
        this.controlsAutoplay = this.controlsAutoplay.bind(this);
        this.controlsChangeSong = this.controlsChangeSong.bind(this);
        this.controlsMixin = this.controlsMixin.bind(this);
        this.controlsPause = this.controlsPause.bind(this);
        this.controlsRepeat = this.controlsRepeat.bind(this);
        this.selectSong = this.selectSong.bind(this);
        this.setCurrentTime = this.setCurrentTime.bind(this);
        
        this.state = {
            flags: {
                autoplay: false,
                mixin: false,
                repeat: false
            },
            isFetching: true,
            songIsPaused: false,
            songSelected: null,
            songSelectedIndex: null,
            songs: null,
            time: {
                current: null,
                max: null
            }
        };
    }

    componentDidUpdate(prevProps: Readonly<PlayersProps>, prevState: Readonly<PlayerState>, snapshot?: any) {
        if (this.props.selectedAlbum && prevProps.selectedAlbum !== this.props.selectedAlbum)
            fetch('http://localhost:3000/getAlbumTracksList', {
                body: JSON.stringify(this.props.selectedAlbum),
                method: 'post'
            })
                .then(res => res.json())
                .then(songsArr => {
                    this.setState({
                        isFetching: false,
                        songs: songsArr
                    });
                })
                .catch(err => console.log(err));
    }

    /**
     * Actions to execute after song stopped.
     */
    audioEnded() {
        if (this.state.flags.autoplay && this.state.flags.repeat)
            this.audioLoaded();
        else if (this.state.flags.mixin)
            this.selectSong(this.state.songs![Tools.getRandomIntInclusive(0, this.state.songs!.length - 1)]);
        else if (this.state.flags.repeat)
            this.setState(prevState => ({
                time: {
                    ...prevState.time,
                    current: 0.00
                }
            }));
        else if (this.state.flags.autoplay)
            this.controlsChangeSong(1);
        else {
            this.setState({
                songSelected: null,
                songSelectedIndex: null,
                time: {
                    current: null,
                    max: null
                }
            });
        }
    }

    /**
     * Actions to execute after audio src is loaded.
     */
    audioLoaded() {
        let audioPlayerDOM = this.audioRef.current! as HTMLAudioElement;

        this.setState({
            time: {
                current: 0.00,
                max: Math.round(audioPlayerDOM.duration * 100) / 100
            }
        });

        audioPlayerDOM.volume = 0.1;
        audioPlayerDOM.play();
    }

    /**
     * Actions to execute during audio progress.
     */
    audioUptime() {
        this.setState(prevState => ({
            time: {
                ...prevState.time,
                current: Math.round(this.audioRef.current!.currentTime * 100) / 100
            }
        }));
    }

    /**
     * Rounds and formats time to 'xx' version.
     * @param {number} time - to digits to operate.
     * @return {string} - rounded and formatted time.
     */
    formatTime(time: number): string {
        let roundedTime = Math.floor(time).toString();
        if (roundedTime.length === 1)
            return '0' + roundedTime;
        else
            return roundedTime;
    }

    /**
     * Turn on/off autoplay flag.
     */
    controlsAutoplay() {
        this.setState(prevState => ({
            flags: {
                ...prevState.flags,
                autoplay: !this.state.flags.autoplay
            }
        }));
    }

    /**
     * Turn on/off music mixin flag.
     */
    controlsMixin() {
        this.setState(prevState => ({
            flags: {
                ...prevState.flags,
                mixin: !this.state.flags.mixin,
                repeat: false
            }
        }));
    }

    /**
     * Change current song.
     * @param {number} step - how many steps over song arr should be taken.
     */
    controlsChangeSong(step: number) {
        let nextIndex;
        if (this.state.songSelectedIndex! + step < 0)
            nextIndex = this.state.songSelectedIndex! + step;
        else
            nextIndex = (this.state.songSelectedIndex! + step) % this.state.songs!.length;
        let nextSong = this.state.songs![nextIndex];

        this.selectSong(nextSong);
    }

    /**
     * Pauses song.
     */
    controlsPause() {
        if (!this.state.songIsPaused)
            this.audioRef.current?.pause();
        else
            this.audioRef.current?.play();
        this.setState({
            songIsPaused: !this.state.songIsPaused
        });
    }

    /**
     * Turn on/off song repeating.
     */
    controlsRepeat() {
        this.setState(prevState => ({
            flags: {
                ...prevState.flags,
                mixin: false,
                repeat: !this.state.flags.repeat
            }
        }));
    }

    /**
     * Loads song.
     * @param {song} song - song data.
     * @return {Promise<void>} - loads song after loading it's data.
     */
    async selectSong(song: song) {
        await this.setState({
            songIsPaused: false,
            songSelected: song,
            songSelectedIndex: this.state.songs!.indexOf(song)
        });
        this.audioRef.current!.load();
    }

    /**
     * Rewind current song to specified time.
     * @param {number} time - second to which song will be rewind.
     */
    setCurrentTime(time: number) {
        this.audioRef.current!.currentTime = time;
        this.setState(prevState => ({
            time: {
                ...prevState.time,
                current: time
            }
        }));
    }

    /**
     * Renders component.
     * @return {JSX.Element} - rendered component.
     */
    render() {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden', height: 1, width: 1 }}>
                <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 0.35, margin: '5px' }}>

                    {/* album image & data */}
                    <CardContent sx={{ width: 1/3 }}>
                        {this.props.selectedAlbum ?
                            <CardMedia alt={this.props.selectedAlbum?.cover.name} component='img' image={this.props.selectedAlbum?.cover.url} sx={{ height: 200, width: 200 }}/> :
                            <Skeleton animation={false} height={200} variant='rectangular' width={200}/>
                        }

                        <Typography component="div" noWrap style={{marginTop: '15px'}} variant="h5">
                            {this.props.selectedAlbum ? this.props.selectedAlbum.name : 'Wybierz album'}
                        </Typography>
                        <Typography color="text.secondary" component="div" noWrap variant="subtitle1">
                            {this.state.songSelected ? this.state.songSelected!.name : 'Wybierz utwór'}
                        </Typography>
                    </CardContent>

                    {/* player controls elements */}
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 2/3 }}>
                        {/* buttons controls */}
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                            {/* html audio player element */}
                            <audio onEnded={this.audioEnded} onLoadedData={this.audioLoaded} onTimeUpdate={this.audioUptime} ref={this.audioRef}>
                                <source src={this.state.songSelected ? this.state.songSelected.url : undefined} type='audio/mpeg'/>
                                Twoja przeglądarka nie wspiera odtwarzania audio.
                            </audio>

                            {/* audio controls */}
                            <CardContent sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <IconButton onClick={() => this.controlsChangeSong(-1)}>
                                    <Icon sx={{ fontSize: '60px'}}>skip_previous</Icon>
                                </IconButton>
                                <IconButton onClick={this.controlsPause}>
                                    <Icon sx={{ fontSize: '60px'}}>{this.state.songIsPaused ? 'play_arrow' : 'pause'}</Icon>
                                </IconButton>
                                <IconButton onClick={() => this.controlsChangeSong(1)}>
                                    <Icon sx={{ fontSize: '60px'}}>skip_next</Icon>
                                </IconButton>
                            </CardContent>

                            {/* track playing controls */}
                            <CardContent sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <IconButton>
                                    <Icon color={this.state.flags.repeat ? 'primary' : 'inherit'} onClick={this.controlsRepeat} sx={{ fontSize: '25px'}}>repeat</Icon>
                                </IconButton>
                                <Switch checkedIcon={<Icon sx={{ fontSize: '25px'}} style={{ marginTop: "calc(51.5px / 2 - 28px)" }}>play_circle_rounded</Icon>} onChange={this.controlsAutoplay}/>
                                <IconButton>
                                    <Icon color={this.state.flags.mixin ? 'primary' : 'inherit'} onClick={this.controlsMixin} sx={{ fontSize: '25px'}}>shuffle</Icon>
                                </IconButton>
                            </CardContent>
                        </CardContent>

                        {/* player progress */}
                        <CardContent sx={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TinyText>{this.state.time.current ? `${this.formatTime(this.state.time.current / 60)}:${this.formatTime(this.state.time.current % 60)}` : '00:00'}</TinyText>
                            <Slider max={this.state.time.max ? this.state.time.max : 0} min={0} onChange={(_, value) => this.setCurrentTime(value as number)} step={0.01}
                                    sx={{ width: 0.86,
                                        '& .MuiSlider-thumb': {
                                            width: 12,
                                            height: 12
                                        }
                                    }}
                                    value={this.state.time.current ? this.state.time.current : 0}/>
                            <TinyText>{this.state.time.max ? `${this.formatTime(this.state.time.max / 60)}:${this.formatTime(this.state.time.max % 60)}` : '00:00'}</TinyText>
                        </CardContent>

                    </CardContent>
                </Card>

                {/* tracks list */}
                <Card sx={{ height: 0.65, margin: '5px', overflow: 'auto' }}>
                    <TracksList isFetching={this.state.isFetching} selectSong={this.selectSong} songs={this.state.songs ? this.state.songs : []}/>
                </Card>
            </Box>
        );
    }
}