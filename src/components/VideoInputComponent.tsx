// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {CommonFunctions} from '../helpers';
// import {RecordResponse, RNCamera} from 'react-native-camera';
// import {
//   check,
//   openSettings,
//   PERMISSIONS,
//   RESULTS,
// } from 'react-native-permissions';
// import {ErrorComponent} from './core';
// import {Colors, FontConfig} from '../constants';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {Subscription, timer} from 'rxjs';
// // @ts-ignore
// import MediaMeta from 'react-native-media-meta';
//
// export interface VideoInputComponentProps {
//   onComplete?: (data: any) => void;
//   onCancel?: () => void;
//   onError?: (error: any) => void;
//   maxSeconds?: number;
// }
//
// const defaultMaxSeconds = 120;
// const CAMERA = CommonFunctions.isIOS()
//   ? PERMISSIONS.IOS.CAMERA
//   : PERMISSIONS.ANDROID.CAMERA;
// const recordTimer = timer(0, 1000);
// const VideoInputComponent = (props: VideoInputComponentProps) => {
//   const {onCancel, onComplete, onError} = props;
//   const maxSeconds = props.maxSeconds || defaultMaxSeconds;
//   const [hasAccess, setHasAccess] = useState(true);
//   const [accessText, setAccessText] = useState('');
//   const [canceled, setCanceled] = useState(false);
//   const [
//     recordingTimerSubscription,
//     setRecordingTimerSubscription,
//   ]: any = useState(null);
//   let flashEnabled = RNCamera.Constants.FlashMode.off;
//   let cameraType = RNCamera.Constants.Type.front;
//   let captureAudio = true;
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [currentTime, setCurrentTime] = useState(maxSeconds);
//
//   const onVideoTaken = (data: any) => {
//     if (onComplete) {
//       const path = data.uri.split('file://')[1];
//       console.log(path, '<<<<<<<<<<\n');
//       MediaMeta.get(path)
//         .then((metadata: any) => {
//           onComplete({
//             ...data,
//             duration: metadata.duration / 1000,
//             thumbnail_url: 'data:image/png;base64,' + metadata.thumb,
//           });
//         })
//         .catch((err: any) => console.error(err));
//     }
//   };
//   let camera: RNCamera | null;
//   const stopRecording = useCallback(() => {
//     clearTimers();
//     setIsRecording(false);
//     camera?.stopRecording();
//     setIsProcessing(true);
//   }, [camera]);
//   useEffect(() => {
//     return () => {
//       stopRecording();
//     };
//   }, [stopRecording]);
//
//   const clearTimers = () => {
//     setRecordingTimerSubscription((t: Subscription | null) => {
//       if (t) {
//         t.unsubscribe();
//       }
//       return null;
//     });
//   };
//
//   const takeVideo = async () => {
//     if (camera) {
//       if (isRecording) {
//         stopRecording();
//       } else {
//         captureAudio = true;
//         setIsRecording(true);
//         // if (recordingTimerSubscription) {
//         // 	recordingTimerSubscription.unsubscribe()
//         // }
//         // setRecordingTimerSubscription(recordTimer.subscribe(time => {
//         // 	// console.log(time, 'timer');
//         // 	setRecordTime(CommonFunctions.secondsToMMSS(time));
//         // }));
//         try {
//           const data: RecordResponse = await camera.recordAsync({
//             // codec: RNCamera.Constants.VideoCodec?.H264 || "H264",
//             mute: !captureAudio,
//             maxDuration: maxSeconds + 2,
//             mirrorVideo: true,
//             orientation: RNCamera.Constants.Orientation.portrait,
//             quality: RNCamera.Constants.VideoQuality['480p'],
//           });
//           setIsProcessing(false);
//           if (data.isRecordingInterrupted) {
//             if (onCancel) {
//               onCancel();
//             }
//           } else {
//             setCanceled((c) => {
//               if (!c) {
//                 onVideoTaken({...data});
//               }
//               return c;
//             });
//           }
//         } catch (e) {
//           if (onError) {
//             onError({error: 'error', info: e});
//           }
//           console.log(e);
//         }
//       }
//     }
//   };
//
//   const checkPermissions = () => {
//     check(CAMERA)
//       .then((result) => {
//         setHasAccess(result === RESULTS.GRANTED);
//         let errText = '';
//         switch (result) {
//           case RESULTS.UNAVAILABLE:
//             errText =
//               'This feature is not available (on this device / in this context)';
//             if (onError) {
//               onError({error: RESULTS.UNAVAILABLE, info: errText});
//             }
//             break;
//           case RESULTS.DENIED:
//             errText =
//               'The permission has not been requested / is denied but requestable';
//             break;
//           case RESULTS.GRANTED:
//             errText = 'The permission is granted';
//             break;
//           case RESULTS.BLOCKED:
//             errText = 'The permission is denied and not requestable anymore';
//             if (onError) {
//               onError({error: RESULTS.BLOCKED, info: errText});
//             }
//             break;
//         }
//         setAccessText(errText);
//       })
//       .catch((err) => {
//         if (onError) {
//           onError({error: 'error', info: 'permissions error'});
//         }
//         console.log('permissions error', err);
//       });
//   };
//   const onBeforeCancel = () => {
//     setCanceled(true);
//     if (onCancel) {
//       onCancel();
//     }
//   };
//
//   const onRecordingStart = () => {
//     // console.log('onRecordingStart\n\n');
//     clearTimers();
//     const timer = recordTimer.subscribe((time) => {
//       // console.log(time, 'timer');
//       const timeLeft = maxSeconds - time;
//       if (timeLeft <= 0) {
//         clearTimers();
//         setCurrentTime(0);
//         setIsRecording((recording) => {
//           if (recording) {
//             stopRecording();
//           }
//           return !recording;
//         });
//       } else {
//         setCurrentTime(timeLeft);
//       }
//     });
//     setRecordingTimerSubscription(timer);
//   };
//   const onRecordingEnd = () => {
//     console.log('onRecordingEnd\n\n');
//   };
//
//   return (
//     <View style={styles.screen}>
//       <Modal
//         visible={true}
//         presentationStyle={'overFullScreen'}
//         animationType={'slide'}
//         animated={true}
//         onRequestClose={onBeforeCancel}
//         transparent={true}
//         onDismiss={onBeforeCancel}>
//         {!hasAccess && (
//           <View style={styles.permissionContainer}>
//             <ErrorComponent
//               descriptionText={accessText}
//               text={'Dont have Permissions'}
//               buttonClass={'primary'}
//               icon={'camera-off'}
//               buttonText={'Change Permissions'}
//               onRefresh={() => {
//                 openSettings()
//                   .then(checkPermissions)
//                   .catch(() => console.warn('cannot open settings'));
//               }}
//             />
//           </View>
//         )}
//         {hasAccess && (
//           <View style={styles.container}>
//             <RNCamera
//               ref={(ref: any) => {
//                 if (!ref) {
//                   return;
//                 }
//                 camera = ref;
//                 ref.refreshAuthorizationStatus().then(checkPermissions);
//               }}
//               onRecordingStart={onRecordingStart}
//               onRecordingEnd={onRecordingEnd}
//               style={styles.preview}
//               captureAudio={captureAudio}
//               type={cameraType}
//               flashMode={flashEnabled}
//               androidCameraPermissionOptions={{
//                 title: 'Permission to use camera',
//                 message: 'We need your permission to use your camera',
//                 buttonPositive: 'Ok',
//                 buttonNegative: 'Cancel',
//               }}
//             />
//             <TouchableOpacity
//               onPress={onBeforeCancel}
//               style={{
//                 position: 'absolute',
//                 top: 50,
//                 right: 30,
//                 width: 40,
//                 zIndex: 100,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: 40,
//                 borderRadius: 20,
//                 backgroundColor: Colors.backgroundColor,
//                 ...CommonFunctions.getElevationStyle(8),
//               }}>
//               <Icon name={'close'} color={Colors.warn} size={30} />
//             </TouchableOpacity>
//             {isProcessing && (
//               <TouchableOpacity
//                 disabled={true}
//                 style={[styles.capture, {borderColor: '#333'}]}>
//                 <View style={[styles.captureInner, {backgroundColor: '#333'}]}>
//                   <View style={styles.processingIconHolder}>
//                     <ActivityIndicator size={'large'} color="#FFF" />
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             )}
//             {!isProcessing && (
//               <>
//                 {isRecording && (
//                   <View style={styles.recordingTimeHolder}>
//                     <Animated.View style={styles.recordingTimeIndicator} />
//                     <Text style={styles.recordingTimeText}>
//                       {CommonFunctions.secondsToMMSS(currentTime) || '00:00'}
//                     </Text>
//                   </View>
//                 )}
//                 {
//                   <TouchableOpacity
//                     onPress={takeVideo}
//                     style={[styles.capture]}>
//                     {!isRecording && (
//                       <View style={[styles.captureInner, styles.record]} />
//                     )}
//                     {isRecording && (
//                       <View style={[styles.captureInner, styles.recording]} />
//                     )}
//                   </TouchableOpacity>
//                 }
//               </>
//             )}
//           </View>
//         )}
//       </Modal>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     padding: 10,
//   },
//   recordingTimeHolder: {
//     position: 'absolute',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     borderRadius: 6,
//     zIndex: 15,
//     left: 30,
//     top: 50,
//   },
//   recordingTimeIndicator: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#f00',
//     marginRight: 10,
//   },
//   recordingTimeText: {
//     fontSize: 20,
//     fontFamily: FontConfig.primary.medium,
//     color: '#FFF',
//   },
//   record: {
//     backgroundColor: '#F00',
//     position: 'relative',
//     left: 5,
//     top: 5,
//     borderRadius: 35,
//     width: 60,
//     height: 60,
//   },
//   recording: {
//     backgroundColor: '#F00',
//     position: 'relative',
//     left: 15,
//     top: 15,
//     borderRadius: 10,
//     width: 40,
//     height: 40,
//   },
//   preview: {
//     flex: 1,
//     zIndex: 1,
//     backgroundColor: 'black',
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   capture: {
//     zIndex: 10,
//     flex: 0,
//     position: 'absolute',
//     bottom: 10,
//     borderColor: '#FFF',
//     borderWidth: 5,
//     borderRadius: 40,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//     margin: 20,
//   },
//   captureInner: {
//     position: 'relative',
//     left: 5,
//     top: 5,
//     backgroundColor: '#fff',
//     borderRadius: 35,
//     width: 60,
//     height: 60,
//   },
//   processingIconHolder: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//     left: 1.5,
//     top: 1,
//   },
// });
//
// export default VideoInputComponent;
