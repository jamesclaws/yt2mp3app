import TrackPlayer from 'react-native-track-player';
// service.js
module.exports = async function() {
  /* For playing in the background */
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play())
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause()) 
}