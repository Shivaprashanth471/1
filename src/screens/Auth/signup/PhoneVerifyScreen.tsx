import React, {useState} from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import {
	KeyboardAvoidCommonView,
	FormikCheckboxComponent,
	BaseViewComponent,
	CustomButton,
	FormikPhoneInputComponent,
} from '../../../components/core';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	NavigateTo,
	ImageConfig,
} from '../../../constants';
import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';

const phoneVerifySchema = yup.object().shape({
	contact_number: yup
		.string()
		.min(10, 'Phone number must be of 10 digits')
		// .matches(
		// 	/^\+(?=.*[1-9])((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
		// 	'Invalid',
		// )
		.matches(
			/^(?=.*[1-9])((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			'Invalid',
		)
		.required('Required'),
	agree: yup
		.boolean()
		.oneOf([true], 'Must Accept Terms of Services')
		.required('Required'),
});

export interface PhoneVerifySchemaType {
	contact_number: string;
	agree: boolean;
}

const initialValues: PhoneVerifySchemaType = {
	contact_number: '',
	agree: false,
};

const PhoneVerifyScreen = (props: any) => {
	const [phnNumber, setPhnNum] = useState('');
	const [BtnLoading, setBtnLoading] = useState<boolean>(false);

	const phoneVerifyHandler = () =>
		// values: PhoneVerifySchemaType,
		// formikHelpers: FormikHelpers<PhoneVerifySchemaType>,
		{
			// formikHelpers.setSubmitting(true);
			setBtnLoading(true);
			const payload = {contact_number: phnNumber};
			ApiFunctions.post(ENV.apiUrl + 'sendOTP', payload)
				.then(resp => {
					// formikHelpers.setSubmitting(false);
					if (resp.success) {
						ToastAlert.show(resp.msg || 'phone verified');
						navigation.navigate(NavigateTo.OTPVerifyScreen, {
							contact_number: payload,
						});
					} else {
						ToastAlert.show(resp.error || '');
						console.log('resp.error');
					}
					setBtnLoading(false);
				})
				.catch((err: any) => {
					// formikHelpers.setSubmitting(false);
					// CommonFunctions.handleErrors(err, formikHelpers.setErrors);
					ToastAlert.show(err.msg || 'Oops... Something went wrong!');
					console.log('>>>>>', err.msg);
					setBtnLoading(false);
				});
		};
	const navigation = props.navigation;
	return (
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
							<Text style={styles.headerText}>
								Give us your mobile number for verification
							</Text>
						</View>
						<View style={styles.subHeadingHolder}>
							<Text style={styles.subHeading}>
								Please type your Mobile Number
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.formBlock}>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={phoneVerifyHandler}
							validationSchema={phoneVerifySchema}
							validateOnBlur={true}
							initialValues={initialValues}>
							{({handleSubmit, isValid, isSubmitting}) => (
								<>
									<Field name={'contact_number'}>
										{(field: FieldProps) => (
											<FormikPhoneInputComponent
												formikField={field}
												onUpdate={phnNum => {
													// console.log(phnNum, 'njnkbjhbh');
													setPhnNum(phnNum);
												}}
											/>
										)}
									</Field>
									<View style={styles.footerContainer}>
										<View
											style={{
												marginHorizontal: 40,
												marginTop: 20,
											}}>
											<Field name={'agree'}>
												{(field: FieldProps) => (
													<FormikCheckboxComponent
														formikField={field}
														errorContainerStyle={{marginTop: 20}}
													/>
												)}
											</Field>
											<Text style={styles.footerText}>
												You agree to allow VitaWerks to check your information.
												Terms {'&'} Conditions.
											</Text>
											<CustomButton
												isLoading={BtnLoading}
												title={'Agree & Continue'}
												onPress={phoneVerifyHandler}
												style={styles.button}
												disabled={!isValid}
												textStyle={{textTransform: 'none'}}
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
		height: 300,
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

export default PhoneVerifyScreen;
