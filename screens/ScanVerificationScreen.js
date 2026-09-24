import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import PhotoPills from '../components/PhotoPills';
import CameraView from '../components/CameraView';
import { colors, statusBarInset, lineHeight, textTop, pressedFeedback } from '../theme';

// M7 Verificación por escaneo. Geometry from mockup m7 (frame 390x800).
// Tapping the viewfinder simulates a match; both paths lead to M8, as in the Figma prototype.
export default function ScanVerificationScreen({ nav }) {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.frame}>
        <Text style={styles.title}>Apunta la cámara a:</Text>
        <PhotoPills width={110} height={82} style={styles.reference} />
        <Text style={styles.referenceHint}>← la referencia que guardaste</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Simular objeto reconocido"
          style={(state) => [styles.camera, pressedFeedback(state)]}
          onPress={() => nav('done')}
        >
          <CameraView height={380} hint="(lo que la cámara ve ahora)" />
        </Pressable>
        <Text style={styles.searching}>Buscando...</Text>
        <Pressable
          accessibilityRole="button"
          style={(state) => [styles.skip, pressedFeedback(state)]}
          onPress={() => nav('done')}
        >
          <Text style={styles.skipText}>No puedo ahora</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night, paddingTop: statusBarInset },
  frame: { flex: 1 },
  title: {
    position: 'absolute',
    left: 32,
    top: textTop(52, 17),
    fontSize: 17,
    lineHeight: lineHeight(17),
    fontWeight: '700',
    color: colors.white,
  },
  reference: { position: 'absolute', left: 32, top: 74 },
  referenceHint: {
    position: 'absolute',
    left: 158,
    right: 16,
    top: textTop(118, 12.5),
    fontSize: 12.5,
    lineHeight: lineHeight(12.5),
    color: colors.nightMuted,
  },
  camera: { position: 'absolute', left: 32, right: 32, top: 186, height: 380 },
  searching: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: textTop(614, 16),
    textAlign: 'center',
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.nightText,
  },
  skip: {
    position: 'absolute',
    left: 80,
    right: 80,
    top: 660,
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.nightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: { fontSize: 15, lineHeight: lineHeight(15), fontWeight: '700', color: colors.nightText },
});
