import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, Pressable, Switch, TextInput,
  ScrollView, Modal, StatusBar
} from 'react-native';
import VerificationSelectorScreen from './screens/VerificationSelectorScreen';
import AlarmRingingScreen from './screens/AlarmRingingScreen';

const C = { ink: '#1a1a1a', g1: '#4d4d4d', g2: '#8c8c8c', g3: '#c9c9c9', g4: '#f0f0f0', white: '#ffffff' };
const DAYS = ['L','M','M','J','V','S','D'];

export default function App() {
  const [screen, setScreen] = useState('alarms');
  const [days, setDays] = useState([false,true,false,true,false,false,false]);
  const [purpose, setPurpose] = useState('Remedios de mamá');
  const [verification, setVerification] = useState('Escanear objeto');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [soundIndex, setSoundIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alarmToggles, setAlarmToggles] = useState([true,true,false]);
  const sounds = ['Radar','Campanas','Pulso'];

  const nav = (next) => setScreen(next);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.phone}>
        {screen === 'alarms' && <AlarmList nav={nav} toggles={alarmToggles} setToggles={setAlarmToggles} openSettings={() => setSettingsOpen(true)} />}
        {screen === 'new' && <AlarmEditor nav={nav} days={days} setDays={setDays} purpose={purpose} setPurpose={setPurpose} verification={verification} hasPhoto={hasPhoto} setHasPhoto={setHasPhoto} sound={sounds[soundIndex]} nextSound={() => setSoundIndex((soundIndex+1)%sounds.length)} />}
        {screen === 'camera' && <Camera nav={nav} onPhoto={() => { setHasPhoto(true); nav('new'); }} />}
        {screen === 'verify' && <VerificationSelectorScreen nav={nav} verification={verification} setVerification={setVerification} />}
        {screen === 'ringing' && <AlarmRingingScreen nav={nav} />}
        {screen === 'scan' && <Scan nav={nav} />}
        {screen === 'done' && <Done nav={nav} />}
      </View>
      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </SafeAreaView>
  );
}

function Header({left, title, right, onLeft, onRight}) {
  return <View style={s.header}>
    <Pressable style={s.headerSide} onPress={onLeft}><Text style={s.headerAction}>{left || ''}</Text></Pressable>
    <Text style={s.headerTitle}>{title}</Text>
    <Pressable style={[s.headerSide,{alignItems:'flex-end'}]} onPress={onRight}><Text style={[s.headerAction, right==='Guardar' && {fontWeight:'800',color:C.ink}]}>{right || ''}</Text></Pressable>
  </View>;
}

function AlarmList({nav,toggles,setToggles,openSettings}) {
  const alarms = [
    {time:'06:30', name:'Remedios de mamá', repeat:'Mar - Jue', photo:true},
    {time:'07:00', name:'Levantarme', repeat:'L M M J V'},
    {time:'18:30', name:'Sacar la ropa', repeat:'Solo hoy', photo:true},
  ];
  return <View style={s.flex}>
    <Header title="Pendiente" right="Ajustes" onRight={openSettings}/>
    <ScrollView contentContainerStyle={s.listPad}>
      {alarms.map((a,i)=><Pressable key={a.time+a.name} style={s.alarmRow} onPress={()=>nav('new')}>
        <View style={s.flex}><View style={s.timeLine}><Text style={s.listTime}>{a.time}</Text>{a.photo && <Text style={s.badge}>FOTO</Text>}</View><Text style={s.name}>{a.name}</Text><Text style={s.meta}>{a.repeat}</Text></View>
        <Switch value={toggles[i]} onValueChange={v=>setToggles(toggles.map((x,idx)=>idx===i?v:x))} trackColor={{false:C.g3,true:C.ink}} thumbColor={C.white}/>
      </Pressable>)}
    </ScrollView>
    <Pressable style={s.fab} onPress={()=>nav('new')}><Text style={s.fabText}>＋</Text></Pressable>
  </View>;
}

function AlarmEditor({nav,days,setDays,purpose,setPurpose,verification,hasPhoto,setHasPhoto,sound,nextSound}) {
  return <View style={s.flex}>
    <Header left="Cancelar" title="Nueva alarma" right="Guardar" onLeft={()=>nav('alarms')} onRight={()=>nav('alarms')}/>
    <ScrollView contentContainerStyle={s.formPad}>
      <Text style={s.bigTime}>06 : 30</Text><Text style={s.arrows}>▲ ▼       ▲ ▼</Text>
      <Divider/>
      <Text style={s.label}>Repetir</Text>
      <View style={s.days}>{DAYS.map((d,i)=><Pressable key={i} style={[s.day,days[i]&&s.dayOn]} onPress={()=>setDays(days.map((x,idx)=>idx===i?!x:x))}><Text style={[s.dayText,days[i]&&s.dayTextOn]}>{d}</Text></Pressable>)}</View>
      <Divider/>
      <Text style={s.label}>¿Para qué es?</Text><TextInput value={purpose} onChangeText={setPurpose} placeholder="Ej.: Remedios de mamá" placeholderTextColor={C.g3} style={s.input}/>
      {hasPhoto ? <View style={s.photoRow}><PurposePhoto small/><Pressable onPress={()=>setHasPhoto(false)}><Text style={s.link}>× Quitar</Text></Pressable></View> : <Pressable style={s.addPhoto} onPress={()=>nav('camera')}><Text>Agregar foto (opcional)</Text></Pressable>}
      <Divider/>
      <Row label="Verificación" value={verification} onPress={()=>nav('verify')}/>
      <Divider/>
      <Row label="Sonido" value={sound} onPress={nextSound}/>
      <Divider/>
      <Pressable style={s.demoButton} onPress={()=>nav('ringing')}><Text style={s.demoButtonText}>Ver flujo de alarma sonando</Text></Pressable>
    </ScrollView>
  </View>;
}

