import React, {useState} from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {BaseViewComponent, CustomButton} from '../../components/core';
import {
	KeyboardAvoidCommonView,
	FormikInputComponent,
	FormikRadioGroupComponent,
	FormikCheckboxComponent,
} from '../../components/core';
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
import {TSAPIResponseType} from '../../helpers/ApiFunctions';

// Login api
const loginSchema = yup.object().shape({
	email: yup.string().required('Required').email('Invalid Email'),
});

export interface LoginSchemaType {
	email: string;
}

const initialValues: LoginSchemaType = {
	email: '',
};

export interface LoginAPIResponse {
	user: {msg: string};
}

// end login api

const AuthPhoneScreen = (props: any) => {
	const dispatch = useDispatch();
	const navigation = props.navigation;

	const loginHandler = (
		values: LoginSchemaType,
		formikHelpers: FormikHelpers<LoginSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log('payload out>>>', payload);
		ApiFunctions.post(ENV.apiUrl + 'forgotPassword', payload)
			.then(resp => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					ToastAlert.show(resp.msg || 'email verified');
					navigation.navigate(NavigateTo.ForgotPassword_Password_Screen, {
						email: payload,
					});
				} else {
					ToastAlert.show(resp.error || '');
					console.log('resp.error');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
				ToastAlert.show(err.errors.email[0] || 'Please enter correct email');
			});
	};
	return (
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
							<Text style={styles.headerText}>Give us your email address</Text>
						</View>
						<View style={styles.subHeadingHolder}>
							<Text style={styles.subHeading}>
								Please type your registered Email address to proceed further.
							</Text>
						</View>
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
													keyboardType: 'email-address',
													// maxLength: 13,
													placeholder: 'email address',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<CustomButton
										isLoading={isSubmitting}
										title={'Continue'}
										onPress={handleSubmit}
										style={styles.button}
										disabled={!isValid}
									/>
									{/* <View style={styles.footerContainer}>
										<View
											style={{
												marginHorizontal: 40,
												marginTop: 20,
											}}>
											<Field name={'terms&conditions'}>
												{(field: FieldProps) => (
													<FormikCheckboxComponent formikField={field} />
												)}
											</Field>
											<Text style={styles.footerText}>
												You agree to allow VitaWerks to check your information.
												Terms & Conditions. Lorem ipsum dolor sit amet,
												consectetur adipiscing elit, sed do eiusmod tempor
												incididunt ut labore et dolore magna aliqua. Ut enim ad
												minim veniam,{' '}
											</Text>
											<CustomButton
												isLoading={isSubmitting}
												title={'Agree and Continue'}
												onPress={handleSubmit}
												style={styles.button}
												disabled={!isValid}
											/>
										</View>
									</View> */}
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
		// alignItems: "center",
		marginTop: 30,
		marginHorizontal: 20,
	},
	formHolder: {
		width: '85%',
		// marginHorizontal: '5%',
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
		marginTop: 20,
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
		alignItems: 'flex-start',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '70%',
	},
	headerText: {
		textAlign: 'left',
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
		// fontFamily: 'NunitoSans-Bold',
		color: Colors.textDark,
	},
	footerContainer: {
		backgroundColor: Colors.backgroundShiftColor,
		marginHorizontal: -40,
		bottom: 0,
		// position: 'absolute',
		height: 500,
		marginTop: 80,
		borderRadius: 60,
	},
	footerText: {
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: '#667B8B',
		marginTop: 20,
	},
});

export default AuthPhoneScreen;
