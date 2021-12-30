import React, {useState, useCallback, useEffect, useReducer} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
	ImageBackground,
	Image,
	Modal,
	Platform,
	Linking,
	Alert,
} from 'react-native';
import {
	CommonStyles,
	CommonFunctions,
	ApiFunctions,
	ToastAlert,
} from '../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import {
	BaseViewComponent,
	CustomButton,
	ToggleSwitchComponent,
	TextWIthCheckIconComponent,
	FormikInputComponent,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import {StateParams} from '../../store/reducers';
import {useDispatch, useSelector} from 'react-redux';

const loginSchema = yup.object().shape({
	phone: yup
		.string()
		.required('Required')
		.min(10, 'Invalid')
		.max(13, 'Invalid'),
	password: yup
		.string()
		.required('Required')
		.min(6, 'Invalid')
		.max(16, 'Invalid'),
	name: yup.string().required('Required').min(3, 'Invalid'),
	email: yup.string().required('Required').email('Invalid Email'),
});

export interface LoginSchemaType {
	phone: string;
	// password: string;
	name: string;
	email: string;
}

const initialValues: LoginSchemaType = {
	phone: '',
	// password: '',
	name: '',
	email: '',
};

export interface LoginAPIResponse {
	user: {name: string; role: string};
	token: string;
}

