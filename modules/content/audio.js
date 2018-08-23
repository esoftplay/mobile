//import liraries
import React, { Component } from '../../../../react'
import { Audio } from '../../../../expo';

// create a component
class Eaudio extends Component {
  constructor(props) {
    super(props)
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

  componentWillUnmount = () => {
    this.props.onRef(undefined)
    this.playbackInstance = null;
  }

  async _loadNewPlaybackInstance(playing) {
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
    const { sound, status  } = await Audio.Sound.create(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;
  }

  _onPlaybackStatusUpdate = status => {
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

  _onPlayPausePressed = () => {
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

//make this component available to the app
module.exports = Eaudio;
