import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, statusBarInset, lineHeight, textTop, pressedFeedback } from '../theme';

// M10 Sonido de la alarma. Geometry from mockup m10 (frame 390x800).
const SOUNDS = ['Radar', 'Amanecer', 'Clásico', 'Suave'];

const FIRST_ROW = 92;
const ROW_STEP = 58;
const VOLUME_Y = FIRST_ROW + SOUNDS.length * ROW_STEP;
const KNOB = 26; // r12 + stroke 2

const clamp = (v) => Math.min(1, Math.max(0, v));

export default function SoundPickerScreen({ nav, back = 'new', sound, setSound }) {
  const [volume, setVolume] = useState(0.7);
  const [trackWidth, setTrackWidth] = useState(0);

  // Visual only: dragging or tapping the track moves the knob.
  const slide = (e) => {
    if (trackWidth > 0) setVolume(clamp(e.nativeEvent.locationX / trackWidth));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.frame}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          style={(state) => [styles.back, pressedFeedback(state)]}
          onPress={() => nav(back)}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Sonido</Text>
        <View style={[styles.divider, { top: 58 - 0.75 }]} />

        {SOUNDS.map((name, i) => {
          const y = FIRST_ROW + i * ROW_STEP;
          const selected = sound === name;
          return (
            <React.Fragment key={name}>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={(state) => [
                  styles.row,
                  { top: y - 14 },
                  selected && styles.rowSelected,
                  pressedFeedback(state),
                ]}
                onPress={() => setSound(name)}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.label, selected && styles.labelSelected]}>{name}</Text>
              </Pressable>
              <View style={[styles.divider, { top: y + 34 - 0.75 }]} />
            </React.Fragment>
          );
        })}

        <Text style={styles.volumeLabel}>Volumen</Text>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="Volumen"
          style={styles.slider}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={slide}
          onResponderMove={slide}
        >
          <View style={styles.track} />
          <View style={[styles.trackFill, { width: `${volume * 100}%` }]} />
          <View style={[styles.knob, { left: `${volume * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

// Row box spans the selected highlight: x16, y-14, height 48. Children are offset from it.
const RADIO = 19.5; // r9 + stroke 1.5
// Slider touch area: y+28 to y+68 around the track (y+44, height 8).
const SLIDER_TOP = VOLUME_Y + 28;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: statusBarInset },
  frame: { flex: 1 },
  back: { position: 'absolute', left: 8, top: 12, width: 56, height: 44 },
  backArrow: {
    position: 'absolute',
    left: 14,
    top: textTop(40, 20) - 12,
    fontFamily: fonts.regular,
    fontSize: 20,
    lineHeight: lineHeight(20),
    color: colors.prim,
  },
  title: {
    position: 'absolute',
    left: 64,
    right: 64,
    top: textTop(40, 16),
    fontSize: 16,
    lineHeight: lineHeight(16),
    fontFamily: fonts.bold,
    color: colors.ink,
    textAlign: 'center',
  },
  divider: { position: 'absolute', left: 16, right: 16, height: 1.5, backgroundColor: colors.g3 },
  row: { position: 'absolute', left: 16, right: 16, height: 48, borderRadius: 8 },
  rowSelected: { backgroundColor: colors.primLight },
  radio: {
    position: 'absolute',
    left: 20 - RADIO / 2,
    top: 20 - RADIO / 2,
    width: RADIO,
    height: RADIO,
    borderRadius: RADIO / 2,
    borderWidth: 1.5,
    borderColor: colors.g2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.prim },
  radioDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.prim },
  label: {
    position: 'absolute',
    left: 42,
    top: textTop(14 + 12, 16),
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.ink,
  },
  labelSelected: { fontFamily: fonts.bold, color: colors.prim },
  volumeLabel: {
    position: 'absolute',
    left: 24,
    top: textTop(VOLUME_Y + 24, 14),
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: lineHeight(14),
    color: colors.g1,
  },
  slider: { position: 'absolute', left: 24, right: 24, top: SLIDER_TOP, height: 40 },
  track: {
    pointerEvents: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.g3,
  },
  trackFill: {
    pointerEvents: 'none',
    position: 'absolute',
    left: 0,
    top: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.prim,
  },
  knob: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 20 - KNOB / 2,
    marginLeft: -KNOB / 2,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    borderWidth: 2,
    borderColor: colors.prim,
    backgroundColor: colors.white,
  },
});
