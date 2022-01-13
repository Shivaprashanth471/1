import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {BaseViewComponent, CustomButton} from '../../../components/core';
import {
	KeyboardAvoidCommonView,
	FormikInputComponent,
} from '../../../components/core';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../../helpers';
import {Colors, ENV, FontConfig, NavigateTo} from '../../../constants';
import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';

const verifyEmailSchema = yup.object().shape({
	email: yup.string().required('Required').email('Invalid Email'),
});

export interface VerifyEmailSchemaType {
	email: string;
	// agree: any;
}

const initialValues: VerifyEmailSchemaType = {
	email: '',
	// agree: null,
};

const EmailVerifyScreen = (props: any) => {
	const emailVerifyHandler = (
		values: VerifyEmailSchemaType,
		formikHelpers: FormikHelpers<VerifyEmailSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log('payload out>>>', payload);
		ApiFunctions.post(ENV.apiUrl + 'sendOTP', payload)
			.then(resp => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					ToastAlert.show(resp.msg || 'email verified');
					navigation.navigate(NavigateTo.OTPVerifyScreen, {
						emailVerifyPayload: payload,
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
	const navigation = props.navigation;
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
					}}>
					<View style={styles.header}>
						<View style={{}}>
							<Text style={styles.headerText}>Give us your email address</Text>
						</View>
						<View style={styles.subHeadingHolder}>
							<Text style={styles.subHeading}>
								Please type your Email address for verification.
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.formBlock}>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={emailVerifyHandler}
							validationSchema={verifyEmailSchema}
							validateOnBlur={true}
							initialValues={initialValues}>
							{({handleSubmit, isValid, isSubmitting}) => (
								<>
									<Field name={'email'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												labelText="Email"
												inputProperties={{
													keyboardType: 'email-address',
													placeholder: 'email address',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<View style={styles.footerContainer}>
										<View
											style={{
												marginHorizontal: 40,
												marginTop: 20,
											}}>
											{/* <Field name={'terms&conditions'}>
												{(field: FieldProps) => (
													<FormikCheckboxComponent formikField={field} />
												)}
											</Field> */}
											<Text style={styles.footerText}>
												You agree to allow VitaWerks to check your information.
												Terms {'&'} Conditions.
											</Text>
											<CustomButton
												isLoading={isSubmitting}
												title={'Agree and Continue'}
												onPress={handleSubmit}
												style={styles.button}
												disabled={!isValid}
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
		marginTop: 30,
		marginHorizontal: 20,
	},
	formHolder: {
		width: '85%',
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
		width: '70%',
	},
	headerText: {
		textAlign: 'left',
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
	},
	footerContainer: {
		backgroundColor: Colors.backgroundShiftColor,
		marginHorizontal: -40,
		bottom: 0,
		height: 400,
		marginTop: 200,
		borderRadius: 60,
	},
	footerText: {
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: '#667B8B',
		marginTop: 20,
	},
});

export default EmailVerifyScreen;
