import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import PhotoPills from '../components/PhotoPills';
import { colors, statusBarInset, lineHeight, textTop, pressedFeedback } from '../theme';

// M6 Alarma sonando. Geometry from mockup m6 (frame 390x800).
export default function AlarmRingingScreen({ nav }) {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.frame}>
        <Text style={styles.time}>06:30</Text>
        <Text style={styles.day}>Martes</Text>
        <PhotoPills height={400} style={styles.photo} />
        <Text style={styles.name}>Remedios de mamá</Text>
        <Pressable
          accessibilityRole="button"
          style={(state) => [styles.dismiss, pressedFeedback(state)]}
          onPress={() => nav('scan')}
        >
          <Text style={styles.dismissText}>Descartar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={(state) => [styles.snooze, pressedFeedback(state)]}
          onPress={() => nav('alarms')}
        >
          <Text style={styles.snoozeText}>Posponer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const centered = { position: 'absolute', left: 0, right: 0, textAlign: 'center' };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night, paddingTop: statusBarInset },
  frame: { flex: 1 },
  time: {
    ...centered,
    top: textTop(60, 30),
    fontSize: 30,
    lineHeight: lineHeight(30),
    fontWeight: '700',
    color: colors.white,
  },
  day: {
    ...centered,
    top: textTop(86, 15),
    fontSize: 15,
    lineHeight: lineHeight(15),
    color: colors.nightMuted,
  },
  photo: { position: 'absolute', left: 32, right: 32, top: 112 },
  name: {
    ...centered,
    top: textTop(560, 22),
    fontSize: 22,
    lineHeight: lineHeight(22),
    fontWeight: '700',
    color: colors.white,
  },
  dismiss: {
    position: 'absolute',
    left: 60,
    right: 60,
    top: 610,
    height: 58,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: { fontSize: 18, lineHeight: lineHeight(18), fontWeight: '700', color: colors.ink },
  snooze: {
    position: 'absolute',
    left: '50%',
    marginLeft: -70,
    top: 696,
    width: 140,
    height: 44,
    alignItems: 'center',
  },
  snoozeText: {
    marginTop: textTop(720, 14) - 696,
    fontSize: 14,
    lineHeight: lineHeight(14),
    color: colors.nightMuted,
  },
});
