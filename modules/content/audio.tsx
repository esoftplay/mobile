// 
import React from 'react'
import { Component } from 'react';
import { Audio } from 'expo';

export interface ContentAudioProps {
  onRef: (ref: any) => void,
  code: string,
  onStatusChange: (status: any) => void
}

export interface ContentAudioState {
  playbackInstanceName: string,
  muted: boolean,
  playbackInstancePosition: any,
  playbackInstanceDuration: any,
  shouldPlay: boolean,
  isPlaying: boolean,
  isBuffering: boolean,
  isLoading: boolean,
  volume: number,
}

// create a component
class eaudio extends Component<ContentAudioProps, ContentAudioState> {
  playbackInstance: any
  state: ContentAudioState;
  props: ContentAudioProps;
  constructor(props: ContentAudioProps) {
    super(props)
    this.props = props;
    this.playbackInstance = null
    this.state = {
      playbackInstanceName: 'loading...',
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      volume: 1.0,
    }
  }

  componentDidMount() {
    this.props.onRef(this)
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    })
    this._loadNewPlaybackInstance(false)
  }

  componentWillUnmount(): void {
    this.props.onRef(undefined)
    this.playbackInstance = null;
  }

  async _loadNewPlaybackInstance(playing: boolean) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    const source = { uri: 'https://api.soundcloud.com/tracks/' + this.props.code + '/stream?client_id=4a584e57dbc1c522b0ccdb68464f6ec3' };
    const initialStatus = {
      shouldPlay: playing,
      volume: this.state.volume,
      isMuted: this.state.muted,
    };
    const { sound, status } = await Audio.Sound.create(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;
  }

  _onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        muted: status.isMuted,
        volume: status.volume,
      }, () => this.props.onStatusChange(this.state.isPlaying));
    } else {
      if (status.error) {

      }
    }
  };

  _onPlayPausePressed() {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync()
      } else {
        this.playbackInstance.playAsync()
      }
    }
  }

  render() {
    return null
  }
}

export default eaudio;