import React from 'react'

import { 
  Text
} from 'react-native';

type MusicItemModalProptypes = {
  open: boolean,
  onClose : () => void,
}

const MusicItemModal = ({open, onClose}: MusicItemModalProptypes) => {
  return (
    <Text>Hi</Text>
  )
}

export default MusicItemModal;

