import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, statusBarInset, lineHeight, textTop, pressedFeedback } from '../theme';

// M9 Ajustes. Geometry from mockup m9 (frame 390x800).
const FIRST_ROW = 92;
const ROW_STEP = 74;
const ROW_TOP = 10; // Row box starts 10 dp above the item origin of the mockup.

export default function SettingsScreen({ nav, sound = 'Radar', openSound }) {
  const items = [
    { name: 'Sonido y volumen', desc: `${sound} - volumen progresivo`, onPress: openSound },
    { name: 'Notificaciones', desc: 'Aviso previo de alarmas con foto' },
    { name: 'Privacidad y datos de la cámara', desc: 'El escaneo se procesa en el teléfono' },
    { name: 'Copia de seguridad', desc: 'Historial sincronizado en la nube' },
    { name: 'Acerca de Pendiente', desc: 'Versión 1.0' },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.frame}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          style={(state) => [styles.back, pressedFeedback(state)]}
          onPress={() => nav('alarms')}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Ajustes</Text>
        <View style={[styles.divider, { top: 58 - 0.75 }]} />

        {items.map((item, i) => {
          const y = FIRST_ROW + i * ROW_STEP;
          return (
            <React.Fragment key={item.name}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.name}
                style={(state) => [styles.row, { top: y - ROW_TOP }, pressedFeedback(state)]}
                onPress={item.onPress}
              >
                <Text style={styles.label}>{item.name}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
                <Text style={styles.chevron}>{'>'}</Text>
              </Pressable>
              <View style={[styles.divider, { top: y + 54 - 0.75 }]} />
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

// Row box spans x16 to x374, height 60. Children are offset from it.
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
  row: { position: 'absolute', left: 16, right: 16, height: 60 },
  label: {
    position: 'absolute',
    left: 8,
    right: 32,
    top: textTop(14 + ROW_TOP, 16),
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.ink,
  },
  desc: {
    position: 'absolute',
    left: 8,
    right: 32,
    top: textTop(36 + ROW_TOP, 12.5),
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: lineHeight(12.5),
    color: colors.g2,
  },
  chevron: {
    position: 'absolute',
    right: 8,
    top: textTop(18 + ROW_TOP, 15),
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: lineHeight(15),
    color: colors.g2,
  },
});
