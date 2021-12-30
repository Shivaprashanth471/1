// import React, {useEffect, useState} from 'react';
// import {
// 	ActivityIndicator,
// 	Animated,
// 	StyleSheet,
// 	Text,
// 	TouchableOpacity,
// 	View,
// } from 'react-native';
// import {
// 	RecordResponse,
// 	RNCamera,
// 	TakePictureResponse,
// } from 'react-native-camera';
// import {Colors, FontConfig} from '../constants';
// // import * as Animatable from 'react-native-animatable';
// import {timer} from 'rxjs';
// import {CommonFunctions} from '../helpers';
// import {
// 	check,
// 	openSettings,
// 	PERMISSIONS,
// 	RESULTS,
// } from 'react-native-permissions';
// import {ErrorComponent} from './core';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//
// export interface CameraInputProps {
// 	mode: 'image' | 'video';
// 	onPhotoTaken: (photo: any) => void;
// 	onCancel?: () => void;
// 	isVideoRecording?: (isRecording: boolean) => void;
// 	onError?: (err: {error: string; info: string}) => void;
// 	maxSeconds?: number;
// }
//
// const defaultMaxSeconds = 120;
//
// const CAMERA = CommonFunctions.isIOS()
// 	? PERMISSIONS.IOS.CAMERA
// 	: PERMISSIONS.ANDROID.CAMERA;
// const recordTimer = timer(0, 1000);
// const CameraInput = (props: CameraInputProps) => {
// 	const maxSeconds = props.maxSeconds || defaultMaxSeconds;
// 	const [hasAccess, setHasAccess] = useState(true);
// 	const [accessText, setAccessText] = useState('');
// 	const [canceled, setCanceled] = useState(false);
// 	const {mode, onPhotoTaken, onCancel, isVideoRecording, onError} = props;
// 	const [recordingTimerSubscription, setRecordingTimerSubscription]: any =
// 		useState(null);
// 	let flashEnabled = RNCamera.Constants.FlashMode.off;
// 	let cameraType = RNCamera.Constants.Type.front;
// 	let captureAudio = false;
// 	const [isRecording, setIsRecording] = useState(false);
// 	const [isProcessing, setIsProcessing] = useState(false);
// 	const [currentTime, setCurrentTime] = useState(maxSeconds);
// 	// const [recordTime, setRecordTime] = useState(CommonFunctions.secondsToMMSS(maxSeconds));
// 	let camera: RNCamera | null;
// 	useEffect(() => {
// 		return () => {
// 			camera?.stopRecording();
// 			if (recordingTimerSubscription) {
// 				recordingTimerSubscription.unsubscribe();
// 			}
// 		};
// 	}, []);
// 	const takePicture = async () => {
// 		if (camera) {
// 			flashEnabled = RNCamera.Constants.FlashMode.auto;
// 			setIsProcessing(true);
// 			const data: TakePictureResponse = await camera.takePictureAsync({
// 				quality: 0.8,
// 				pauseAfterCapture: true,
// 				mirrorImage: true,
// 			});
// 			setIsProcessing(false);
// 			onPhotoTaken(data);
// 		}
// 	};
// 	useEffect(() => {
// 		if (isVideoRecording) {
// 			isVideoRecording(isRecording);
// 		}
// 	}, [isRecording]);
//
// 	const takeVideo = async () => {
// 		if (camera) {
// 			if (isRecording) {
// 				setIsRecording(false);
// 				if (recordingTimerSubscription) {
// 					recordingTimerSubscription.unsubscribe();
// 				}
// 				setIsProcessing(true);
// 				camera.stopRecording();
// 			} else {
// 				captureAudio = true;
// 				setIsRecording(true);
// 				// if (recordingTimerSubscription) {
// 				// 	recordingTimerSubscription.unsubscribe()
// 				// }
// 				// setRecordingTimerSubscription(recordTimer.subscribe(time => {
// 				// 	// console.log(time, 'timer');
// 				// 	setRecordTime(CommonFunctions.secondsToMMSS(time));
// 				// }));
// 				try {
// 					const data: RecordResponse = await camera.recordAsync({
// 						codec: 'H264',
// 						mute: false,
// 						maxDuration: 2 * 60,
// 						mirrorVideo: true,
// 						orientation: RNCamera.Constants.Orientation.portrait,
// 						quality: RNCamera.Constants.VideoQuality['480p'],
// 					});
// 					setIsProcessing(false);
// 					console.log('Video Recorded', data);
// 					if (data.isRecordingInterrupted) {
// 						if (onCancel) {
// 							onCancel();
// 						}
// 					} else {
// 						setCanceled((c) => {
// 							if (!c) {
// 								onPhotoTaken(data);
// 							}
// 							return c;
// 						});
// 					}
// 				} catch (e) {
// 					if (onError) {
// 						onError({error: 'error', info: e});
// 					}
// 					console.log(e);
// 				}
// 			}
// 		}
// 	};
//
// 	const checkPermissions = () => {
// 		check(CAMERA)
// 			.then((result) => {
// 				setHasAccess(result === RESULTS.GRANTED);
// 				let errText = '';
// 				switch (result) {
// 					case RESULTS.UNAVAILABLE:
// 						errText =
// 							'This feature is not available (on this device / in this context)';
// 						if (onError) {
// 							onError({error: RESULTS.UNAVAILABLE, info: errText});
// 						}
// 						break;
// 					case RESULTS.DENIED:
// 						errText =
// 							'The permission has not been requested / is denied but requestable';
// 						break;
// 					case RESULTS.GRANTED:
// 						errText = 'The permission is granted';
// 						break;
// 					case RESULTS.BLOCKED:
// 						errText = 'The permission is denied and not requestable anymore';
// 						if (onError) {
// 							onError({error: RESULTS.BLOCKED, info: errText});
// 						}
// 						break;
// 				}
// 				setAccessText(errText);
// 			})
// 			.catch((err) => {
// 				if (onError) {
// 					onError({error: 'error', info: 'permissions error'});
// 				}
// 				console.log('permissions error', err);
// 			});
// 	};
// 	const onBeforeCancel = () => {
// 		setCanceled(true);
// 		if (onCancel) {
// 			onCancel();
// 		}
// 	};
// 	const onPictureTaken = () => {
// 		console.log('Photo snapped!');
// 		camera?.pausePreview();
// 	};
//
// 	const onRecordingStart = () => {
// 		// console.log('onRecordingStart\n\n');
// 		if (recordingTimerSubscription) {
// 			recordingTimerSubscription.unsubscribe();
// 		}
// 		setRecordingTimerSubscription(
// 			recordTimer.subscribe((time) => {
// 				// console.log(time, 'timer');
// 				const timeLeft = maxSeconds - time;
// 				if (timeLeft <= 0) {
// 					setCurrentTime(0);
// 					takeVideo();
// 				} else {
// 					setCurrentTime(timeLeft);
// 				}
// 			}),
// 		);
// 	};
// 	const onRecordingEnd = () => {
// 		console.log('onRecordingEnd\n\n');
// 	};
// 	return (
// 		<>
// 			{!hasAccess && (
// 				<View style={styles.permissionContainer}>
// 					<ErrorComponent
// 						descriptionText={accessText}
// 						text={'Dont have Permissions'}
// 						buttonClass={'primary'}
// 						icon={'camera-off'}
// 						buttonText={'Change Permissions'}
// 						onRefresh={() => {
// 							openSettings()
// 								.then(checkPermissions)
// 								.catch(() => console.warn('cannot open settings'));
// 						}}
// 					/>
// 				</View>
// 			)}
// 			{hasAccess && (
// 				<View style={styles.container}>
// 					<RNCamera
// 						ref={(ref: any) => {
// 							if (!ref) {
// 								return;
// 							}
// 							camera = ref;
// 							ref.refreshAuthorizationStatus().then(checkPermissions);
// 						}}
// 						onRecordingStart={onRecordingStart}
// 						onRecordingEnd={onRecordingEnd}
// 						onPictureTaken={onPictureTaken}
// 						style={styles.preview}
// 						captureAudio={captureAudio}
// 						type={cameraType}
// 						flashMode={flashEnabled}
// 						androidCameraPermissionOptions={{
// 							title: 'Permission to use camera',
// 							message: 'We need your permission to use your camera',
// 							buttonPositive: 'Ok',
// 							buttonNegative: 'Cancel',
// 						}}
// 					/>
// 					<TouchableOpacity
// 						onPress={onBeforeCancel}
// 						style={{
// 							position: 'absolute',
// 							top: 50,
// 							right: 30,
// 							width: 40,
// 							zIndex: 100,
// 							justifyContent: 'center',
// 							alignItems: 'center',
// 							height: 40,
// 							borderRadius: 20,
// 							backgroundColor: Colors.backgroundColor,
// 							...CommonFunctions.getElevationStyle(8),
// 						}}>
// 						<Icon name={'close'} color={Colors.warn} size={30} />
// 					</TouchableOpacity>
// 					{isProcessing && (
// 						<TouchableOpacity
// 							disabled={true}
// 							style={[styles.capture, {borderColor: '#333'}]}>
// 							<View style={[styles.captureInner, {backgroundColor: '#333'}]}>
// 								<View style={styles.processingIconHolder}>
// 									<ActivityIndicator size={'large'} color="#FFF" />
// 								</View>
// 							</View>
// 						</TouchableOpacity>
// 					)}
// 					{!isProcessing && (
// 						<>
// 							{mode === 'video' && isRecording && (
// 								<View style={styles.recordingTimeHolder}>
// 									<Animated.View style={styles.recordingTimeIndicator} />
// 									<Text style={styles.recordingTimeText}>
// 										{CommonFunctions.secondsToMMSS(currentTime) || '00:00'}
// 									</Text>
// 								</View>
// 							)}
// 							{mode === 'video' && (
// 								<TouchableOpacity onPress={takeVideo} style={[styles.capture]}>
// 									{!isRecording && (
// 										<View style={[styles.captureInner, styles.record]} />
// 									)}
// 									{isRecording && (
// 										<View style={[styles.captureInner, styles.recording]} />
// 									)}
// 								</TouchableOpacity>
// 							)}
// 							{mode === 'image' && (
// 								<TouchableOpacity
// 									onPress={takePicture}
// 									style={[styles.capture]}>
// 									<View style={[styles.captureInner]} />
// 								</TouchableOpacity>
// 							)}
// 						</>
// 					)}
// 				</View>
// 			)}
// 		</>
// 	);
// };
//
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// 	permissionContainer: {
// 		flex: 1,
// 		padding: 10,
// 	},
// 	recordingTimeHolder: {
// 		position: 'absolute',
// 		flexDirection: 'row',
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		backgroundColor: '#000',
// 		paddingHorizontal: 10,
// 		paddingVertical: 2,
// 		borderRadius: 6,
// 		zIndex: 15,
// 		left: 30,
// 		top: 50,
// 	},
// 	recordingTimeIndicator: {
// 		width: 20,
// 		height: 20,
// 		borderRadius: 10,
// 		backgroundColor: '#f00',
// 		marginRight: 10,
// 	},
// 	recordingTimeText: {
// 		fontSize: 20,
// 		fontFamily: FontConfig.primary.medium,
// 		color: '#FFF',
// 	},
// 	record: {
// 		backgroundColor: '#F00',
// 		position: 'relative',
// 		left: 5,
// 		top: 5,
// 		borderRadius: 35,
// 		width: 60,
// 		height: 60,
// 	},
// 	recording: {
// 		backgroundColor: '#F00',
// 		position: 'relative',
// 		left: 15,
// 		top: 15,
// 		borderRadius: 10,
// 		width: 40,
// 		height: 40,
// 	},
// 	preview: {
// 		flex: 1,
// 		zIndex: 1,
// 		backgroundColor: 'black',
// 		position: 'absolute',
// 		left: 0,
// 		top: 0,
// 		right: 0,
// 		bottom: 0,
// 		justifyContent: 'flex-end',
// 		alignItems: 'center',
// 	},
// 	capture: {
// 		zIndex: 10,
// 		flex: 0,
// 		position: 'absolute',
// 		bottom: 10,
// 		borderColor: '#FFF',
// 		borderWidth: 5,
// 		borderRadius: 40,
// 		width: 80,
// 		height: 80,
// 		alignSelf: 'center',
// 		margin: 20,
// 	},
// 	captureInner: {
// 		position: 'relative',
// 		left: 5,
// 		top: 5,
// 		backgroundColor: '#fff',
// 		borderRadius: 35,
// 		width: 60,
// 		height: 60,
// 	},
// 	processingIconHolder: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		position: 'relative',
// 		left: 1.5,
// 		top: 1,
// 	},
// });
//
// export default CameraInput;
