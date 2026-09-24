import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, statusBarInset, lineHeight, textTop, pressedFeedback } from '../theme';

// M8 Confirmación. Geometry from mockup m8 (frame 390x800).
const CIRCLE_R = 46;
const CIRCLE_STROKE = 3;
const CIRCLE_SIZE = CIRCLE_R * 2 + CIRCLE_STROKE;
const CHECK_STROKE = 4;

// Check mark polyline relative to the circle center: (-20,2) (-6,18) (22,-18).
const segment = (x1, y1, x2, y2) => {
  const inner = CIRCLE_SIZE / 2 - CIRCLE_STROKE; // children are laid out inside the border
  const length = Math.hypot(x2 - x1, y2 - y1) + CHECK_STROKE; // round caps
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return {
    left: inner + (x1 + x2) / 2 - length / 2,
    top: inner + (y1 + y2) / 2 - CHECK_STROKE / 2,
    width: length,
    transform: [{ rotate: `${angle}deg` }],
  };
};

export default function ConfirmationScreen({ nav }) {
  return (
    <View style={styles.screen}>
      <View style={styles.frame}>
        <View style={styles.circle}>
          <View style={[styles.checkStroke, segment(-20, 2, -6, 18)]} />
          <View style={[styles.checkStroke, segment(-6, 18, 22, -18)]} />
        </View>
        <Text style={styles.title}>Listo, despertaste</Text>
        <Text style={styles.name}>Remedios de mamá</Text>
        <View style={styles.divider} />
        <Text style={styles.streak}>Van 4 martes seguidos</Text>
        <Pressable
          accessibilityRole="button"
          style={(state) => [styles.close, pressedFeedback(state)]}
          onPress={() => nav('alarms')}
        >
          <Text style={styles.closeText}>Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const centered = { position: 'absolute', left: 0, right: 0, textAlign: 'center' };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: statusBarInset },
  frame: { flex: 1 },
  circle: {
    position: 'absolute',
    left: '50%',
    marginLeft: -CIRCLE_SIZE / 2,
    top: 190 - CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: CIRCLE_STROKE,
    borderColor: colors.ok,
    backgroundColor: colors.okLight,
  },
  checkStroke: {
    position: 'absolute',
    height: CHECK_STROKE,
    borderRadius: CHECK_STROKE / 2,
    backgroundColor: colors.ok,
  },
  title: {
    ...centered,
    top: textTop(290, 24),
    fontSize: 24,
    lineHeight: lineHeight(24),
    fontWeight: '700',
    color: colors.ink,
  },
  name: {
    ...centered,
    top: textTop(326, 16),
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.g1,
  },
  divider: {
    position: 'absolute',
    left: 70,
    right: 70,
    top: 370 - 0.75,
    height: 1.5,
    backgroundColor: colors.g3,
  },
  streak: {
    ...centered,
    top: textTop(412, 17),
    fontSize: 17,
    lineHeight: lineHeight(17),
    fontWeight: '700',
    color: colors.ok,
  },
  close: {
    position: 'absolute',
    left: 110,
    right: 110,
    top: 560,
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.prim,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 15, lineHeight: lineHeight(15), fontWeight: '700', color: colors.prim },
});
