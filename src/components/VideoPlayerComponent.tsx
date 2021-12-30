// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Easing,
//   Modal,
//   SafeAreaView,
//   StyleProp,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from 'react-native';
// import Video, {OnLoadData, OnProgressData} from 'react-native-video';
// import {Colors, FontConfig} from '../constants';
// import {CommonFunctions, CommonStyles} from '../helpers';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//
// export interface VideoPlayerComponentProps {
//   url: string;
//   onComplete?: () => void;
//   onLoaded?: () => void;
//   onError?: (error: any) => void;
//   style?: StyleProp<ViewStyle>;
//   controls?: boolean;
//   autoplay?: boolean;
//   allowFullscreen?: boolean;
//   resizeMode?: 'contain' | 'cover';
// }
//
// const GetTimeStamps = ({isMini = false, currentTime = 0, totalTime = 0}) => {
//   return (
//     <View
//       style={{
//         position: 'absolute',
//         zIndex: 20,
//         // width: 100,
//         // backgroundColor: 'red',
//         right: isMini ? 15 : 30,
//         bottom: isMini ? 15 : 30,
//       }}>
//       <Text
//         style={{
//           fontFamily: FontConfig.primary.medium,
//           color: Colors.textLight,
//           fontSize: 13,
//         }}>
//         {CommonFunctions.secondsToMMSS(currentTime)}/
//         {CommonFunctions.secondsToMMSS(totalTime)}
//       </Text>
//     </View>
//   );
// };
//
// const VideoPlayerComponent = (props: VideoPlayerComponentProps) => {
//   const {url, onComplete, onError, onLoaded} = props;
//   const allowFullscreen =
//     props.allowFullscreen === undefined ? true : props.allowFullscreen;
//   const controls = props.controls === undefined ? true : props.controls;
//   const autoplay = props.autoplay === undefined ? true : props.autoplay;
//   const resizeMode =
//     props.resizeMode === undefined ? 'contain' : props.resizeMode;
//   const style = props.style || {};
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [isPause, setIsPause] = useState(!autoplay);
//   const [showFullscreen, setShowFullscreen] = useState(false);
//   const [showControls, setShowControls] = useState(false);
//   const [lastTrackTime, setLastTrackTime] = useState(0);
//   // const [currentPercent, setCurrentPercent] = useState('0%');
//   const [currentTime, setPlaybackCurrentTime] = useState(0);
//   const [totalTime, setPlaybackTotalTime] = useState(0);
//   const secondsAnimation = useRef(new Animated.Value(0)).current;
//
//   const getSeekPercentage = useCallback(
//     (ct = currentTime, tt = totalTime) => {
//       const t = tt || 0;
//       let c = ct || 0;
//       if (c > t) {
//         c = t;
//       }
//       return (c / t || 0) * 100;
//     },
//     [currentTime, totalTime],
//   );
//   useEffect(() => {
//     const p = getSeekPercentage(currentTime, totalTime);
//     // console.log(c, t, p);
//     // setCurrentPercent(p + '%');
//     Animated.timing(secondsAnimation, {
//       useNativeDriver: false,
//       toValue: p,
//       easing: Easing.linear,
//       duration: 100,
//     }).start();
//   }, [currentTime, getSeekPercentage, secondsAnimation, totalTime]);
//
//   // useEffect(() => {
//   //   readMeta(url);
//   // }, [url]);
//   let player: Video | null = null;
//   const onBuffer = () => {
//     // console.log('buffering');
//   };
//   const videoError = (err: any) => {
//     console.log(err, 'videoError');
//     setIsLoaded(true);
//     if (onError) {
//       onError(err);
//     }
//   };
//   const onPlaybackComplete = useCallback(() => {
//     // console.log('complete');
//     if (onComplete) {
//       onComplete();
//     }
//   }, [onComplete]);
//
//   const onEnd = useCallback(() => {
//     // console.log('Play Ended');
//     setIsPause(true);
//     onVideoProgress({
//       currentTime: totalTime,
//       seekableDuration: totalTime,
//       playableDuration: 0,
//     });
//     player?.seek(0);
//     onPlaybackComplete();
//   }, [onPlaybackComplete, player, totalTime]);
//   const onLoad = useCallback(
//     (e: OnLoadData) => {
//       console.log('on Load data', e);
//       if (onLoaded) {
//         onLoaded();
//       }
//       console.log(
//         lastTrackTime !== e.duration,
//         lastTrackTime,
//         e.duration,
//         'on load data',
//       );
//       setIsLoaded(true);
//       // player?.seek(0.1);
//       if (lastTrackTime !== e.duration) {
//         player?.seek(lastTrackTime);
//         setPlaybackCurrentTime(lastTrackTime);
//         setPlaybackTotalTime(e.duration);
//         const p = getSeekPercentage(lastTrackTime, e.duration);
//         secondsAnimation.setValue(p);
//       } else {
//         setPlaybackCurrentTime(0);
//         setPlaybackTotalTime(e.duration);
//       }
//     },
//     [getSeekPercentage, lastTrackTime, onLoaded, player, secondsAnimation],
//   );
//   const togglePlayPause = useCallback(() => {
//     setIsPause((paused) => {
//       if (paused) {
//       } else {
//       }
//       return !paused;
//     });
//   }, []);
//   const onVideoProgress = (e: OnProgressData) => {
//     // console.log(e);
//     setPlaybackCurrentTime(e.currentTime);
//     setPlaybackTotalTime(e.seekableDuration);
//   };
//   const stopAndClose = () => {
//     setLastTrackTime(currentTime);
//     setShowFullscreen(false);
//   };
//   const openFullScreen = useCallback(() => {
//     if (allowFullscreen) {
//       setShowFullscreen(true);
//       setLastTrackTime(currentTime);
//     }
//   }, [allowFullscreen, currentTime]);
//
//   const getPlayPauseBtn = useCallback(
//     (isMini = false) => {
//       return (
//         <TouchableOpacity
//           onPress={togglePlayPause}
//           style={{
//             justifyContent: 'center',
//             width: isMini ? 40 : 80,
//             ...CommonFunctions.getElevationStyle(8),
//             height: isMini ? 40 : 80,
//             backgroundColor: Colors.backgroundColor,
//             borderRadius: isMini ? 20 : 40,
//             alignItems: 'center',
//           }}>
//           {!isLoaded && (
//             <ActivityIndicator size={'small'} color={Colors.primary} />
//           )}
//           {isLoaded && (
//             <>
//               {isPause && (
//                 <Icon
//                   name={'play'}
//                   color={Colors.primary}
//                   size={isMini ? 30 : 60}
//                 />
//               )}
//               {!isPause && (
//                 <Icon
//                   name={'pause'}
//                   color={Colors.primary}
//                   size={isMini ? 30 : 60}
//                 />
//               )}
//             </>
//           )}
//         </TouchableOpacity>
//       );
//     },
//     [isLoaded, isPause, togglePlayPause],
//   );
//
//   const getPlayer = (isMini = false) => {
//     return (
//       <>
//         {
//           <View
//             style={[
//               styles.playerWrapper,
//               {
//                 bottom: isMini ? 15 : 30,
//                 left: isMini ? 15 : 30,
//               },
//             ]}>
//             {controls && getPlayPauseBtn(isMini)}
//           </View>
//         }
//         <GetTimeStamps
//           isMini={isMini}
//           totalTime={totalTime}
//           currentTime={currentTime}
//         />
//         <Video
//           source={{uri: url}}
//           ref={(ref: any) => {
//             if (ref) {
//               // eslint-disable-next-line react-hooks/exhaustive-deps
//               player = ref;
//             }
//           }}
//           bufferConfig={{
//             minBufferMs: 5000,
//             maxBufferMs: 50000,
//             bufferForPlaybackMs: 5000,
//             bufferForPlaybackAfterRebufferMs: 5000,
//           }}
//           progressUpdateInterval={100}
//           resizeMode={resizeMode}
//           paused={isPause}
//           onProgress={onVideoProgress}
//           onEnd={onEnd}
//           onLoad={onLoad}
//           controls={showControls}
//           onBuffer={onBuffer}
//           onError={videoError}
//           style={[styles.backgroundVideo, style]}
//         />
//         <View style={styles.progressBar}>
//           <Animated.View
//             style={[
//               styles.progressSlider,
//               {
//                 width: secondsAnimation.interpolate({
//                   inputRange: [0, 100],
//                   outputRange: ['0%', '100%'],
//                 }),
//               },
//             ]}
//           />
//           <Text style={styles.progressCircular}>&nbsp;</Text>
//         </View>
//       </>
//     );
//   };
//
//   return (
//     <>
//       <Modal
//         visible={showFullscreen}
//         presentationStyle={'overFullScreen'}
//         animationType={'slide'}
//         animated={true}
//         onRequestClose={stopAndClose}
//         onDismiss={stopAndClose}>
//         <SafeAreaView style={CommonStyles.flex}>
//           <TouchableOpacity
//             onPress={stopAndClose}
//             style={styles.fullScreenCloseBtn}>
//             <Icon name={'close'} color={Colors.warn} size={30} />
//           </TouchableOpacity>
//           {getPlayer()}
//         </SafeAreaView>
//       </Modal>
//       {!showFullscreen && (
//         <TouchableOpacity
//           activeOpacity={allowFullscreen ? 0.7 : 1}
//           onPress={openFullScreen}
//           style={[styles.screen, style]}>
//           {getPlayer(true)}
//         </TouchableOpacity>
//       )}
//     </>
//   );
// };
//
// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   backgroundVideo: {
//     flex: 1,
//     // borderRadius: 10,
//     // width: '100%',
//     minHeight: 160,
//     // overflow: "hidden"
//   },
//   playerWrapper: {
//     position: 'absolute',
//     zIndex: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // Progress Bar
//   progressBar: {
//     width: '100%',
//     backgroundColor: '#cacfd9',
//     height: 5,
//     borderRadius: 20,
//     // alignSelf: 'center',
//     flexDirection: 'row',
//   },
//
//   progressSlider: {
//     backgroundColor: Colors.primary,
//     width: '0%',
//     // height: '90%',
//     // borderTopLeftRadius: 20,
//     // borderBottomLeftRadius: 20
//   },
//
//   progressCircular: {
//     // borderRadius: 100,
//     // backgroundColor: Colors.primary,
//     // height: 12,
//     // marginTop: -4,
//     // marginLeft: -6,
//     // width: 12
//   },
//   fullScreenCloseBtn: {
//     position: 'absolute',
//     top: 30,
//     right: 30,
//     width: 40,
//     zIndex: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.backgroundColor,
//     ...CommonFunctions.getElevationStyle(8),
//   },
// });
//
// export default VideoPlayerComponent;
