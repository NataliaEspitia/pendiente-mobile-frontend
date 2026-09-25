import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, lineHeight } from '../theme';

// Simulated camera viewfinder (night background with framing corners), as camera_view() in gen_mockups.py.
const INSET = 26;
const CORNER = 30;
const STROKE = 3;
const OFFSET = INSET - STROKE / 2;
const SIZE = CORNER + STROKE;

export default function CameraView({ hint, height }) {
  return (
    <View style={[styles.view, { height }]}>
      <View style={[styles.corner, { left: OFFSET, top: OFFSET, borderLeftWidth: STROKE, borderTopWidth: STROKE, borderTopLeftRadius: STROKE / 2 }]} />
      <View style={[styles.corner, { right: OFFSET, top: OFFSET, borderRightWidth: STROKE, borderTopWidth: STROKE, borderTopRightRadius: STROKE / 2 }]} />
      <View style={[styles.corner, { left: OFFSET, bottom: OFFSET, borderLeftWidth: STROKE, borderBottomWidth: STROKE, borderBottomLeftRadius: STROKE / 2 }]} />
      <View style={[styles.corner, { right: OFFSET, bottom: OFFSET, borderRightWidth: STROKE, borderBottomWidth: STROKE, borderBottomRightRadius: STROKE / 2 }]} />
      {hint ? <Text style={[styles.hint, { top: height / 2 + 5 - 13 }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  view: { backgroundColor: colors.night, borderRadius: 10 },
  corner: { position: 'absolute', width: SIZE, height: SIZE, borderColor: colors.nightMuted },
  hint: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: lineHeight(13),
    color: colors.nightMuted,
  },
});
