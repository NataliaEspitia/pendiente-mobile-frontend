import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, statusBarInset, lineHeight, textTop, pressedFeedback } from '../theme';

// M5 Selector de verificación. Geometry from mockup m5 (frame 390x800).
const OPTIONS = [
  { name: 'Ninguna', desc: 'La alarma se descarta con un toque' },
  { name: 'Movimiento', desc: 'Camina unos pasos con el teléfono' },
  { name: 'Escanear objeto', desc: 'Apunta la cámara a tu foto de propósito' },
  { name: 'Operación matemática', desc: 'Resuelve una cuenta simple para descartar' },
];

const FIRST_ROW = 92;
const ROW_STEP = 74;

export default function VerificationSelectorScreen({ nav, verification, setVerification }) {
  const choose = (name) => {
    setVerification(name);
    nav('new');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.frame}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          style={(state) => [styles.back, pressedFeedback(state)]}
          onPress={() => nav('new')}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Verificación</Text>
        <View style={[styles.divider, { top: 58 - 0.75 }]} />

        {OPTIONS.map((option, i) => {
          const y = FIRST_ROW + i * ROW_STEP;
          const selected = verification === option.name;
          return (
            <React.Fragment key={option.name}>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={(state) => [
                  styles.row,
                  { top: y - 14 },
                  selected && styles.rowSelected,
                  pressedFeedback(state),
                ]}
                onPress={() => choose(option.name)}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.label, selected && styles.labelSelected]}>{option.name}</Text>
                <Text style={[styles.desc, selected && styles.descSelected]}>{option.desc}</Text>
              </Pressable>
              <View style={[styles.divider, { top: y + 54 - 0.75 }]} />
            </React.Fragment>
          );
        })}

        <View style={[styles.privacy, { top: FIRST_ROW + OPTIONS.length * ROW_STEP + 16 }]}>
          <Text style={styles.privacyTitle}>Tu privacidad</Text>
          <Text style={[styles.privacyText, { top: 34.5 }]}>La imagen se procesa en tu teléfono.</Text>
          <Text style={[styles.privacyText, { top: 52.5 }]}>No se guarda ni se envía a ningún servidor.</Text>
        </View>
      </View>
    </View>
  );
}

// Row box spans the selected highlight: x16, y-14, height 64. Children are offset from it.
const RADIO = 19.5; // r9 + stroke 1.5

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
  row: { position: 'absolute', left: 16, right: 16, height: 64, borderRadius: 8 },
  rowSelected: { backgroundColor: colors.primLight },
  radio: {
    position: 'absolute',
    left: 20 - RADIO / 2,
    top: 22 - RADIO / 2,
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
    top: textTop(14 + 14, 16),
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.ink,
  },
  labelSelected: { fontFamily: fonts.bold, color: colors.prim },
  desc: {
    position: 'absolute',
    left: 42,
    top: textTop(14 + 36, 12.5),
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: lineHeight(12.5),
    color: colors.g2,
  },
  descSelected: { color: colors.g1 },
  privacy: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 84,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.g3,
    backgroundColor: colors.g4,
  },
  privacyTitle: {
    position: 'absolute',
    left: 15,
    top: textTop(28, 13) - 1,
    fontSize: 13,
    lineHeight: lineHeight(13),
    fontFamily: fonts.bold,
    color: colors.prim,
  },
  privacyText: {
    position: 'absolute',
    left: 15,
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: lineHeight(12.5),
    color: colors.g1,
  },
});
