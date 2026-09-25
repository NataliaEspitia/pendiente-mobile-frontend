import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, lineHeight } from '../theme';

// Purpose photo drawn with views (pill box of the user's mom), as photo_pills() in gen_mockups.py.
const OUTER_BORDER = 1.5;
const INNER_BORDER = 1.5;
const LABELS = ['M', 'J', 'S', 'D'];

export default function PhotoPills({ width, height, style }) {
  const [measured, setMeasured] = useState(width || 0);
  const w = width || measured;
  const h = height;

  const bw = w * 0.62;
  const bh = h * 0.52;
  const letterSize = Math.max(8, bh * 0.16);
  const titleSize = Math.max(9, h * 0.085);
  const dot = Math.min(bw / 14, 7);

  return (
    <View
      style={[styles.outer, { height: h }, width ? { width } : null, style]}
      onLayout={width ? undefined : (e) => setMeasured(e.nativeEvent.layout.width)}
    >
      <Text
        style={[
          styles.title,
          {
            top: h * 0.16 - titleSize - OUTER_BORDER,
            fontSize: titleSize,
            lineHeight: lineHeight(titleSize),
          },
        ]}
        numberOfLines={1}
      >
        los remedios
      </Text>
      {w > 0 && (
        <View
          style={[
            styles.box,
            {
              left: (w - bw) / 2 - OUTER_BORDER,
              top: h * 0.26 - OUTER_BORDER,
              width: bw,
              height: bh,
            },
          ]}
        >
          {LABELS.map((label, i) => (
            <View key={label} style={[styles.column, i < LABELS.length - 1 && styles.columnDivider]}>
              <Text
                style={[
                  styles.letter,
                  {
                    top: bh * 0.3 - letterSize - INNER_BORDER,
                    fontSize: letterSize,
                    lineHeight: lineHeight(letterSize),
                  },
                ]}
              >
                {label}
              </Text>
              <View style={[styles.dotRow, { top: bh * 0.62 - dot - INNER_BORDER }]}>
                <View style={[styles.dot, { width: dot * 2, height: dot * 2, borderRadius: dot }]} />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.photoBg,
    borderWidth: OUTER_BORDER,
    borderColor: colors.accent,
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.regular,
    color: colors.photoInk,
  },
  box: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: INNER_BORDER,
    borderColor: colors.photoInk,
    borderRadius: 6,
    overflow: 'hidden',
  },
  column: { flex: 1 },
  columnDivider: { borderRightWidth: 1, borderRightColor: colors.photoLine },
  letter: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.bold,
    color: colors.photoInk,
  },
  dotRow: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  dot: { backgroundColor: colors.accent, borderWidth: 1, borderColor: colors.photoInk },
});
