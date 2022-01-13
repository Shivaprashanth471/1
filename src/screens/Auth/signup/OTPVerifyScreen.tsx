import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {BaseViewComponent, CustomButton} from '../../../components/core';
import KeyboardAvoidCommonView from '../../../components/core/KeyboardAvoidCommonView';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../../constants';
import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import FormikInputComponent from '../../../components/core/FormikInputComponent';

const OTPVerifySchema = yup.object().shape({
	code: yup.string().required('Required').min(4, 'Invalid').max(4, 'Invalid'),
});

export interface OTPVerifySchema {
	email: string;
	code: string;
}

const initialValues: OTPVerifySchema = {
	email: '',
	code: '',
};

const OTPVerifyScreen = (props: any) => {
	const {emailVerifyPayload}: any = props.route.params;
	const navigation = props.navigation;

	const OTPVerifyHandler = (
		values: OTPVerifySchema,
		formikHelpers: FormikHelpers<OTPVerifySchema>,
	) => {
		formikHelpers.setSubmitting(true);
		values.email = emailVerifyPayload.email;
		const payload = {...values};
		console.log('>>', payload);

		ApiFunctions.post(ENV.apiUrl + 'otpVerification', payload)
			.then(async resp => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					ToastAlert.show(resp.msg || 'Email Verification successful');
					// navigation.replace(NavigateTo.Auth, {screen: NavigateTo.Signin});
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
		const payload = emailVerifyPayload;
		console.log(payload);

		ApiFunctions.post(ENV.apiUrl + 'sendOTP', payload)
			.then(resp => {
				if (resp.success) {
					ToastAlert.show(
						resp.msg ||
							'Email varification code has been sent to your registered mobile and email',
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
						<View style={{}}>
							<Text style={styles.headerText}>We have sent you an OTP</Text>
						</View>
					</View>
				</View>
				<View style={styles.subHeadingHolder}>
					<Text style={styles.subHeading}>
						Enter the 4 digit OTP to proceed - {emailVerifyPayload.email}
					</Text>
				</View>
				<View style={styles.formBlock}>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={OTPVerifyHandler}
							validationSchema={OTPVerifySchema}
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
													isLoading={resendOtpLoader}
												/>
											</View>
										</View>
									</View>
									<View
										style={{
											marginTop: 250,
										}}>
										<View>
											<CustomButton
												style={{
													flex: 0,
													backgroundColor: Colors.primary,
													borderRadius: 8,
													marginVertical: 0,
												}}
												title={'Proceed'}
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
		width: '80%',
	},
	headerText: {
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
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
});

export default OTPVerifyScreen;