function Camera({nav,onPhoto}) {
  return <View style={s.flex}>
    <Header left="×" title="Foto de propósito" onLeft={()=>nav('new')}/>
    <View style={s.cameraPad}><Text style={s.cameraPrompt}>Enfocá lo que tenés que recordar</Text><CameraBox label="(lo que la cámara ve)"/><View style={s.cameraActions}><Pressable onPress={onPhoto}><Text style={s.link}>Galería</Text></Pressable><Pressable style={s.shutter} onPress={onPhoto}><View style={s.shutterInner}/></Pressable><View style={{width:60}}/></View></View>
  </View>;
}

function Scan({nav}) {
  return <View style={s.flex}><View style={s.scanPad}><Text style={s.scanTitle}>Apuntá la cámara a:</Text><View style={s.referenceRow}><PurposePhoto tiny/><Text style={s.meta}>← la referencia que guardaste</Text></View><CameraBox label="(lo que la cámara ve ahora)"/><Text style={s.searching}>Buscando...</Text><Pressable style={s.secondary} onPress={()=>nav('done')}><Text style={s.secondaryText}>No puedo ahora</Text></Pressable><Pressable style={[s.primary,{marginTop:12}]} onPress={()=>nav('done')}><Text style={s.primaryText}>Simular coincidencia</Text></Pressable></View></View>;
}

function Done({nav}) {
  return <View style={[s.flex,s.donePad]}><View style={s.checkCircle}><Text style={s.check}>✓</Text></View><Text style={s.doneTitle}>Listo, despertaste</Text><Text style={s.doneName}>Remedios de mamá</Text><Divider/><Text style={s.streak}>Van 4 martes seguidos</Text><View style={{height:56}}/><Pressable style={s.secondary} onPress={()=>nav('alarms')}><Text style={s.secondaryText}>Cerrar</Text></Pressable></View>;
}

function SettingsModal({visible,onClose}) {
  const [notif,setNotif] = useState(true); const [privacy,setPrivacy]=useState(true);
  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}><Pressable style={s.modalBg} onPress={onClose}><Pressable style={s.modalCard} onPress={()=>{}}><Text style={s.modalTitle}>Ajustes (prototipo)</Text><View style={s.settingRow}><Text>Notificaciones</Text><Switch value={notif} onValueChange={setNotif}/></View><View style={s.settingRow}><Text>Recordatorio de privacidad</Text><Switch value={privacy} onValueChange={setPrivacy}/></View><Pressable style={s.secondary} onPress={onClose}><Text style={s.secondaryText}>Cerrar</Text></Pressable></Pressable></Pressable></Modal>;
}

