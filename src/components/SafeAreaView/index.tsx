import React, {PropsWithChildren} from 'react';
import {SafeAreaView as RNSafeAreaView} from 'react-native';

import styles from './styles';

const SafeAreaView = ({children}: PropsWithChildren) => (
  <RNSafeAreaView style={styles.safeArea}>{children}</RNSafeAreaView>
);

export default SafeAreaView;
