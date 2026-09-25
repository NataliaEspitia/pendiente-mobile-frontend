import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';

import VerificationSelectorScreen from './screens/VerificationSelectorScreen';
import AlarmRingingScreen from './screens/AlarmRingingScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import ScanVerificationScreen from './screens/ScanVerificationScreen';
import SettingsScreen from './screens/SettingsScreen';
import SoundPickerScreen from './screens/SoundPickerScreen';

import { useFonts } from 'expo-font';

import {
  fontFiles,
  colors,
  fonts,
  statusBarInset,
  FRAME,
  lineHeight,
  textTop,
} from './theme';
import CameraView from './components/CameraView';
import PhotoPills from './components/PhotoPills';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function App() {
  const [screen, setScreen] = useState('alarms');

  const [days, setDays] = useState([
    false,
    true,
    false,
    true,
    false,
    false,
    false,
  ]);

  const [purpose, setPurpose] = useState('Remedios de mamá');
  const [verification, setVerification] = useState('Escanear objeto');
  const [hasPhoto, setHasPhoto] = useState(true);

  const [alarmToggles, setAlarmToggles] = useState([
    true,
    true,
    false,
  ]);

  const [sound, setSound] = useState('Radar');
  const [soundBack, setSoundBack] = useState('new');

  const [fontsLoaded, fontError] = useFonts(fontFiles);

  const nav = (next) => {
    setScreen(next);
  };

  const openNewAlarm = () => {
    setPurpose('');
    setHasPhoto(false);
    setVerification('Ninguna');

    setDays([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);

    setScreen('new');
  };

  const openAlarm = (alarm) => {
    setPurpose(alarm.name);
    setHasPhoto(Boolean(alarm.photo));

    setVerification(
      alarm.photo
        ? 'Escanear objeto'
        : 'Ninguna'
    );

    setScreen('new');
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={s.phone}>
        {screen === 'alarms' && (
          <AlarmList
            toggles={alarmToggles}
            setToggles={setAlarmToggles}
            openAlarm={openAlarm}
            openNewAlarm={openNewAlarm}
            openSettings={() => nav('settings')}
          />
        )}

        {screen === 'new' && (
          <AlarmEditor
            nav={nav}
            days={days}
            setDays={setDays}
            purpose={purpose}
            setPurpose={setPurpose}
            verification={verification}
            hasPhoto={hasPhoto}
            setHasPhoto={setHasPhoto}
            sound={sound}
            nextSound={() => {
              setSoundBack('new');
              nav('sound');
            }}
          />
        )}

        {screen === 'camera' && (
          <Camera
            nav={nav}
            onPhoto={() => {
              setHasPhoto(true);
              nav('new');
            }}
          />
        )}

        {screen === 'verify' && (
          <VerificationSelectorScreen
            nav={nav}
            verification={verification}
            setVerification={setVerification}
          />
        )}

        {screen === 'ringing' && (
          <AlarmRingingScreen nav={nav} />
        )}

        {screen === 'scan' && (
          <ScanVerificationScreen nav={nav} />
        )}

        {screen === 'done' && (
          <ConfirmationScreen nav={nav} />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            nav={nav}
            sound={sound}
            openSound={() => {
              setSoundBack('settings');
              nav('sound');
            }}
          />
        )}

        {screen === 'sound' && (
          <SoundPickerScreen
            nav={nav}
            back={soundBack}
            sound={sound}
            setSound={setSound}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                      */
/* -------------------------------------------------------------------------- */

function Header({
  left,
  title,
  right,
  onLeft,
  onRight,
}) {
  return (
    <View style={s.header}>
      <Pressable
        style={s.headerSide}
        onPress={onLeft}
      >
        <Text
          style={[
            s.headerAction,
            left === 'Cancelar' && s.headerActionMuted,
          ]}
        >
          {left || ''}
        </Text>
      </Pressable>

      <Text style={s.headerTitle}>
        {title}
      </Text>

      <Pressable
        style={[
          s.headerSide,
          s.headerRight,
        ]}
        onPress={onRight}
      >
        <Text
          style={[
            s.headerAction,
            right === 'Guardar' && s.headerActionBold,
          ]}
        >
          {right || ''}
        </Text>
      </Pressable>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* M1 — MIS ALARMAS                                                           */
/* -------------------------------------------------------------------------- */

function AlarmList({
  toggles,
  setToggles,
  openAlarm,
  openNewAlarm,
  openSettings,
}) {
  const alarms = [
    {
      time: '06:30',
      name: 'Remedios de mamá',
      repeat: 'Mar - Jue',
      photo: true,
    },
    {
      time: '07:00',
      name: 'Levantarme',
      repeat: 'L M M J V',
      photo: false,
    },
    {
      time: '18:30',
      name: 'Sacar la ropa',
      repeat: 'Solo hoy',
      photo: true,
    },
  ];

  const toggleAlarm = (index, value) => {
    setToggles(
      toggles.map((current, currentIndex) =>
        currentIndex === index
          ? value
          : current
      )
    );
  };

  // Geometry from m1 and m_row_alarm in gen_mockups.py (frame 390x800).
  return (
    <View style={s.screen}>
      <View style={s.listHeader}>
        <Text style={s.listTitle}>
          Pendiente
        </Text>

        <Pressable
          style={({ pressed }) => [s.listSettings, pressed && s.pressed]}
          onPress={openSettings}
          hitSlop={12}
          accessibilityRole="button"
        >
          <Text style={s.listSettingsText}>
            Ajustes
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={s.listPad}
        showsVerticalScrollIndicator={false}
      >
        {alarms.map((alarm, index) => {
          const on = toggles[index];

          return (
            <Pressable
              key={`${alarm.time}-${alarm.name}`}
              style={({ pressed }) => [
                s.alarmRow,
                pressed && s.pressed,
              ]}
              onPress={() => openAlarm(alarm)}
            >
              <Text style={[s.listTime, !on && s.textOff]}>
                {alarm.time}
              </Text>

              {alarm.photo && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>
                    FOTO
                  </Text>
                </View>
              )}

              <Text style={[s.name, !on && s.textOff]}>
                {alarm.name}
              </Text>

              <Text style={s.meta}>
                {alarm.repeat}
              </Text>

              <Pressable
                style={[s.switchTrack, on && s.switchTrackOn]}
                onPress={() => toggleAlarm(index, !on)}
                hitSlop={10}
                accessibilityRole="switch"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`Alarma ${alarm.time}`}
              >
                <View style={[s.switchThumb, on && s.switchThumbOn]} />
              </Pressable>

              <View style={s.alarmLine} />
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          s.fab,
          pressed && s.pressed,
        ]}
        onPress={openNewAlarm}
        accessibilityRole="button"
        accessibilityLabel="Nueva alarma"
      >
        <Text style={s.fabText}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* M2 / M4 — NUEVA ALARMA                                                     */
/* -------------------------------------------------------------------------- */

function AlarmEditor({
  nav,
  days,
  setDays,
  purpose,
  setPurpose,
  verification,
  hasPhoto,
  setHasPhoto,
  sound,
  nextSound,
}) {
  const toggleDay = (index) => {
    setDays(
      days.map((active, currentIndex) =>
        currentIndex === index
          ? !active
          : active
      )
    );
  };

  return (
    <View style={s.screen}>
      <Header
        left="Cancelar"
        title="Nueva alarma"
        right="Guardar"
        onLeft={() => nav('alarms')}
        onRight={() => nav('alarms')}
      />

      <ScrollView
        contentContainerStyle={s.formPad}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.bigTime}>
          06 : 30
        </Text>

        <View style={s.arrowsRow}>
          <Text style={[s.arrows, s.arrowsHours]}>▲ ▼</Text>
          <Text style={[s.arrows, s.arrowsMinutes]}>▲ ▼</Text>
        </View>

        <Divider />

        <Text style={s.label}>
          Repetir
        </Text>

        <View style={s.days}>
          {DAYS.map((day, index) => (
            <Pressable
              key={`${day}-${index}`}
              style={({ pressed }) => [
                s.day,
                days[index] && s.dayOn,
                pressed && s.pressed,
              ]}
              onPress={() => toggleDay(index)}
            >
              <Text
                style={[
                  s.dayText,
                  days[index] && s.dayTextOn,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          ))}
        </View>

        <Divider />

        <Text style={s.label}>
          ¿Para qué es?
        </Text>

        <TextInput
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Ej.: Remedios de mamá"
          placeholderTextColor={colors.g2}
          style={s.input}
        />

        {hasPhoto ? (
          <View style={s.photoRow}>
            <PhotoPills width={180} height={120} />

            <Pressable
              style={({ pressed }) => [
                s.removePhoto,
                pressed && s.pressed,
              ]}
              onPress={() => setHasPhoto(false)}
            >
              <Text style={s.removePhotoText}>
                × Quitar
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              s.addPhoto,
              pressed && s.pressed,
            ]}
            onPress={() => nav('camera')}
          >
            <Text style={s.addPhotoText}>
              Agregar foto (opcional)
            </Text>
          </Pressable>
        )}

        <Divider />

        <Row
          label="Verificación"
          value={verification}
          onPress={() => nav('verify')}
        />

        <Divider />

        <Row
          label="Sonido"
          value={sound}
          onPress={nextSound}
        />

        <Divider />

        <Pressable
          hitSlop={8}
          style={({ pressed }) => [
            s.demoButton,
            pressed && s.pressed,
          ]}
          onPress={() => nav('ringing')}
        >
          <Text style={s.demoButtonText}>
            Ver flujo de alarma sonando
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* M3 — FOTO DE PROPÓSITO                                                     */
/* -------------------------------------------------------------------------- */

function Camera({
  nav,
  onPhoto,
}) {
  // Geometry from mockup m3 (frame 390x800), same approach as M5-M10.
  return (
    <View style={s.cameraScreen}>
      <StatusBar barStyle="light-content" />
      <View style={s.flex}>
        <Pressable
          style={({ pressed }) => [s.cameraClose, pressed && s.pressed]}
          onPress={() => nav('new')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <Text style={s.cameraCloseText}>×</Text>
        </Pressable>

        <Text style={s.cameraTitle}>Foto de propósito</Text>

        <Text style={s.cameraPrompt}>
          Enfoca lo que tienes que recordar
        </Text>

        <View style={s.cameraViewWrap}>
          <CameraView hint="(lo que la cámara ve)" height={430} />
        </View>

        <Pressable
          style={({ pressed }) => [s.galleryButton, pressed && s.pressed]}
          onPress={onPhoto}
          accessibilityRole="button"
        >
          <Text style={s.galleryText}>Galería</Text>
        </Pressable>

        <View style={s.shutterRow} pointerEvents="box-none">
          <Pressable
            style={({ pressed }) => [s.shutter, pressed && s.pressed]}
            onPress={onPhoto}
            accessibilityRole="button"
            accessibilityLabel="Tomar foto"
          >
            <View style={s.shutterInner} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* SHARED COMPONENTS                                                          */
/* -------------------------------------------------------------------------- */

function Divider() {
  return (
    <View style={s.divider} />
  );
}

function Row({
  label,
  value,
  onPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        s.row,
        pressed && s.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={s.rowLabel}>
        {label}
      </Text>

      <View style={s.rowRight}>
        <Text style={s.rowValue}>
          {value}
        </Text>

        <Text style={s.rowChevron}>
          &gt;
        </Text>
      </View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                                                     */
/* -------------------------------------------------------------------------- */

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },

  phone: {
    flex: 1,
    width: '100%',
    maxWidth: FRAME.width,
    backgroundColor: colors.bg,
  },

  flex: {
    flex: 1,
  },

  // Each screen starts below the Android status bar, as M5-M10 do.
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: statusBarInset,
  },

  pressed: {
    opacity: 0.7,
  },

  /* Header --------------------------------------------------------------- */

  header: {
    height: 57,
    paddingTop: 8,
    marginHorizontal: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.g3,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerSide: {
    width: 82,
    height: 44,
    justifyContent: 'center',
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.ink,
  },

  headerAction: {
    fontFamily: fonts.regular,
    color: colors.prim,
    fontSize: 14,
    lineHeight: lineHeight(14),
  },

  headerActionMuted: {
    color: colors.g1,
  },

  headerActionBold: {
    fontFamily: fonts.bold,
    color: colors.prim,
  },

  /* M1 ------------------------------------------------------------------- */

  listHeader: {
    height: 79,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.g3,
  },

  listTitle: {
    position: 'absolute',
    left: 8,
    top: textTop(62, 21),
    fontFamily: fonts.bold,
    fontSize: 21,
    lineHeight: lineHeight(21),
    color: colors.prim,
  },

  listSettings: {
    position: 'absolute',
    right: 8,
    top: textTop(62, 14),
  },

  listSettingsText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: lineHeight(14),
    color: colors.prim,
  },

  listPad: {
    paddingTop: 7,
    paddingBottom: 120,
  },

  alarmRow: {
    height: 100,
  },

  listTime: {
    position: 'absolute',
    left: 24,
    top: textTop(34, 30),
    fontSize: 30,
    lineHeight: lineHeight(30),
    fontFamily: fonts.bold,
    color: colors.ink,
  },

  textOff: {
    color: colors.g2,
  },

  badge: {
    position: 'absolute',
    left: 24 + 5 * 17 + 14,
    top: 14,
    width: 44,
    height: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 3,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 10,
    lineHeight: lineHeight(10),
    fontFamily: fonts.regular,
    color: colors.accentInk,
    letterSpacing: 1,
  },

  name: {
    position: 'absolute',
    left: 24,
    top: textTop(58, 15),
    fontSize: 15,
    lineHeight: lineHeight(15),
    fontFamily: fonts.regular,
    color: colors.g1,
  },

  meta: {
    position: 'absolute',
    left: 24,
    top: textTop(79, 12),
    fontSize: 12,
    lineHeight: lineHeight(12),
    fontFamily: fonts.regular,
    color: colors.g2,
  },

  switchTrack: {
    position: 'absolute',
    right: 28,
    top: 22,
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.g3,
  },

  switchTrackOn: {
    backgroundColor: colors.prim,
  },

  switchThumb: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },

  switchThumbOn: {
    left: 23,
  },

  alarmLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 96,
    height: 1,
    backgroundColor: colors.g3,
  },

  fab: {
    position: 'absolute',
    right: 32,
    bottom: 38,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.prim,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 3px 6px rgba(28, 34, 51, 0.18)',
  },

  fabText: {
    fontSize: 34,
    lineHeight: lineHeight(34),
    color: colors.white,
    fontFamily: fonts.regular,
  },

  /* M2 / M4 (geometry from m_form in gen_mockups.py) --------------------- */

  formPad: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  bigTime: {
    fontSize: 62,
    lineHeight: lineHeight(62),
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginTop: 31,
    color: colors.ink,
  },

  arrowsRow: {
    height: lineHeight(13),
    marginTop: 5,
    marginBottom: 22,
  },

  arrows: {
    position: 'absolute',
    left: '50%',
    width: 60,
    textAlign: 'center',
    fontFamily: fonts.regular,
    color: colors.prim,
    fontSize: 13,
    lineHeight: lineHeight(13),
  },

  arrowsHours: {
    marginLeft: -62 - 30,
  },

  arrowsMinutes: {
    marginLeft: 42 - 30,
  },

  divider: {
    height: 1,
    backgroundColor: colors.g3,
  },

  label: {
    fontSize: 14,
    lineHeight: lineHeight(14),
    fontFamily: fonts.regular,
    color: colors.g1,
    marginTop: 15,
    marginLeft: 8,
  },

  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 13,
    marginTop: 14,
    marginBottom: 16,
  },

  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.g2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayOn: {
    backgroundColor: colors.prim,
    borderColor: colors.prim,
  },

  dayText: {
    color: colors.g1,
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: lineHeight(13),
  },

  dayTextOn: {
    color: colors.white,
  },

  input: {
    height: 26,
    marginTop: 9,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.g2,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.ink,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 23,
    marginLeft: 8,
    marginBottom: 28,
  },

  removePhoto: {
    marginTop: -1,
  },

  removePhotoText: {
    color: colors.g1,
    fontSize: 13,
    lineHeight: lineHeight(13),
    fontFamily: fonts.regular,
  },

  addPhoto: {
    height: 96,
    marginTop: 23,
    marginHorizontal: 8,
    marginBottom: 28,
    backgroundColor: colors.g4,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.prim,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addPhotoText: {
    color: colors.prim,
    fontSize: 14,
    lineHeight: lineHeight(14),
    fontFamily: fonts.bold,
  },

  row: {
    height: 49,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLabel: {
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: lineHeight(15),
  },

  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowValue: {
    color: colors.g1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: lineHeight(14),
  },

  rowChevron: {
    width: 20,
    textAlign: 'right',
    color: colors.g2,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: lineHeight(15),
  },

  // Demo shortcut to reach M6; not in the mockup, so it stays quiet.
  demoButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  demoButtonText: {
    color: colors.g2,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: lineHeight(13),
    textDecorationLine: 'underline',
  },

  /* M3 ------------------------------------------------------------------- */

  cameraScreen: {
    flex: 1,
    backgroundColor: colors.night,
    paddingTop: statusBarInset,
  },

  cameraClose: {
    position: 'absolute',
    left: 22,
    top: textTop(60, 20),
  },

  cameraCloseText: {
    fontFamily: fonts.regular,
    fontSize: 20,
    lineHeight: lineHeight(20),
    color: colors.white,
  },

  cameraTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: textTop(60, 16),
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.white,
  },

  cameraPrompt: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: textTop(106, 16),
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: lineHeight(16),
    color: colors.nightText,
  },

  cameraViewWrap: {
    position: 'absolute',
    left: 32,
    right: 32,
    top: 130,
  },

  galleryButton: {
    position: 'absolute',
    left: 30,
    width: 80,
    top: textTop(630, 15),
    alignItems: 'center',
  },

  galleryText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: lineHeight(15),
    color: colors.nightText,
  },

  shutterRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 640 - 35.5,
    alignItems: 'center',
  },

  shutter: {
    width: 71,
    height: 71,
    borderRadius: 35.5,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shutterInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
  },
});
