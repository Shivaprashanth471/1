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

// Login api
const loginSchema = yup.object().shape({
	currentPassword: yup
		.string()
		.required('Required')
		.min(6, 'Invalid')
		.max(16, 'Invalid'),
	password: yup
		.string()
		.required('Required')
		.min(6, 'Invalid')
		.max(16, 'Invalid'),
	confirm: yup
		.string()
		.required('Required')
		.min(6, 'must be at least 6 characters')
		.oneOf([yup.ref('password'), null], "Confirmation Doesn't match"),
});

export interface LoginSchemaType {
	currentPassword: string;
	password: string;
	confirm?: string;
}

const initialValues: LoginSchemaType = {
	currentPassword: '',
	password: '',
	confirm: '',
};

export interface LoginAPIResponse {
	user: {name: string; role: string};
	token: string;
}

// end login api

const ProfileChangePasswordScreen = (props: any) => {
	const navigation = props.navigation;
	const [eyeIcon, setEyeIcon] = useState(false);
	const [isPassword, setIsPassword] = useState(true);
	const dispatch = useDispatch();
	const [isNewPassword, setNewIsPassword] = useState(true);
	const [isCurrentPassword, setCurrentIsPassword] = useState(true);

	const VisibilityPassword = () => {
		// setPasswordEyeIcon(isPassword ? true : false);
		setIsPassword(prevState => !prevState);
	};
	const VisibilityNewPassword = () => {
		// setNewPasswordEyeIcon(isNewPassword ? true : false);
		setNewIsPassword(prevState => !prevState);
	};
	const VisibilityOldPassword = () => {
		// setNewPasswordEyeIcon(isNewPassword ? true : false);
		setCurrentIsPassword(prevState => !prevState);
	};

	const loginHandler = (
		values: LoginSchemaType,
		formikHelpers: FormikHelpers<LoginSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		delete values.confirm;
		const payload = {...values};
		console.log(values);
		formikHelpers.setSubmitting(false);
		// ApiFunctions.post(ENV.apiUrl + 'account/login', payload)
		// 	.then(async (resp: TSAPIResponseType<LoginAPIResponse>) => {
		// 		formikHelpers.setSubmitting(false);
		// 		if (resp.success) {
		// 			ToastAlert.show(resp.msg || 'Login Successful!');
		// 			await dispatch(loginUser(resp.data.user, resp.data.token));
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
		<KeyboardAvoidCommonView>
			<BaseViewComponent>
				<StatusBar
					barStyle={'light-content'}
					animated={true}
					backgroundColor={Colors.backdropColor}
				/>
				{/* <View style={styles.wrapper}>
					<View style={styles.header}>
						<View style={{}}>
							<Text style={styles.headerText}>Create New Password</Text>
						</View>
						<View style={styles.subHeadingHolder}>
							<Text style={styles.subHeading}>
								Lorem Ipsum dolor sit amet, consectetur adipiscing elit,
							</Text>
						</View>
					</View>
				</View> */}
				<View style={styles.formBlock}>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={loginHandler}
							validationSchema={loginSchema}
							validateOnBlur={true}
							initialValues={initialValues}>
							{({handleSubmit, isValid, isSubmitting}) => (
								<>
									<View>
										<Field name={'currentPassword'}>
											{(field: FieldProps) => (
												<View style={styles.rowElements}>
													<FormikInputComponent
														labelText="Enter Current Password"
														inputProperties={{
															maxLength: 20,
															secureTextEntry: isCurrentPassword,
															placeholder: 'Enter Current Password',
														}}
														inputStyles={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 18,
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
														onPress={VisibilityOldPassword}>
														{isCurrentPassword ? (
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
											flexDirection: 'row',
											marginTop: 150,
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
													fontSize: 18,
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
												title={'Update'}
												// isLoading={isSubmitting}
												onPress={handleSubmit}
												disabled={!isValid}
												textStyle={{
													textTransform: 'none',
													fontFamily: FontConfig.primary.bold,
													fontSize: 18,
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
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'left',
		fontSize: 16,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
	header: {
		flex: 0,
		marginTop: 20,
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
		fontSize: 16,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textDark,
	},
});

export default ProfileChangePasswordScreen;
