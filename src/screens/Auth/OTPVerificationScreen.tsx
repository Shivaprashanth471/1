import React, {useCallback, useEffect, useState} from 'react';
import {
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	StatusBar,
} from 'react-native';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import {
	ApiFunctions,
	CommonFunctions,
	CommonStyles,
	ToastAlert,
} from '../../helpers';
import {
	BaseViewComponent,
	CustomButton,
	KeyboardAvoidCommonView,
} from '../../components/core';
// import Logo from '../../assets/images/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
// import {KeyboardAvoidCommonView} from '../../components';
// import analytics from '@segment/analytics-react-native';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {checkLogin, logoutUser} from '../../store/actions/auth.action';
import {logoutSubject} from '../../helpers/Communications';
import SmsRetriever from 'react-native-sms-retriever';

const CELL_COUNT = 4;
const EmailVerificationScreen = (props: any) => {
	const dispatch = useDispatch();
	const isComponent = props.isComponent !== undefined;
	const onNext = props.onNext || false;
	const {auth} = useSelector((state: StateParams) => state);
	// const {meta} = extras;
	const {user} = auth;
	const navigation = props.navigation;
	const [isLoading, setIsLoading]: any = useState(false);
	const [isResendLoading, setIsResendLoading]: any = useState(false);
	// const [isIntroLoaded, setIsIntroLoaded]: any = useState(false);
	// const [showIntro, setShowIntro]: any = useState(false);

	const [otpValue, setOtpValue] = useState('');
	const ref = useBlurOnFulfill({value: otpValue, cellCount: CELL_COUNT});
	const [otpProps, getCellOnLayoutHandler] = useClearByFocusCell({
		value: otpValue,
		setValue: setOtpValue,
	});

	const [phoneNo, setPhoneNo] = useState();

	//   useEffect(() => {
	//     analytics.screen('Verification Opened');
	//     return () => {
	//       analytics.screen('Verification Exit');
	//     };
	//   }, []);

	const getLogout = () => {
		// analytics.track('Logout');
		// analytics.reset();
		dispatch(logoutUser());
		logoutSubject.next();
	};

	const getHome = useCallback(() => {
		// navigation.replace(NavigateTo.Main, {screen: NavigateTo.Home});
		navigation.reset({
			index: 0,
			routes: [{name: NavigateTo.Main}],
		});
	}, [navigation]);
	// const getOnBoarding = () => {
	//   console.log('opening onboarding');
	//   navigation.navigate(NavigateTo.Onboarding);
	// };

	const getVerificationEmail = useCallback(() => {
		if (!user || (user && user.is_phone_verified)) {
			// if (isComponent && onClose) {
			//   // @ts-ignore
			//   onClose();
			// } else {
			//   getHome();
			// }
			// const payload = {phone: user.phone};
			console.log(user);
			return;
		}
		const payload = {phone: user.phone};
		console.log(payload);

		setIsResendLoading(true);
		const encryptPhone = user.phone.replace(/.(?=.{4})/g, 'x');
		setPhoneNo(encryptPhone);
		// console.log(payload);
		ApiFunctions.post(ENV.apiUrl + 'resendVerification', payload)
			.then(async resp => {
				// console.log(resp);
				setIsResendLoading(false);
				if (resp.success) {
					ToastAlert.show(resp.msg || '');
				} else {
					ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				setIsResendLoading(false);
				console.log(err.errors);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [user]);

	const confirmVerification = useCallback(
		(otp = otpValue) => {
			setIsLoading(true);
			const payload = {user_id: user._id, code: otp};
			// console.log(payload);
			ApiFunctions.post(ENV.apiUrl + 'verifyStudent', payload)
				.then(async resp => {
					setIsLoading(false);
					console.log(resp);
					if (resp.success) {
						// if (meta?.intro_video_url) {
						//   setShowIntro(true);
						//   getHome();
						// } else {
						//   getHome();
						// }
						dispatch(checkLogin());
						// console.log(isComponent, onNext, 'isComponent, onNext');
						if (isComponent && onNext) {
							// @ts-ignore
							onNext('');
						} else {
							getHome();
						}
						ToastAlert.show(resp.msg || '');
					} else {
						ToastAlert.show(resp.error || '');
					}
				})
				.catch((err: any) => {
					setIsLoading(false);
					console.log(err.errors);
					ToastAlert.show(err.error || 'Oops... Something went wrong!');
				});
		},
		[dispatch, getHome, otpValue, user],
	);

	const startSMSReader = useCallback(async () => {
		try {
			SmsRetriever.removeSmsListener();
			const registered = await SmsRetriever.startSmsRetriever();
			if (registered) {
				SmsRetriever.addSmsListener(event => {
					if (event && event.message) {
						// @ts-ignore
						const otp = /(\d{6})/g.exec(event.message)[1];
						// console.log(otp);
						// setOtpValue(otp);
						if (otp && otp.length === 6) {
							setOtpValue(otp);
							confirmVerification(otp);
						}
					}

					SmsRetriever.removeSmsListener();
				});
			}
		} catch (error) {
			console.log(error);
		}
	}, [confirmVerification]);
	useEffect(() => {
		if (CommonFunctions.isAndroid()) {
			startSMSReader();
		}
		return () => {
			if (CommonFunctions.isAndroid()) {
				SmsRetriever.removeSmsListener();
			}
		};
	}, [startSMSReader]);

	useEffect(() => {
		// getVerificationEmail();
	}, [getVerificationEmail]);
	return (
		<>
			<KeyboardAvoidCommonView>
				<BaseViewComponent noScroll={true}>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View
						style={{
							flexDirection: 'row',
							flex: 0,
							justifyContent: 'space-between',
							alignItems: 'center',
							marginTop: 10,
							marginHorizontal: 20,
							// backgroundColor: 'green',
						}}>
						<View style={styles.header}>
							<View style={{}}>
								<Text style={styles.headerText}>We have sent you an OTP</Text>
							</View>
							<View style={styles.subHeadingHolder}>
								<Text style={styles.subHeading}>
									enter the 4 digit OTP to Proceed - {phoneNo}
								</Text>
							</View>
							<CodeField
								ref={ref}
								{...otpProps}
								// Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
								value={otpValue}
								onChangeText={setOtpValue}
								cellCount={CELL_COUNT}
								rootStyle={styles.codeFieldRoot}
								keyboardType="number-pad"
								textContentType="oneTimeCode"
								renderCell={({index, symbol, isFocused}) => (
									<Text
										key={index}
										style={[styles.cell, isFocused && styles.focusCell]}
										onLayout={getCellOnLayoutHandler(index)}>
										{symbol || (isFocused ? <Cursor /> : null)}
									</Text>
								)}
							/>
						</View>
					</View>
					<View style={{flex: 1, marginHorizontal: 20, width: '40%'}}>
						<Text
							style={{
								marginBottom: 10,
								fontFamily: FontConfig.primary.regular,
								fontSize: 16,
								color: Colors.textLight,
							}}>
							didn't receive OTP?
						</Text>
						{/* <CustomButton
							title={'Resend OTP'}
							isLoading={isLoading}
							
							type={'outline'}
							textStyle={{
								color: Colors.textDark,
								fontFamily: FontConfig.primary.bold,
								fontSize: 18,
							}}
							style={{
								flex: 0,
								borderColor: '#9FE7ED',
								borderRadius: 8,
								backgroundColor: Colors.backgroundColor,
							}} */}
						{/* /> */}
						<CustomButton
							// onPress={confirmVerification}
							style={{
								flex: 0,
								borderRadius: 8,
								marginVertical: 0,
								height: 40,
								backgroundColor: Colors.backgroundShiftColor,
							}}
							title={'Resend OTP'}
							class={'secondary'}
							textStyle={{
								color: Colors.textDark,
								fontFamily: FontConfig.primary.bold,
								fontSize: 18,
								textTransform: 'none',
							}}
						/>
					</View>
					<View
						style={{
							flex: 1,
							marginHorizontal: 20,
						}}>
						<CustomButton
							title={'Proceed'}
							disabled={otpValue.length < 4}
							isLoading={isLoading}
							// onPress={confirmVerification}
							onPress={getHome}
							style={styles.button}
						/>
					</View>
				</BaseViewComponent>
			</KeyboardAvoidCommonView>
		</>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f7fffd',
		alignItems: 'center',
	},
	header: {
		flex: 0,
		marginVertical: 20,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '70%',
	},
	headerText: {
		textAlign: 'left',
		fontSize: 26,
		fontFamily: FontConfig.primary.bold,
		// fontFamily: 'NunitoSans-Bold',
		color: Colors.textDark,
	},
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'left',
		fontSize: 16,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
	formHolder: {width: '80%', marginHorizontal: '5%'},
	logo: {},
	accentBtn: {
		borderColor: Colors.accent,
		borderWidth: 1,
		paddingHorizontal: 20,
		// paddingVertical: 5,
		height: 34,
		// width: 80,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
	},
	accentBtnText: {
		fontSize: 17,
		fontFamily: FontConfig.primary.semiBold,
		color: Colors.accent,
	},

	headerName: {
		textAlign: 'center',
		// marginVertical: 4,
		marginVertical: 20,
		color: Colors.textDark,
		fontSize: 28,
		fontFamily: FontConfig.primary.regular,
	},
	forgotPasswordHolder: {
		marginTop: 10,
		marginBottom: 20,
		marginLeft: 'auto',
	},
	forgotPasswordText: {
		fontFamily: FontConfig.secondary.regular,
		fontSize: 16,
		color: Colors.accent,
	},
	conditionText: {
		fontSize: 22,
		textAlign: 'center',
		marginTop: 10,
		color: Colors.textLight,
		fontFamily: FontConfig.primary.semiBoldItalic,
	},

	root: {flex: 1, padding: 20},
	title: {textAlign: 'center', fontSize: 32},
	codeFieldRoot: {
		marginTop: 20,
	},
	cell: {
		width: 40,
		backgroundColor: Colors.backgroundColor,
		height: 40,
		lineHeight: CommonFunctions.isIOS() ? 38 : 42,
		alignItems: 'center',
		marginHorizontal: 5,
		fontSize: 22,
		fontFamily: FontConfig.primary.regular,
		borderWidth: 1,
		borderRadius: 4,
		overflow: 'hidden',
		borderColor: Colors.textLight,
		textAlign: 'center',
	},
	focusCell: {
		borderColor: Colors.textDark,
	},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
		borderRadius: 8,
	},
});

export default EmailVerificationScreen;
