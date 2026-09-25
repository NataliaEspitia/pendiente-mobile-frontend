import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
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
} from './theme';

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
        <Text style={s.headerAction}>
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

  return (
    <View style={s.flex}>
      <Header
        title="Pendiente"
        right="Ajustes"
        onRight={openSettings}
      />

      <ScrollView
        contentContainerStyle={s.listPad}
        showsVerticalScrollIndicator={false}
      >
        {alarms.map((alarm, index) => (
          <Pressable
            key={`${alarm.time}-${alarm.name}`}
            style={({ pressed }) => [
              s.alarmRow,
              pressed && s.pressed,
            ]}
            onPress={() => openAlarm(alarm)}
          >
            <View style={s.alarmContent}>
              <View style={s.timeLine}>
                <Text style={s.listTime}>
                  {alarm.time}
                </Text>

                {alarm.photo && (
                  <Text style={s.badge}>
                    FOTO
                  </Text>
                )}
              </View>

              <Text style={s.name}>
                {alarm.name}
              </Text>

              <Text style={s.meta}>
                {alarm.repeat}
              </Text>
            </View>

            <Switch
              value={toggles[index]}
              onValueChange={(value) =>
                toggleAlarm(index, value)
              }
              trackColor={{
                false: colors.g3,
                true: colors.prim,
              }}
              thumbColor={colors.white}
            />
          </Pressable>
        ))}
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
          ＋
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
    <View style={s.flex}>
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

        <Text style={s.arrows}>
          ▲ ▼       ▲ ▼
        </Text>

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
            <PurposePhoto small />

            <Pressable
              style={({ pressed }) => [
                s.removePhoto,
                pressed && s.pressed,
              ]}
              onPress={() => setHasPhoto(false)}
            >
              <Text style={s.link}>
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
  return (
    <View style={s.flex}>
      <Header
        left="×"
        title="Foto de propósito"
        onLeft={() => nav('new')}
      />

      <View style={s.cameraPad}>
        <Text style={s.cameraPrompt}>
          Enfoca lo que tienes que recordar
        </Text>

        <CameraBox
          label="(lo que la cámara ve)"
        />

        <View style={s.cameraActions}>
          <Pressable
            style={({ pressed }) => [
              s.galleryButton,
              pressed && s.pressed,
            ]}
            onPress={onPhoto}
          >
            <Text style={s.link}>
              Galería
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              s.shutter,
              pressed && s.pressed,
            ]}
            onPress={onPhoto}
            accessibilityRole="button"
            accessibilityLabel="Tomar foto"
          >
            <View style={s.shutterInner} />
          </Pressable>

          <View style={s.cameraSpacer} />
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

      <Text style={s.rowValue}>
        {value}  ›
      </Text>
    </Pressable>
  );
}

function PurposePhoto({
  small,
  large,
  tiny,
}) {
  const width = tiny
    ? 70
    : small
      ? 160
      : large
        ? 300
        : 160;

  const height = tiny
    ? 70
    : small
      ? 105
      : large
        ? 300
        : 105;

  const text = large
    ? 'los remedios'
    : tiny
      ? 'tu foto'
      : 'los remedios';

  return (
    <View
      style={[
        s.photo,
        {
          width,
          height,
        },
      ]}
    >
      <View style={s.photoDiagonalOne} />
      <View style={s.photoDiagonalTwo} />

      <Text style={s.photoText}>
        {text}
      </Text>
    </View>
  );
}

