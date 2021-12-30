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
} from '../../../constants';
import {
	ApiFunctions,
	CommonFunctions,
	CommonStyles,
	ToastAlert,
} from '../../../helpers';
import {
	BaseViewComponent,
	CustomButton,
	KeyboardAvoidCommonView,
	FormikRadioGroupComponent,
	// FormikDatepickerComponent,
} from '../../../components/core';
import Moment from 'moment';
// import Logo from '../../assets/images/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../../store/reducers';
// import {KeyboardAvoidCommonView} from '../../components';
// import analytics from '@segment/analytics-react-native';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {checkLogin, logoutUser} from '../../../store/actions/auth.action';
import {logoutSubject} from '../../../helpers/Communications';
import SmsRetriever from 'react-native-sms-retriever';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../../helpers/ApiFunctions';
import FormikInputComponent from '../../../components/core/FormikInputComponent';

const WorkExperienceSchema = yup.object().shape({
	facilityName: yup.string().required('Required'),
	location: yup.string().required('Required'),
	position: yup.string().required('Required'),
	stillWorking: yup.string().required('Required'),
	// startDate: yup.required('Required'),
});

export interface WorkExperienceSchemaType {
	facilityName: string;
	location: string;
	position: string;
	stillWorking: string;
	startDate: any;
}

const initialValues: WorkExperienceSchemaType = {
	facilityName: '',
	location: '',
	position: '',
	stillWorking: '',
	startDate: '',
};

// export interface LoginAPIResponse {
// 	user: {name: string; role: string};
// 	token: string;
// }

const MyProfileCreationGetExperience = (props: any) => {
	const dispatch = useDispatch();
	const navigation = props.navigation;
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const [isLoading, setIsLoading]: any = useState(false);
	const [isResendLoading, setIsResendLoading]: any = useState(false);

	const WorkExperienceHandler = (
		values: WorkExperienceSchemaType,
		formikHelpers: FormikHelpers<WorkExperienceSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(values);
		// navigation.navigate(NavigateTo.MyProfileShiftPreferencesScreen);
		// ApiFunctions.post(ENV.apiUrl + 'account/login', payload)
		// 	.then(async (resp: TSAPIResponseType<LoginAPIResponse>) => {
		// 		formikHelpers.setSubmitting(false);
		// 		if (resp.success) {
		// ToastAlert.show(resp.msg || 'Login Successful!');
		// await dispatch(loginUser(resp.data.user, resp.data.token));
		// navigation.replace(NavigateTo.Main);
		// } else {
		// ToastAlert.show(resp.error || '');
		// }
		// })
		// .catch((err: any) => {
		// formikHelpers.setSubmitting(false);
		// CommonFunctions.handleErrors(err, formikHelpers.setErrors);
		// });
	};

	return (
		<>
			<KeyboardAvoidCommonView>
				<BaseViewComponent>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View
						style={{
							flex: 1,
							marginTop: 10,
							marginHorizontal: 20,
						}}>
						<View style={[styles.header]}>
							<View style={{}}>
								<Text style={styles.headerText}>
									Tell us about your work experience
								</Text>
							</View>
							<View style={styles.subHeadingHolder}>
								<Text style={styles.subHeading}>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit,
								</Text>
							</View>
						</View>
						<View style={styles.formBlock}>
							<View style={styles.formHolder}>
								<Formik
									onSubmit={WorkExperienceHandler}
									validationSchema={WorkExperienceSchema}
									validateOnBlur={true}
									initialValues={initialValues}>
									{({handleSubmit, isValid, isSubmitting}) => (
										<View>
											<Field name={'facilityName'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														trimSpecialCharacters={true}
														// labelText="Last Name"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'Facility Name',
														}}
														formikField={field}
													/>
												)}
											</Field>
											<Field name={'location'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														trimSpecialCharacters={true}
														// labelText="Last Name"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'Location',
														}}
														formikField={field}
													/>
												)}
											</Field>
											<Field name={'position'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														trimSpecialCharacters={true}
														// labelText="Last Name"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'position',
														}}
														formikField={field}
													/>
												)}
											</Field>

											<View
												style={{
													flexDirection: 'row',
													// backgroundColor: 'red',
													alignItems: 'center',
												}}>
												<Text
													style={{
														fontFamily: FontConfig.primary.bold,
														fontSize: 16,
														color: Colors.textDark,
														marginRight: 20,
													}}>
													Still working here
												</Text>
												<Field name={'stillWorking'}>
													{(field: FieldProps) => (
														<FormikRadioGroupComponent
															formikField={field}
															// labelText={'Shift Prefer'}
															radioButtons={[
																{
																	id: 'yes',
																	title: 'yes',
																},
																{
																	id: 'no',
																	title: 'no',
																},
															]}
															direction={'row'}
														/>
													)}
												</Field>
												{/* <Field name={'startDate'}>
													{(field: FieldProps) => (
														<FormikDatepickerComponent
															formikField={field}
															// minDate={Moment()
															// 	.subtract(5, 'years')
															// 	.format('YYYY-MM-DD')}
															labelText={'Start Date'}
														/>
													)}
												</Field> */}
											</View>

											<CustomButton
												style={{
													marginTop: 150,
												}}
												isLoading={isSubmitting}
												title={'Continue'}
												onPress={handleSubmit}
												disabled={!isValid}
											/>
										</View>
									)}
								</Formik>
							</View>
						</View>
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
		flex: 1,
		marginVertical: 20,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
		// width: '70%',
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
	formBlock: {
		alignItems: 'center',
		marginVertical: 25,
		flex: 3,
	},
	formHolder: {
		flex: 1,
		// justifyContent: 'space-around',
	},
	logo: {},

	title: {textAlign: 'center', fontSize: 32},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
});

export default MyProfileCreationGetExperience;
