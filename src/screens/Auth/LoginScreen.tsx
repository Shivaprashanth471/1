import React, {useState, useCallback, useEffect} from 'react';
import {
	Modal,
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
import {updateHcpDetails} from '../../store/actions/hcpDetails.action';
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
import {CONTACTUS_PHONE_NUMBER} from '../../helpers/CommonFunctions';
import analytics from '@segment/analytics-react-native';

// Login api
const loginSchema = yup.object().shape({
	email: yup.string().required('Required').email('Invalid Email'),
	password: yup.string().required('Required').min(5, 'Invalid'),
});

export interface LoginSchemaType {
	email: string;
	password: string;
}

const initialValues: LoginSchemaType = {
	email: '',
	password: '',
};

export interface LoginAPIResponse {
	user: {
		first_name: string;
		last_name: string;
		email: string;
		is_active: boolean;
		_id: any;
	};
	token: string;
}

// end login api

const LoginScreen = (props: any) => {
	useEffect(() => {
		analytics.screen('Login Opened');
		return () => {
			analytics.screen('Login Exit');
		};
	}, []);
	const [isPassword, setIsPassword] = useState(true);
	const dispatch = useDispatch();
	const [modalVisible, setModalVisible] = useState(false);
	const [phone, setPhone] = useState(CONTACTUS_PHONE_NUMBER);
	const navigation = props.navigation;
	const getForgotPassword = () => {
		navigation.navigate(NavigateTo.ForgotPassword_Email_Screen);
	};

	const onCall = () => {
		setModalVisible(!modalVisible);
		CommonFunctions.openCall(phone);
	};
	const onSMS = () => {
		setModalVisible(!modalVisible);
		CommonFunctions.openSMS(phone, '');
	};

	const loginHandler = (
		values: LoginSchemaType,
		formikHelpers: FormikHelpers<LoginSchemaType>,
	) => {
		const payload = {...values};
		console.log(values);
		formikHelpers.setSubmitting(true);
		ApiFunctions.post(ENV.apiUrl + 'user/login', payload)
			.then(async (resp: TSAPIResponseType<LoginAPIResponse>) => {
				if (resp.success) {
					console.log('resp.data>>>>>>>>>', resp.data);
					const user = resp.data.user;
					await dispatch(loginUser(user, resp.data.token));
					await analytics.track('Login Success', {email: payload.email});
					getProfileDetails(user, formikHelpers);

					// if (resp.data.user.is_active) {
					// navigation.replace(NavigateTo.Main);
					// } else {
					// navigation.replace(NavigateTo.AuthPhoneScreen);
					// navigation.replace(NavigateTo.Main);
					// }
				} else {
					console.log('resp.error', resp.error);

					ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
				analytics.track('Login Failed', {email: payload.email});
				console.log('err>>>>>>', err.errors.email[0]);
				ToastAlert.show(err.errors.email[0] || '');
			});
	};
	const getProfileDetails = useCallback(
		(response: any, formikHelpers: FormikHelpers<LoginSchemaType>) => {
			if (!response._id) {
				return;
			}

			ApiFunctions.get(ENV.apiUrl + 'hcp/user/' + response._id)
				.then((resp: any) => {
					formikHelpers.setSubmitting(false);
					if (resp && resp.success) {
						if (resp.data != null) {
							dispatch(updateHcpDetails(resp.data));
							ToastAlert.show('Login Successful!');
							analytics.identify(resp.data._id, {
								firstName: resp.data.first_name,
								lastName: resp.data.last_name,
								email: resp.data.email,
								hcpType: resp.data.hcp_type,
								region: resp.data.address.region,
							});
							navigation.replace(NavigateTo.Main);
						} else {
							console.log('null here');
							ToastAlert.show('HCP data not found, please contact vitawerks');
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

	return (
		<KeyboardAvoidCommonView>
			<BaseViewComponent>
				<StatusBar
					barStyle={'light-content'}
					animated={true}
					backgroundColor={Colors.backdropColor}
				/>

				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						// Alert.alert('Modal has been closed.');
						setModalVisible(!modalVisible);
					}}>
					<View style={styles.ModalCenteredView}>
						<View style={styles.modalView}>
							<View
								style={{
									// backgroundColor: 'red',
									width: '100%',
									alignItems: 'flex-end',
									// marginHorizontal: 20,
									paddingHorizontal: 20,
									paddingTop: 10,
								}}>
								<TouchableOpacity
									onPress={() => {
										setModalVisible(!modalVisible);
									}}>
									<ImageConfig.CloseIconModal height={'25'} width={'25'} />
								</TouchableOpacity>
							</View>
							<View
								style={{
									padding: 10,
								}}>
								<Text style={styles.modalText}>
									Choose an option to contact
								</Text>
								<View
									style={{
										backgroundColor: 'white',
										paddingVertical: 20,
									}}>
									<View
										style={{
											flexDirection: 'row',
											marginHorizontal: 10,
										}}>
										<View
											style={{
												width: '45%',
												marginRight: '10%',
											}}>
											<CustomButton
												// onPress={() => setModalVisible(!modalVisible)}
												onPress={onCall}
												style={{
													flex: 0,
													borderRadius: 8,
													marginVertical: 0,
													height: 40,
													backgroundColor: Colors.backgroundShiftColor,
												}}
												title={'Call'}
												class={'secondary'}
												textStyle={{color: Colors.primary}}
												ImageConfigCall={true}
											/>
										</View>
										<View
											style={{
												width: '45%',
											}}>
											<CustomButton
												// onPress={() => setModalVisible(!modalVisible)}
												onPress={onSMS}
												style={{
													flex: 0,
													borderRadius: 8,
													marginVertical: 0,
													height: 40,
													backgroundColor: Colors.backgroundShiftColor,
												}}
												title={'SMS'}
												class={'secondary'}
												textStyle={{color: Colors.primary}}
												ImageConfigSMS={true}
											/>
										</View>
									</View>
								</View>
							</View>
						</View>
					</View>
				</Modal>

				<View
					style={{
						// flexDirection: 'row',
						flex: 0,
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '15%',
						marginHorizontal: 20,
						// backgroundColor: 'green',
					}}>
					<ImageConfig.Logo width={120} />
					<View style={styles.header}>
						<View style={{}}>
							<Text style={styles.headerText}>Login</Text>
						</View>
						{/*<View style={styles.subHeadingHolder}>*/}
						{/*	<Text style={styles.subHeading}>*/}
						{/*		Lorem Ipsum dolor sit amet, consectetur adipiscing elit,*/}
						{/*	</Text>*/}
						{/*</View>*/}
					</View>
				</View>
				<View style={styles.formBlock}>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={loginHandler}
							validationSchema={loginSchema}
							validateOnBlur={true}
							initialValues={initialValues}>
							{({handleSubmit, isValid, isSubmitting}) => (
								<>
									<Field name={'email'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												// trimCharacters={true}
												trimSpaces={true}
												// trimSpecialCharacters={true}
												labelText="Email"
												inputProperties={{
													keyboardType: 'default',
													// maxLength: 30,
													placeholder: 'Email address',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<View>
										<Field name={'password'}>
											{(field: FieldProps) => (
												<View style={styles.rowElements}>
													<FormikInputComponent
														labelText="Password"
														trimSpaces={true}
														inputProperties={{
															// maxLength: 20,
															secureTextEntry: isPassword,
															placeholder: 'Enter Password',
														}}
														formikField={field}
													/>
													<TouchableOpacity
														style={{
															position: 'absolute',
															bottom: 20,
															right: 10,
														}}
														onPress={() => {
															setIsPassword(prevState => !prevState);
														}}>
														{/* <Text
															style={{
																backgroundColor: Colors.primary,
																borderRadius: 10,
																paddingHorizontal: 10,
																paddingVertical: 3,
																fontFamily: FontConfig.primary.regular,
																fontSize: 13,
																color: Colors.textOnPrimary,
															}}>
															{isPassword ? 'Show' : 'Hide'}
														</Text> */}
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
									</View>

									<TouchableOpacity
										onPress={getForgotPassword}
										style={styles.forgotPasswordHolder}>
										<Text style={styles.forgotPasswordText}>
											Forgot Password?
										</Text>
									</TouchableOpacity>

									<CustomButton
										isLoading={isSubmitting}
										title={'Login'}
										onPress={handleSubmit}
										style={styles.button}
										disabled={!isValid}
									/>
								</>
							)}
						</Formik>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Text
						style={{
							fontFamily: FontConfig.primary.regular,
							color: Colors.textLight,
							alignItems: 'center',
							fontSize: 14,
						}}>
						Need Help?{' '}
					</Text>
					<TouchableOpacity onPress={() => setModalVisible(true)}>
						<Text
							style={{
								fontFamily: FontConfig.primary.semiBold,
								color: Colors.primary,
								fontSize: 14,
								alignSelf: 'center',
								justifyContent: 'center',
								lineHeight: 20,
							}}>
							Get In Touch
						</Text>
					</TouchableOpacity>
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
		// alignItems: "center",
		marginTop: 30,
		marginHorizontal: 20,
	},
	formHolder: {
		width: '85%',
		marginHorizontal: '5%',
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
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'left',
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
	header: {
		flex: 0,
		marginVertical: 20,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '70%',
	},
	headerText: {
		textAlign: 'center',
		fontSize: 28,
		fontFamily: FontConfig.primary.bold,
		// fontFamily: 'NunitoSans-Bold',
		color: Colors.textDark,
	},
	rowElements: {
		flexDirection: 'row',
		alignItems: 'center',
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
	ModalCenteredView: {
		flex: 1,
		justifyContent: 'center',
		// alignItems: 'center',
		// marginTop: 22,
		backgroundColor: '#000000A0',
	},
	modalView: {
		// margin: 20,
		marginHorizontal: 10,
		backgroundColor: 'white',
		borderRadius: 20,

		// alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		// position: 'absolute',
		// bottom: 80,
	},
	modalText: {
		marginBottom: 15,
		// fontSize: 20,
		textAlign: 'center',
		fontFamily: FontConfig.primary.semiBold,
	},
});

export default LoginScreen;