const Divider = () => <View style={s.divider}/>;
function Row({label,value,onPress}) { return <Pressable style={s.row} onPress={onPress}><Text>{label}</Text><Text style={s.rowValue}>{value}  ›</Text></Pressable>; }
function PurposePhoto({small,large,tiny}) { const size=tiny?70:small?160:large?300:160; return <View style={[s.photo,{width:size,height:tiny?70:small?105:large?300:105}]}><Text style={s.photoText}>{large?'los remedios (foto grande)':tiny?'tu foto':'los remedios'}</Text></View>; }
function CameraBox({label}) { return <View style={s.cameraBox}><Text style={s.photoText}>{label}</Text></View>; }

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.g4,alignItems:'center'}, phone:{flex:1,width:'100%',maxWidth:430,backgroundColor:C.white,borderLeftWidth:1,borderRightWidth:1,borderColor:C.g3}, flex:{flex:1},
  header:{height:62,borderBottomWidth:1,borderColor:C.g3,flexDirection:'row',alignItems:'center',paddingHorizontal:16}, headerSide:{width:82,justifyContent:'center'}, headerTitle:{flex:1,textAlign:'center',fontWeight:'800',fontSize:16,color:C.ink}, headerAction:{color:C.g1,fontSize:14},
  listPad:{paddingHorizontal:18,paddingBottom:120}, alarmRow:{minHeight:96,borderBottomWidth:1,borderColor:C.g3,flexDirection:'row',alignItems:'center',gap:12}, timeLine:{flexDirection:'row',alignItems:'center',gap:10}, listTime:{fontSize:28,fontWeight:'800',color:C.ink}, badge:{fontSize:10,color:C.g1,borderWidth:1,borderColor:C.g2,borderRadius:4,paddingHorizontal:5,paddingVertical:1}, name:{fontSize:15,color:C.ink}, meta:{fontSize:12,color:C.g2,marginTop:4},
  fab:{position:'absolute',right:22,bottom:24,width:56,height:56,borderRadius:28,backgroundColor:C.ink,alignItems:'center',justifyContent:'center'},fabText:{fontSize:34,color:C.white,fontWeight:'300',marginTop:-3},
  formPad:{paddingHorizontal:18,paddingBottom:40}, bigTime:{fontSize:54,fontWeight:'800',textAlign:'center',marginTop:28,color:C.ink}, arrows:{textAlign:'center',color:C.g2,fontSize:11,letterSpacing:3,marginBottom:14}, divider:{height:1,backgroundColor:C.g3,marginVertical:16}, label:{fontSize:14,color:C.g1,marginBottom:10}, days:{flexDirection:'row',justifyContent:'space-between'}, day:{width:38,height:38,borderRadius:19,borderWidth:1,borderColor:C.g2,alignItems:'center',justifyContent:'center'},dayOn:{backgroundColor:C.ink,borderColor:C.ink},dayText:{color:C.g1},dayTextOn:{color:C.white,fontWeight:'800'}, input:{height:44,borderBottomWidth:1,borderColor:C.g1,fontSize:16,color:C.ink},
  photoRow:{flexDirection:'row',alignItems:'flex-start',gap:14,marginTop:18}, photo:{backgroundColor:C.g4,borderWidth:1,borderColor:C.g2,alignItems:'center',justifyContent:'center'},photoText:{backgroundColor:C.white,color:C.g1,fontSize:11,paddingHorizontal:8,paddingVertical:3},link:{color:C.g1,fontSize:14,paddingVertical:10},addPhoto:{height:105,backgroundColor:C.g4,borderWidth:1,borderStyle:'dashed',borderColor:C.g2,alignItems:'center',justifyContent:'center',marginTop:18},row:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},rowValue:{color:C.g1},demoButton:{marginTop:24,minHeight:46,borderWidth:1,borderColor:C.g2,borderRadius:8,alignItems:'center',justifyContent:'center'},demoButtonText:{color:C.g1,fontWeight:'700'},
  cameraPad:{flex:1,padding:24},cameraPrompt:{textAlign:'center',color:C.g1,marginVertical:18},cameraBox:{height:360,borderWidth:1,borderStyle:'dashed',borderColor:C.g2,backgroundColor:C.g4,alignItems:'center',justifyContent:'center'},cameraActions:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:24},shutter:{width:64,height:64,borderRadius:32,borderWidth:3,borderColor:C.ink,alignItems:'center',justifyContent:'center'},shutterInner:{width:50,height:50,borderRadius:25,backgroundColor:C.ink},
  centerPad:{alignItems:'center',paddingHorizontal:28,paddingTop:24},ringTime:{fontSize:34,fontWeight:'800'},metaCenter:{fontSize:13,color:C.g2,marginBottom:20},ringTitle:{fontSize:22,fontWeight:'800',marginVertical:22},primary:{minHeight:52,width:'100%',borderRadius:8,backgroundColor:C.ink,alignItems:'center',justifyContent:'center'},primaryText:{color:C.white,fontWeight:'800'},snooze:{color:C.g2,marginTop:22,padding:12},
  scanPad:{padding:28},scanTitle:{fontSize:18,fontWeight:'800',marginBottom:16},referenceRow:{flexDirection:'row',alignItems:'center',gap:14,marginBottom:22},searching:{textAlign:'center',color:C.g1,marginVertical:22},secondary:{minHeight:50,width:'100%',borderWidth:1,borderColor:C.ink,borderRadius:8,alignItems:'center',justifyContent:'center',backgroundColor:C.white},secondaryText:{fontWeight:'800',color:C.ink},
  donePad:{alignItems:'center',padding:36,paddingTop:130},checkCircle:{width:88,height:88,borderWidth:2,borderColor:C.ink,borderRadius:44,alignItems:'center',justifyContent:'center'},check:{fontSize:48},doneTitle:{fontSize:24,fontWeight:'800',marginTop:22},doneName:{color:C.g1,marginTop:10},streak:{color:C.g1},
  modalBg:{flex:1,backgroundColor:'rgba(0,0,0,.35)',alignItems:'center',justifyContent:'center',padding:24},modalCard:{width:'100%',maxWidth:380,backgroundColor:C.white,borderRadius:14,padding:20},modalTitle:{fontSize:20,fontWeight:'800',marginBottom:20},settingRow:{minHeight:56,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderColor:C.g3,marginBottom:12}
});