const ProfileEditScreen = (props: any) => {
	const [eyeIcon, setEyeIcon] = useState(false);
	const [isPassword, setIsPassword] = useState(true);
	const [isLoading, setIsLoading]: any = useState(true);
	const [profile, setProfile]: any = useState();
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;

	const gotoLogin = () => {
		// navigation.replace(NavigateTo.Auth);
	};
	const gotoChangePassword = () => {
		navigation.replace(NavigateTo.ProfileChangePasswordScreen);
	};
	const VisibilityPassword = () => {
		setEyeIcon(isPassword ? true : false);
		setIsPassword(prevState => !prevState);
	};

	const getProfileDetails = useCallback(() => {
		setIsLoading(true);
		// ApiFunctions.get(ENV.apiUrl + 'hcp/dbbed788-07fa-48b0-975c-0ce9e2990b7b')
		ApiFunctions.get(ENV.apiUrl + 'hcp/user/' + user._id)
			.then(async resp => {
				if (resp) {
					setProfile(resp.data);
					// Intercom.updateUser(resp.data);
				} else {
					Alert.alert('Error');
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, []);
	useEffect(() => {
		console.log('loading get profile');
		getProfileDetails();
	}, [getProfileDetails]);

	const loginHandler = (
		values: LoginSchemaType,
		formikHelpers: FormikHelpers<LoginSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(values);
		// ApiFunctions.post(ENV.apiUrl + 'account/login', payload)
		// 	.then(async (resp: TSAPIResponseType<LoginAPIResponse>) => {
		// 		formikHelpers.setSubmitting(false);
		// 		if (resp.success) {
		// 			ToastAlert.show(resp.msg || 'Login Successful!');
		// 			// await dispatch(loginUser(resp.data.user, resp.data.token));
		// 			navigation.replace(NavigateTo.Main);
		// 		} else {
		// 			ToastAlert.show(resp.error || '');
		// 		}
		// 	})
		// 	.catch((err: any) => {
		// 		formikHelpers.setSubmitting(false);
		// 		CommonFunctions.handleErrors(err, formikHelpers.setErrors);
		// 	});
	};
	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !profile && <ErrorComponent />}
			{!isLoading && isLoaded && profile && (
				<BaseViewComponent
					contentContainerStyle={{
						flexGrow: 1,
						paddingBottom: 20,
						// backgroundColor: 'red',
					}}
					noScroll={true}
					backgroundColor={Colors.backdropColor}>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backgroundColor}
					/>
					<View style={styles.screen}>
						<View style={styles.contentBoxContainer}>
							<View style={styles.avatarStyle}>
								<Image
									resizeMethod={'auto'}
									resizeMode={'contain'}
									source={ImageConfig.placeholder}
									style={{
										height: 120,
										width: 120,
										borderRadius: 500,
									}}
								/>
							</View>
							<Text style={styles.profileTitleText}>Profile Picture</Text>
						</View>
						<View style={styles.formBlock}>
							<View style={styles.formHolder}>
								<Formik
									onSubmit={loginHandler}
									validationSchema={loginSchema}
									validateOnBlur={true}
									initialValues={{
										...initialValues,
										...{
											phone: profile.contact_number,
											// password: '',
											name: profile.first_name + ' ' + profile.last_name,
											email: profile.email,
										},
									}}>
									{({handleSubmit, isValid, isSubmitting}) => (
										<>
											<Field name={'name'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														trimSpecialCharacters={true}
														labelText="Name"
														inputStyles={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 16,
															color: Colors.textOnInput,
														}}
														inputProperties={{
															keyboardType: 'default',
															maxLength: 30,
															// placeholder: 'John Doe',
															editable: false,
														}}
														formikField={field}
														style={{
															backgroundColor: Colors.backgroundShiftColor,
															marginTop: 5,
														}}
													/>
												)}
											</Field>
											<Field name={'phone'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														trimSpecialCharacters={true}
														labelText="Mobile Number"
														inputStyles={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 16,
															color: Colors.textOnInput,
														}}
														inputProperties={{
															keyboardType: 'number-pad',
															maxLength: 13,
															// placeholder: 'John Doe',
															editable: false,
														}}
														formikField={field}
														style={{
															backgroundColor: Colors.backgroundShiftColor,
															marginTop: 5,
														}}
													/>
												)}
											</Field>
											<Field name={'email'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														trimSpecialCharacters={true}
														labelText="Email"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'Enter your email address',
															editable: false,
														}}
														inputStyles={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 16,
															color: Colors.textOnInput,
														}}
														formikField={field}
														style={{
															backgroundColor: Colors.backgroundShiftColor,
															marginTop: 5,
														}}
													/>
												)}
											</Field>
											{/* <View>
												<Field name={'password'}>
													{(field: FieldProps) => (
														<View style={styles.rowElements}>
															<FormikInputComponent
																labelText="Password"
																inputProperties={{
																	maxLength: 20,
																	secureTextEntry: isPassword,
																	placeholder: 'Enter Password',
																}}
																inputStyles={{
																	fontFamily: FontConfig.primary.semiBold,
																	fontSize: 16,
																	color: Colors.textOnInput,
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
																	bottom: 15,
																	right: 10,
																}}
																onPress={VisibilityPassword}>
																<ImageConfig.EyeIcon
																	color={'red'}
																	style={{
																		borderRadius: 100,
																		marginRight: 10,
																	}}
																	height={'25'}
																	width={'25'}
																/>
															</TouchableOpacity>
														</View>
													)}
												</Field>
											</View> */}
											<TouchableOpacity
											// onPress={gotoChangePassword}
											>
												<Text
													style={{
														fontFamily: FontConfig.primary.semiBold,
														fontSize: 14,
														color: Colors.textOnPrimary,
														marginTop: 5,
													}}>
													Change Password
												</Text>
											</TouchableOpacity>
											<View
												style={{
													flexDirection: 'row',
													marginTop: 20,
												}}>
												<View
													style={{
														width: '45%',
														marginRight: '10%',
													}}>
													<CustomButton
														onPress={() => navigation.goBack()}
														style={{
															flex: 0,
															borderRadius: 8,
															marginVertical: 0,
															height: 40,
															backgroundColor: Colors.backgroundShiftColor,
														}}
														title={'Cancel'}
														class={'secondary'}
														textStyle={{
															color: Colors.primary,
															textTransform: 'none',
															fontFamily: FontConfig.primary.bold,
															fontSize: 16,
														}}
													/>
												</View>
												<View
													style={{
														width: '45%',
													}}>
													<CustomButton
														style={{
															flex: 0,
															borderRadius: 8,
															marginVertical: 0,
															height: 40,
														}}
														title={'Save changes'}
														// isLoading={isSubmitting}
														// onPress={handleSubmit}
														disabled={!isValid}
														textStyle={{
															textTransform: 'none',
															fontFamily: FontConfig.primary.bold,
															fontSize: 16,
														}}
													/>
												</View>
											</View>
										</>
									)}
								</Formik>
							</View>
						</View>
					</View>
				</BaseViewComponent>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		// marginHorizontal: 20,
	},
	avatarStyle: {
		height: 120,
		width: 120,
		// backgroundColor: 'red',
		borderRadius: 500,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	profileTitleText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 12,
		color: Colors.textOnTextLight,
		marginTop: 10,
	},
	contentBoxContainer: {
		// backgroundColor: Colors.primary,
		// justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		// marginTop: 20,
	},
	formBlock: {
		alignItems: 'center',
		// marginVertical: 25,
	},
	formHolder: {
		// width: '85%',
		marginHorizontal: 20,
	},
	rowElements: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
});

export default ProfileEditScreen;
