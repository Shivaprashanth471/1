import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StatusBar, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Colors, ENV, ImageConfig, NavigateTo} from '../../constants';
import {useDispatch} from 'react-redux';
import {loginUser, logoutUser} from '../../store/actions/auth.action';
import SplashScreen from 'react-native-splash-screen';
import LottieView from 'lottie-react-native';

import {
	ApiFunctions,
	CommonFunctions,
	Communications,
	localStorage,
	ToastAlert,
} from '../../helpers';
import {updateHcpDetails} from '../../store/actions/hcpDetails.action';

const StartupScreen = (props: any) => {
	const dispatch = useDispatch();
	const {navigation} = props;
	const [isAnimationDone, setIsAnimationDone] = useState(false);
	const [goToState, setGoToState] = useState<any | null>(null);

	useEffect(() => {
		if (goToState && isAnimationDone) {
			if (goToState.part) {
				navigation.replace(goToState.main, goToState.part);
			} else {
				navigation.replace(goToState.main);
			}
		}
	}, [goToState, isAnimationDone, navigation]);

	useEffect(() => {
		const logoutSubjectSubscription = Communications.logoutSubject.subscribe(
			() => {
				// console.log('logoutSubjectSubscription');
				dispatch(logoutUser());
				setGoToState({
					main: NavigateTo.Auth,
					part: {screen: NavigateTo.Signin},
				});
			},
		);
		return () => {
			logoutSubjectSubscription.unsubscribe();
		};
	}, [dispatch]);
	const getProfileDetails = useCallback(
		(response: any) => {
			if (!response._id) {
				return;
			}
			console.log('response._id', response._id);

			ApiFunctions.get(ENV.apiUrl + 'hcp/user/' + response._id)
				.then(async resp => {
					if (resp) {
						if (resp.success) {
							if (resp.data != null) {
								if (resp.data.is_active) {
									dispatch(updateHcpDetails(resp.data));
									console.log('resp.data>>>>', resp.data);
									setGoToState({main: NavigateTo.Main});
								} else {
									dispatch(updateHcpDetails(resp.data));
									console.log('error');
									setGoToState({main: NavigateTo.Main});
								}
							} else {
								console.log('null here');
								ToastAlert.show('HCP data not found, please contact vitawerks');
							}
						}
					} else {
						console.log('error');
						ToastAlert.show('something went wrong');
					}
				})
				.catch((err: any) => {
					console.log('>>>>>>>>>>', err);
				});
		},
		[dispatch],
	);
	const checkLogin = useCallback(
		async (token: string) => {
			ToastAlert.show('Authenticating...!');
			console.log('checking login');
			console.log(token, 'this is token of startup');
			ApiFunctions.get(
				ENV.apiUrl + 'user/checkLogin',
				{},
				CommonFunctions.getAuthHeader(token),
			)
				.then(resp => {
					if (resp.success) {
						console.log('>>>>>', resp);

						dispatch(loginUser(resp.data.user, token));
						getProfileDetails(resp.data.user);

						// console.log('heere <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<:::::::::::::::')
						// setGoToState(NavigateTo.Main);
						// setGoToState(NavigateTo.Onboarding);
						// login
					} else {
						ToastAlert.show('Session expired!');
						Communications.logoutSubject.next();
					}
				})
				.catch(() => {
					ToastAlert.show('Invalid Session!');
					Communications.logoutSubject.next();
				});
		},
		[dispatch, getProfileDetails],
	);

	useEffect(() => {
		const getAuth = async (alreadyOpened = false) => {
			if (alreadyOpened) {
				setGoToState({
					main: NavigateTo.Auth,
					part: {screen: NavigateTo.Signin},
				});
			} else {
				setGoToState({
					main: NavigateTo.Auth,
					part: {screen: NavigateTo.Signin},
				});
			}
		};
		// const handleDeepLinks = (e: {url: string | null}) => {
		// 	console.log(e.url, 'deeplinks');
		// 	if (e.url) {
		// 		const url = e.url.split('#');
		// 		const action = url[0].split('jibsapp://').pop() || '';
		// 		const bits = action.split('/');
		// 		if (bits && bits.length >= 2) {
		// 			const task = bits.shift();
		// 			// console.log(task, bits);
		// 			switch (task) {
		// 				case 'oauth':
		// 					if (bits.length === 4) {
		// 						// const [mode, userId, token, hash] = bits;
		// 						const [token] = bits;
		// 						// console.log(mode, userId, token, hash);
		// 						checkLogin(token);
		// 					} else if (bits.length === 2) {
		// 						const [mode, state] = bits;
		// 						switch (state) {
		// 							case 'FAILED':
		// 							case 'SERVER_FAILED':
		// 								ToastAlert.show(mode + ' login failed');
		// 								break;
		// 							case 'NOT_ALLOWED':
		// 								ToastAlert.show(mode + ' login not allowed');
		// 								break;
		// 							case 'CANCEL':
		// 								ToastAlert.show('User canceled ' + mode + ' login');
		// 								break;
		// 							case 'REJECTED':
		// 								ToastAlert.show(mode + ' login rejected by server');
		// 								break;
		// 						}
		// 					}
		// 					break;
		// 				default:
		// 					break;
		// 			}
		// 		}
		// 	}
		// };
		// const getDeepLinks = async () => {
		// 	// Get the deep link used to open the app
		// 	const initialUrl = await Linking.getInitialURL();
		// 	Linking.addEventListener('url', handleDeepLinks);
		// 	handleDeepLinks({url: initialUrl});
		// };
		// getDeepLinks();
		const tryLogin = async () => {
			// await localStorage.clearAll();
			const userData = await localStorage.getItem('userData');
			const alreadyOpened = await localStorage.getItem('alreadyOpened');
			if (!userData) {
				await getAuth(!!alreadyOpened);
				return;
			}
			const transformedData = JSON.parse(userData);
			const {token, user} = transformedData;

			if (!token || !user) {
				await getAuth(!!alreadyOpened);
				return;
			}
			await checkLogin(token);
		};
		tryLogin();
	}, [checkLogin]);

	const dimensions = useWindowDimensions();
	const lottieRef = useRef<LottieView | null>(null);
	useEffect(() => {
		if (lottieRef && lottieRef.current) {
			SplashScreen.hide();
			console.log('Ready');
			lottieRef.current.play();
		}
	}, [lottieRef]);
	return (
		<View style={styles.screen}>
			<StatusBar translucent={true} backgroundColor={Colors.transparent} />
			{/*<ActivityIndicator size="large" color={Colors.primary} />*/}
			<LottieView
				source={ImageConfig.SplashScreen}
				// style={{width: dimensions.width, height: dimensions.height}}
				hardwareAccelerationAndroid={true}
				onAnimationFinish={() => {
					setIsAnimationDone(true);
				}}
				style={{
					width: dimensions.width + 5,
					height: dimensions.height + 5,
					// marginLeft: -5,
				}}
				ref={lottieRef}
				// autoSize={true}
				resizeMode="cover"
				renderMode={'AUTOMATIC'}
				loop={false}
				speed={1}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#FFF',
	},
});

export default StartupScreen;