function CameraBox({
  label,
}) {
  return (
    <View style={s.cameraBox}>
      <Text style={s.cameraBoxText}>
        {label}
      </Text>
    </View>
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

    // SafeAreaView no agrega correctamente este espacio en Android.
    // theme.js calcula StatusBar.currentHeight cuando corresponde.
    paddingTop: statusBarInset,
  },

  phone: {
    flex: 1,
    width: '100%',
    maxWidth: FRAME.width,
    backgroundColor: colors.white,
  },

  flex: {
    flex: 1,
  },

  pressed: {
    opacity: 0.7,
  },

  /* Header --------------------------------------------------------------- */

  header: {
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: colors.g3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
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
    color: colors.ink,
  },

  headerAction: {
    fontFamily: fonts.regular,
    color: colors.prim,
    fontSize: 14,
  },

  headerActionBold: {
    fontFamily: fonts.bold,
    color: colors.prim,
  },

  /* M1 ------------------------------------------------------------------- */

  listPad: {
    paddingHorizontal: 18,
    paddingBottom: 110,
  },

  alarmRow: {
    minHeight: 96,
    borderBottomWidth: 1,
    borderBottomColor: colors.g3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  alarmContent: {
    flex: 1,
  },

  timeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  listTime: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.ink,
  },

  badge: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.photoInk,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: colors.accentLight,
    letterSpacing: 0.6,
  },

  name: {
    marginTop: 3,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },

  meta: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.g2,
    marginTop: 4,
  },

  fab: {
    position: 'absolute',
    right: 22,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.prim,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  fabText: {
    fontSize: 34,
    lineHeight: 38,
    color: colors.white,
    fontFamily: fonts.regular,
    marginTop: -3,
  },

  /* M2 / M4 -------------------------------------------------------------- */

  formPad: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  bigTime: {
    fontSize: 62,
    lineHeight: 68,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginTop: 24,
    color: colors.ink,
  },

  arrows: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    color: colors.g2,
    fontSize: 11,
    letterSpacing: 3,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: colors.g3,
    marginVertical: 16,
  },

  label: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.g1,
    marginBottom: 10,
  },

  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  day: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontFamily: fonts.regular,
    fontSize: 14,
  },

  dayTextOn: {
    color: colors.white,
    fontFamily: fonts.bold,
  },

  input: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: colors.g1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.ink,
    paddingHorizontal: 0,
  },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginTop: 18,
  },

  removePhoto: {
    minHeight: 44,
    justifyContent: 'center',
  },

  photo: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.photoBg,
    borderWidth: 1,
    borderColor: colors.photoLine,
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoDiagonalOne: {
    position: 'absolute',
    width: '140%',
    height: 1,
    backgroundColor: colors.photoLine,
    transform: [
      {
        rotate: '33deg',
      },
    ],
  },

  photoDiagonalTwo: {
    position: 'absolute',
    width: '140%',
    height: 1,
    backgroundColor: colors.photoLine,
    transform: [
      {
        rotate: '-33deg',
      },
    ],
  },

  photoText: {
    zIndex: 2,
    backgroundColor: colors.white,
    color: colors.photoInk,
    fontFamily: fonts.regular,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  link: {
    color: colors.prim,
    fontSize: 14,
    fontFamily: fonts.regular,
    paddingVertical: 10,
  },

  addPhoto: {
    height: 105,
    backgroundColor: colors.g4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.g2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  addPhotoText: {
    color: colors.prim,
    fontSize: 14,
    fontFamily: fonts.regular,
  },

  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLabel: {
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 15,
  },

  rowValue: {
    color: colors.g1,
    fontFamily: fonts.regular,
    fontSize: 15,
  },

  demoButton: {
    marginTop: 24,
    minHeight: 46,
    borderWidth: 1.5,
    borderColor: colors.prim,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  demoButtonText: {
    color: colors.prim,
    fontFamily: fonts.bold,
    fontSize: 14,
  },

  /* M3 ------------------------------------------------------------------- */

  cameraPad: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
  },

  cameraPrompt: {
    textAlign: 'center',
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 15,
    marginBottom: 20,
  },

  cameraBox: {
    height: 360,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.g2,
    backgroundColor: colors.g4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraBoxText: {
    color: colors.g1,
    fontFamily: fonts.regular,
    fontSize: 13,
  },

  cameraActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  galleryButton: {
    width: 60,
    minHeight: 44,
    justifyContent: 'center',
  },

  cameraSpacer: {
    width: 60,
  },

  shutter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.prim,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.prim,
  },
});