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
} from '../../../components/core';
// import Logo from '../../assets/images/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../../store/reducers';
// import {KeyboardAvoidCommonView} from '../../components';
// import analytics from '@segment/analytics-react-native';
import PickerComponent from '../../../components/core/PickerComponent';
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
import {Picker} from '@react-native-community/picker';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../../helpers/ApiFunctions';
import FormikInputComponent from '../../../components/core/FormikInputComponent';

const languageSchema = yup.object().shape({
	language: yup.string().required('Required'),
	languagePreference: yup.string().required('Required'),
});

export interface LanguageSchemaType {
	language: string;
	languagePreference: string;
}

const initialValues: LanguageSchemaType = {
	language: '',
	languagePreference: '',
};

// export interface LoginAPIResponse {
// 	user: {name: string; role: string};
// 	token: string;
// }

const MyProfileCreationGetLanguage = (props: any) => {
	const dispatch = useDispatch();
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	const [isLoading, setIsLoading]: any = useState(false);
	const [isResendLoading, setIsResendLoading]: any = useState(false);

	const languageHandler = (
		values: LanguageSchemaType,
		formikHelpers: FormikHelpers<LanguageSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(values);
		navigation.navigate(NavigateTo.MyProfileCreationGetDocuments);
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
				<BaseViewComponent noScroll={true}>
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
									Which language do you know
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
									onSubmit={languageHandler}
									validationSchema={languageSchema}
									validateOnBlur={true}
									initialValues={initialValues}>
									{({handleSubmit, isValid, isSubmitting}) => (
										<View>
											<Field name={'language'}>
												{(field: FieldProps) => (
													<PickerComponent
														style={{width: '100%'}}
														labelText={'language'}
														mode={'dropdown'}
														// enabled={false}
														formikField={field}>
														<Picker.Item label="Select Language" value="" />
														<Picker.Item label="English" value="English" />
														<Picker.Item label="Hindi" value="Hindi" />
														<Picker.Item label="Chinese" value="Chinese" />
													</PickerComponent>
												)}
											</Field>
											<Field name={'shiftPreference'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														// labelText={'Shift Prefer'}
														radioButtons={[
															{
																id: 'Native Speaker',
																title: 'Native Speaker',
															},
															{
																id: 'Professional',
																title: 'Professional',
															},
															{
																id: 'Beginner',
																title: 'Beginner',
															},
														]}
														direction={'row'}
													/>
												)}
											</Field>
											<View
												style={{
													flexDirection: 'row',
													marginTop: 250,
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
														title={'Save changes'}
														isLoading={isSubmitting}
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
		// marginVertical: 20,
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
		// backgroundColor: 'red',
	},
	formHolder: {
		flex: 1,
		// justifyContent: 'space-around',
		// backgroundColor: 'red',
		width: '100%',
	},
	logo: {},

	title: {textAlign: 'center', fontSize: 32},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
});

export default MyProfileCreationGetLanguage;
