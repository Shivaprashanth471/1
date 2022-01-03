import React, {useState} from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {BaseViewComponent, CustomButton} from '../../components/core';
import KeyboardAvoidCommonView from '../../components/core/KeyboardAvoidCommonView';
import {useDispatch} from 'react-redux';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../helpers';
import {loginUser} from '../../store/actions/auth.action';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import FormikInputComponent from '../../components/core/FormikInputComponent';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';

// Login api
const ForgotPasswordSchema = yup.object().shape({
	password: yup
		.string()
		.required('Required')
		.min(6, 'Invalid')
		.max(16, 'Invalid'),
	confirm: yup
		.string()
		.required('Required')
		.min(6, 'Invalid')
		.max(16, 'Invalid')
		.oneOf([yup.ref('password'), null], "Confirmation Doesn't match"),
	code: yup.string().required('Required').min(4, 'Invalid').max(4, 'Invalid'),
});

export interface ForgotPasswordSchema {
	password: string;
	confirm?: string;
	email: string;
	code: string;
}

const initialValues: ForgotPasswordSchema = {
	password: '',
	confirm: '',
	email: '',
	code: '',
};

export interface ForgotPasswordAPIResponse {
	user: {name: string; role: string};
	token: string;
}

// end login api

const ForgotPasswordScreen = (props: any) => {
	const {email}: any = props.route.params;
	const [eyePasswordIcon, setPasswordEyeIcon] = useState(false);
	const [eyeNewPasswordIcon, setNewPasswordEyeIcon] = useState(false);
	const [isPassword, setIsPassword] = useState(true);
	const [isNewPassword, setNewIsPassword] = useState(true);
	const navigation = props.navigation;

	const VisibilityPassword = () => {
		setPasswordEyeIcon(isPassword ? true : false);
		setIsPassword(prevState => !prevState);
	};
	const VisibilityNewPassword = () => {
		setNewPasswordEyeIcon(isNewPassword ? true : false);
		setNewIsPassword(prevState => !prevState);
	};

	const forgotPasswordHandler = (
		values: ForgotPasswordSchema,
		formikHelpers: FormikHelpers<ForgotPasswordSchema>,
	) => {
		formikHelpers.setSubmitting(true);
		delete values.confirm;
		values.email = email.email;
		const payload = {...values};
		ApiFunctions.post(ENV.apiUrl + 'resetPassword', payload)
			.then(async resp => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					ToastAlert.show(resp.msg || 'password reset successful');
					navigation.replace(NavigateTo.Auth, {screen: NavigateTo.Signin});
				} else {
					ToastAlert.show(resp.error || 'Wrong OTP entered');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
			});
	};

	const [resendOtpLoader, setResendOtpLoader] = useState(false);
	const resendOTP = () => {
		setResendOtpLoader(true);
		const payload = email;
		ApiFunctions.post(ENV.apiUrl + 'forgotPassword', payload)
			.then(resp => {
				if (resp.success) {
					ToastAlert.show(
						resp.msg ||
							'password reset code has been sent to your registered mobile and email',
					);
				} else {
					ToastAlert.show(resp.error || '');
				}
				setResendOtpLoader(false);
			})
			.catch((err: any) => {
				ToastAlert.show('Please enter correct email');
				setResendOtpLoader(false);
			});
	};

	return (
		<KeyboardAvoidCommonView>
			<BaseViewComponent>
				<StatusBar
					barStyle={'light-content'}
					animated={true}
					backgroundColor={Colors.backdropColor}
				/>
				<View style={styles.wrapper}>
					<View style={styles.header}>
						<TouchableOpacity
							onPress={() => {
								navigation.goBack();
							}}>
							<ImageConfig.backArrow
								width="20"
								height="20"
								style={{marginBottom: 10}}
							/>
						</TouchableOpacity>
						<View style={{}}>
							<Text style={styles.headerText}>We have sent you an OTP</Text>
						</View>
					</View>
				</View>
				<View style={styles.subHeadingHolder}>
					<Text style={styles.subHeading}>
						Enter the 4 digit OTP to proceed
					</Text>
				</View>
				<View style={styles.formBlock}>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={forgotPasswordHandler}
							validationSchema={ForgotPasswordSchema}
							validateOnBlur={true}
							initialValues={initialValues}>
							{({handleSubmit, isValid, isSubmitting}) => (
								<>
									<View>
										<Field name={'code'}>
											{(field: FieldProps) => (
												<View style={styles.rowElements}>
													<FormikInputComponent
														trimSpecialCharacters={true}
														trimLeft={true}
														trimSpaces={true}
														inputProperties={{
															maxLength: 4,
															placeholder: 'OTP',
															keyboardType: 'number-pad',
														}}
														inputStyles={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 16,
														}}
														formikField={field}
														style={{
															marginTop: 5,
														}}
													/>
												</View>
											)}
										</Field>
										<View style={{marginVertical: 10}}>
											<View>
												<Text
													style={{
														fontFamily: FontConfig.primary.regular,
														fontSize: 14,
														color: Colors.textLight,
													}}>
													Didn't receive OTP?
												</Text>
											</View>
											<View
												style={{
													width: 150,
													marginTop: 15,
												}}>
												<CustomButton
													onPress={resendOTP}
													style={{
														flex: 0,
														borderColor: Colors.primary,
														borderRadius: 8,
														height: 40,
														alignItems: 'center',
													}}
													title={'Resend OTP'}
													type={'outline'}
													textStyle={{
														color: Colors.primary,
														fontSize: 14,
														fontFamily: FontConfig.primary.bold,
													}}
													// disabled={true}
													isLoading={resendOtpLoader}
												/>
											</View>
										</View>
										<View
											style={{
												marginTop: 25,
												marginBottom: 10,
											}}>
											<Text
												style={{
													fontFamily: FontConfig.primary.regular,
													fontSize: 14,
													color: Colors.textLight,
												}}>
												Create new password
											</Text>
										</View>
										<Field name={'password'}>
											{(field: FieldProps) => (
												<View style={styles.rowElements}>
													<FormikInputComponent
														trimSpaces={true}
														labelText="New Password"
														inputProperties={{
															maxLength: 20,
															secureTextEntry: isPassword,
															placeholder: 'New Password',
														}}
														inputStyles={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 16,
														}}
														formikField={field}
														style={{
															backgroundColor: Colors.backgroundShiftColor,
															marginTop: 5,
														}}
													/>
													<TouchableOpacity
														style={{
															position: 'absolute',
															bottom: 20,
															right: 10,
														}}
														onPress={VisibilityPassword}>
														{isPassword ? (
															<>
																<ImageConfig.EyeIcon
																	color={'red'}
																	style={{
																		borderRadius: 100,
																		marginRight: 10,
																	}}
																	height={'25'}
																	width={'25'}
																/>
															</>
														) : (
															<>
																<ImageConfig.IconEyeOpen
																	color={'red'}
																	style={{
																		borderRadius: 100,
																		marginRight: 10,
																	}}
																	height={'25'}
																	width={'25'}
																/>
															</>
														)}
													</TouchableOpacity>
												</View>
											)}
										</Field>
										<Field name={'confirm'}>
											{(field: FieldProps) => (
												<View style={styles.rowElements}>
													<FormikInputComponent
														trimSpaces={true}
														labelText="Confirm Password"
														inputProperties={{
															maxLength: 20,
															secureTextEntry: isNewPassword,
															placeholder: 'Confirm Password',
														}}
														inputStyles={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 16,
														}}
														formikField={field}
														style={{
															backgroundColor: Colors.backgroundShiftColor,
															marginTop: 5,
														}}
													/>
													<TouchableOpacity
														style={{
															position: 'absolute',
															bottom: 20,
															right: 10,
														}}
														onPress={VisibilityNewPassword}>
														{isNewPassword ? (
															<>
																<ImageConfig.EyeIcon
																	color={'red'}
																	style={{
																		borderRadius: 100,
																		marginRight: 10,
																	}}
																	height={'25'}
																	width={'25'}
																/>
															</>
														) : (
															<>
																<ImageConfig.IconEyeOpen
																	color={'red'}
																	style={{
																		borderRadius: 100,
																		marginRight: 10,
																	}}
																	height={'25'}
																	width={'25'}
																/>
															</>
														)}
													</TouchableOpacity>
												</View>
											)}
										</Field>
									</View>
									<View
										style={{
											marginTop: 20,
										}}>
										<View>
											<CustomButton
												style={{
													flex: 0,
													backgroundColor: Colors.primary,
													borderRadius: 8,
													marginVertical: 0,
												}}
												title={'Update Password'}
												isLoading={isSubmitting}
												onPress={handleSubmit}
												disabled={!isValid}
												textStyle={{
													fontSize: 14,
													fontFamily: FontConfig.primary.bold,
												}}
											/>
										</View>
									</View>
								</>
							)}
						</Formik>
					</View>
				</View>
			</BaseViewComponent>
		</KeyboardAvoidCommonView>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 20,
	},
	formHolder: {
		marginHorizontal: 20,
	},
	logo: {
		flex: 1,
		justifyContent: 'center',
		marginTop: 20,
		alignItems: 'center',
	},
	formBlock: {
		alignItems: 'center',
		marginVertical: 25,
	},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
	subHeadingHolder: {marginTop: 10, marginHorizontal: 20},
	subHeading: {
		textAlign: 'left',
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
	header: {
		flex: 0,
		marginTop: 40,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '80%',
	},
	headerText: {
		// textAlign: 'center',
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
		// fontFamily: 'NunitoSans-Bold',
		color: Colors.textDark,
	},
	rowElements: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	forgotPasswordHolder: {
		flex: 1,
		alignItems: 'flex-end',
		marginTop: 5,
	},
	forgotPasswordText: {
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textDark,
	},

	// otp

	codeFieldRoot: {
		marginTop: 20,
	},
	cell: {
		width: 40,
		backgroundColor: Colors.backgroundColor,
		height: 40,
		lineHeight: CommonFunctions.isIOS() ? 38 : 42,
		alignItems: 'center',
		marginHorizontal: 20,
		fontSize: 20,
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
});

export default ForgotPasswordScreen;
