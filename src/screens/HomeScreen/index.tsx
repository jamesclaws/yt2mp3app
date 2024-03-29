import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Button, ScrollView, RefreshControl} from 'react-native';
import SafeAreaView from '../../components/SafeAreaView';
import ytdl from 'react-native-ytdl';
import RNFS from 'react-native-fs';
import {WebView} from 'react-native-webview';
import Snackbar from 'react-native-snackbar';

import styles from './styles';
import {APP_NAME, SAVE_DIR} from '../../constants';

// const gumballVideoURL = 'https://www.youtube.com/watch?v=hZRuGrrGUB4';

const checkIfDirectoryExist = async () => {
  const existDir = await RNFS.exists(
    RNFS.DownloadDirectoryPath + `/${APP_NAME}`,
  ).then(boolean => boolean);
  if (!existDir) {
    await RNFS.mkdir(RNFS.DownloadDirectoryPath + `/${APP_NAME}`);
  }
};

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [webviewRefresher, setWebviewRefresher] = useState(0);

  const mounted = useRef<boolean>();

  const onButtonPress = async () => {
    if (mounted.current) {
      setIsLoading(true);
    }
    try {
      await checkIfDirectoryExist();
      const isValid = await ytdl.validateURL(youtubeURL);
      console.log(youtubeURL);
      if (!isValid) {
        Snackbar.show({
          text: 'Not a valid video',
          duration: Snackbar.LENGTH_SHORT,
        });
        throw Error('Not a valid video');
      }
      const info = await ytdl.getInfo(youtubeURL);
      // console.log(Object.keys(info.videoDetails));
      let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      // console.log(JSON.stringify(audioFormats));
      const url = audioFormats[0].url;
      // console.log(url);
      const title: string = info.videoDetails.title;

      const sanitizedTitle = title.replace(/[/\\?%*:|"<>]/g, '');

      const filePath = SAVE_DIR + `/${sanitizedTitle}.webm`;

      const exist = await RNFS.exists(filePath).then(boolean => boolean);
      if (!exist) {
        RNFS.downloadFile({
          fromUrl: url,
          toFile: filePath,
          background: true, // Enable downloading in the background (iOS only)
          discretionary: true, // Allow the OS to control the timing and speed (iOS only)
          progress: (res: any) => {
            // Handle download progress updates if needed
            const progress = (res.bytesWritten / res.contentLength) * 100;
            console.log(`Progress: ${progress.toFixed(2)}%`);
          },
        })
          .promise.then(response => {
            console.log('File downloaded!', response);
          })
          .catch(err => {
            console.log('Download error:', err);
          });
      } else {
        console.log('File Downloaded already');
      }

      console.log(filePath);
    } catch (err) {
      console.log(err);
    }
    if (mounted.current) {
      setIsLoading(false);
    }
  };

  const rename = async () => {
    try {
      // const dir = '/storage/emulated/0/Download/HoarseMP/'
      // const fileName = `Furina%20Theme%20Music%20EXTENDED%20-%20All%20the%20World's%20a%20Stage%20(tnbee%20mix)%20%7C%20Genshin%20Impact.webm`;
      const fileName = 'test me ';
      const path = SAVE_DIR + '/' + fileName + '.txt';
      await RNFS.writeFile(path, 'it work');
      console.log(path);
      // await RNFS.moveFile(dir + fileName, dir + decodeURI(fileName));
      // console.log(dir + fileName)
      const result = await RNFS.readFile(path);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const reloadWebview = () => {
    setIsLoading(true);
    setWebviewRefresher(prev => prev + 1);
    setIsLoading(false);
  };

  const handleNavigationStateChange = (webViewState: any) => {
    const url = webViewState.url;
    setYoutubeURL(url);
  };

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={reloadWebview} />
        }
        contentContainerStyle={styles.container}>
        <View style={styles.webViewContainer}>
          <WebView
            key={webviewRefresher}
            source={{uri: 'https://youtube.com/'}}
            style={styles.webview}
            onNavigationStateChange={handleNavigationStateChange}
          />
        </View>

        <View>
          <Text>Home!</Text>
          <Button
            onPress={onButtonPress}
            title="Download"
            disabled={isLoading}
          />
          <Button onPress={rename} title="rename" />
          <Button onPress={reloadWebview} title="Reload Youtuube" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
