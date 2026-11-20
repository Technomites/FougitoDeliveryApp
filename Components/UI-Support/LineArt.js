import React, {useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';

const TILE_SOURCE = require('../../assets/Images/lineart_tile_white.png');
// lineart-tile-white.png is 696 x 527
const TILE_RATIO = 527 / 696;

// Repeats the white Fougito line-art over its parent (absolute fill).
// tile = tile width in dp (360 tablets, 240 phone). Purely decorative.
const LineArt = ({tile = 360, opacity = 0.16}) => {
  const [box, setBox] = useState({w: 0, h: 0});
  const tileW = tile;
  const tileH = Math.round(tile * TILE_RATIO);
  const cols = box.w ? Math.ceil(box.w / tileW) : 0;
  const rows = box.h ? Math.ceil(box.h / tileH) : 0;

  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(
        <Image
          key={`${r}-${c}`}
          source={TILE_SOURCE}
          fadeDuration={0}
          resizeMode="stretch"
          style={{
            position: 'absolute',
            left: c * tileW,
            top: r * tileH,
            width: tileW,
            height: tileH,
            opacity,
          }}
        />,
      );
    }
  }

  return (
    <View
      pointerEvents="none"
      style={styles.fill}
      onLayout={e => {
        const {width, height} = e.nativeEvent.layout;
        if (Math.round(width) !== box.w || Math.round(height) !== box.h) {
          setBox({w: Math.round(width), h: Math.round(height)});
        }
      }}>
      {tiles}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {...StyleSheet.absoluteFillObject, overflow: 'hidden'},
});

export default LineArt;
