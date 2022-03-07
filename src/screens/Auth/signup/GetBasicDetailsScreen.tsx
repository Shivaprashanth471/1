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

const GetBasicDetailsSchema = yup.object().shape({
	first_name: yup.string().min(3, 'Minimum 3 letters').required('Required'),
	last_name: yup.string().min(3, 'Minimum 3 letters').required('Required'),
	email: yup.string().required('Required').email('Invalid Email'),
	zip_code: yup.string().required('Required'),
});

export interface GetBasicDetailsSchemaType {
	first_name: string;
	last_name: string;
	email: string;
	address: string;
	zip_code: string;
}

const initialValues: GetBasicDetailsSchemaType = {
	first_name: '',
	last_name: '',
	email: '',
	address: '',
	zip_code: '',
};

const GetBasicDetailsScreen = (props: any) => {
	const {hcpDetails}: any = props.route.params || '';
	const {signupInitiated}: any = props.route.params;
	const {contact_number}: any = props.route.params;
	const navigation = props.navigation;

	const GetHcpSignUpHandler = (
		values: GetBasicDetailsSchemaType,
		formikHelpers: FormikHelpers<GetBasicDetailsSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			first_name: values.first_name,
			last_name: values.last_name,
			email: values.email.toLowerCase,
			contact_number: contact_number,
			address: {
				street: values.address,
				zip_code: values.zip_code,
			},
		};
		ApiFunctions.post(ENV.apiUrl + 'hcp/signup', payload)
			.then(resp => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					ToastAlert.show(resp.msg || 'email verified');
					navigation.navigate(NavigateTo.GetHcpPositionScreen, {
						GetHcpBasicDetailsPayload: resp.data,
						signupInitiated: signupInitiated,
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
				console.log('error', err);
			});
	};
	const GetHcpEditHandler = (
		values: GetBasicDetailsSchemaType,
		formikHelpers: FormikHelpers<GetBasicDetailsSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			first_name: values.first_name,
			last_name: values.last_name,
			email: values.email,
			contact_number: contact_number,
			address: {
				street: values.address,
				zip_code: values.zip_code,
			},
		};
		ApiFunctions.put(ENV.apiUrl + 'hcp/' + hcpDetails._id, payload)
			.then(resp => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					navigation.navigate(NavigateTo.GetHcpPositionScreen, {
						GetHcpBasicDetailsPayload: resp.data,
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
				console.log('error', err);
			});
	};

	return (
		<>
			<KeyboardAvoidCommonView>
				<BaseViewComponent noScroll={false}>
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
								<Text style={styles.headerText}>Tell us your details</Text>
							</View>
							<View style={styles.subHeadingHolder}>
								<Text style={styles.subHeading}>
									Please provide your basic details
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.formBlock}>
						<View style={styles.formHolder}>
							<Formik
								onSubmit={
									signupInitiated ? GetHcpEditHandler : GetHcpSignUpHandler
								}
								validationSchema={GetBasicDetailsSchema}
								validateOnBlur={true}
								initialValues={{
									...initialValues,
									...{
										first_name: signupInitiated ? hcpDetails.first_name : '',
										last_name: signupInitiated ? hcpDetails.last_name : '',
										email: signupInitiated ? hcpDetails.email : '',
										zip_code: signupInitiated
											? hcpDetails.address.zip_code
											: '',
										address: signupInitiated ? hcpDetails.address.street : '',
									},
								}}>
								{({handleSubmit, isValid, isSubmitting}) => (
									<>
										<Field name={'first_name'}>
											{(field: FieldProps) => (
												<FormikInputComponent
													trimSpaces={true}
													trimNumbers={true}
													trimSpecialCharacters={true}
													inputProperties={{
														keyboardType: 'default',
														placeholder: 'First Name*',
													}}
													formikField={field}
												/>
											)}
										</Field>
										<Field name={'last_name'}>
											{(field: FieldProps) => (
												<FormikInputComponent
													trimSpaces={true}
													trimNumbers={true}
													trimSpecialCharacters={true}
													inputProperties={{
														keyboardType: 'default',
														placeholder: 'Last Name*',
													}}
													formikField={field}
												/>
											)}
										</Field>
										<Field name={'email'}>
											{(field: FieldProps) => (
												<FormikInputComponent
													trimSpaces={true}
													inputProperties={{
														keyboardType: 'default',
														placeholder: 'Email*',
													}}
													formikField={field}
												/>
											)}
										</Field>
										<Field name={'zip_code'}>
											{(field: FieldProps) => (
												<FormikInputComponent
													trimSpaces={true}
													inputProperties={{
														keyboardType: 'default',
														placeholder: 'Zip Code*',
													}}
													formikField={field}
												/>
											)}
										</Field>
										<Field name={'address'}>
											{(field: FieldProps) => (
												<FormikInputComponent
													inputProperties={{
														keyboardType: 'default',
														placeholder: 'Address',
													}}
													formikField={field}
												/>
											)}
										</Field>

										<View
											style={{
												marginTop: 70,
											}}>
											<View>
												<CustomButton
													style={{
														flex: 0,
														backgroundColor: Colors.primary,
														borderRadius: 8,
														marginVertical: 0,
													}}
													title={'Continue'}
													isLoading={isSubmitting}
													disabled={!isValid}
													onPress={handleSubmit}
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
		</>
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

export default GetBasicDetailsScreen;
