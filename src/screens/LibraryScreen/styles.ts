import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 25,
  },
  musicItemContainer: {

  },
  musicItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    minHeight: 36,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingVertical: 5,
  },
});

export default styles;
