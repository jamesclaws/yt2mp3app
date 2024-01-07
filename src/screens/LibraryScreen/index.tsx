import React, { useEffect, useRef, useState } from 'react';

import {View, Text, Button, TouchableOpacity, ScrollView} from 'react-native';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer from 'react-native-track-player';

import SafeAreaView from '../../components/SafeAreaView';
import styles from './styles';
import { SAVE_DIR } from '../../constants';
import MusicItemModal from './MusicItemModal';

const pattern = /.\.webm/

const LibraryScreen = () => {
  const [musicList, setMusicList] = useState<Array<{path: string, name: string}>>([]);
  const [isMusicItemModalOpen, setIsMusicItemModalOpen] = useState(true);

  const mounted = useRef<boolean>();

  const loadItems = async () => {
    try {
      const result = await RNFS.readDir(SAVE_DIR);
      const filteredResult = result
      .filter((item) => pattern.test(item.name))
      .map((item) => (
        {
          path: item.path,
          name: decodeURI(item.name).replace('.webm', ''),
        }
      ))
      if (mounted.current) {
        setMusicList(filteredResult);
      }
    } catch (err: { message: any; code: any; }) {
      console.log(err.message, err.code);
    }
  }

  const addTrack = async (track: {
    url: string,
    title: string,
    artist: string,
  }) => {
    console.log(track)
    try {
      await TrackPlayer.add([track]);
      await TrackPlayer.play();
    } catch (err: any) {
      console.log(err.message, err.code)
    }
  };

  const play = async () => {
    await TrackPlayer.play();
  }

  const pause = async () => {
    await TrackPlayer.pause();
  }

  const stop = async () => {
    await TrackPlayer.stop();
  }

  useEffect(() => {
    mounted.current = true;
  
    return () => {
      mounted.current = false;
    }
  }, [])
  
  useEffect(() => {
    loadItems();
    TrackPlayer.setVolume(1);
  }, [])

  const colog = async () => {
    // let track = await TrackPlayer.getActiveTrack();
    // console.log(track);
    try {
      const tracks = await TrackPlayer.getQueue();
      console.log(tracks)
  
      const state = await TrackPlayer.getPlaybackState();
      console.log(state)
    } catch( err) {
      console.log('=== THIS IS AN ERROR ===')
      console.log(err)
    }

  }

  colog();
  
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Button onPress={loadItems} title='Load items'></Button>
        <View style={styles.musicItemContainer}>

        </View>
        {musicList.map((item, index) => (
          <View
            key={`music-item-${index + 1}`}
            style={styles.musicItem}
          >
            <TouchableOpacity
              onPress={() => addTrack({
                url: item.path,
                title: item.name,
                artist: 'Unkown Artist'
              })}
            >
              <Text
                style={{textAlign: 'left'}}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
            <Ionicons 
              name='ellipsis-vertical'
              size={20}
              color="#5F6367"
            />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={play}
      >
        <Ionicons name='play' size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={pause}
      >
        <Ionicons name='pause' size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={colog}
      >
        <Ionicons name='stop' size={30} />
      </TouchableOpacity>
      <MusicItemModal 
        open={isMusicItemModalOpen}
        onClose={() => setIsMusicItemModalOpen(false)}
      />
    </SafeAreaView>
  );
};

export default LibraryScreen;
