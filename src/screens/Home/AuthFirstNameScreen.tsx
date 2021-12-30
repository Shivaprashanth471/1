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
} from '../../constants';
import {
	ApiFunctions,
	CommonFunctions,
	CommonStyles,
	ToastAlert,
} from '../../helpers';
import {
	BaseViewComponent,
	CustomButton,
	KeyboardAvoidCommonView,
} from '../../components/core';
// import Logo from '../../assets/images/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
// import {KeyboardAvoidCommonView} from '../../components';
// import analytics from '@segment/analytics-react-native';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {checkLogin, logoutUser} from '../../store/actions/auth.action';
import {logoutSubject} from '../../helpers/Communications';
import SmsRetriever from 'react-native-sms-retriever';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import FormikInputComponent from '../../components/core/FormikInputComponent';

const loginSchema = yup.object().shape({
	name: yup.string().required('Required').min(3, 'Invalid'),
});

export interface FirstNameSchemaType {
	name: string;
}

const initialValues: FirstNameSchemaType = {
	name: '',
};

export interface LoginAPIResponse {
	user: {name: string; role: string};
	token: string;
}

const AuthFirstNameScreen = (props: any) => {
	const dispatch = useDispatch();
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	const [isLoading, setIsLoading]: any = useState(false);
	const [isResendLoading, setIsResendLoading]: any = useState(false);

	const firstNameHandler = (
		values: FirstNameSchemaType,
		formikHelpers: FormikHelpers<FirstNameSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(values);
		ApiFunctions.post(ENV.apiUrl + 'account/login', payload)
			.then(async (resp: TSAPIResponseType<LoginAPIResponse>) => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					// ToastAlert.show(resp.msg || 'Login Successful!');
					// await dispatch(loginUser(resp.data.user, resp.data.token));
					// navigation.replace(NavigateTo.Main);
				} else {
					// ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
			});
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
							// flexDirection: 'row',
							flex: 0,
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							marginTop: 10,
							marginHorizontal: 20,
							// backgroundColor: 'green',
						}}>
						<View style={styles.header}>
							<View style={{}}>
								<Text style={styles.headerText}>Tell us your first name</Text>
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
									onSubmit={firstNameHandler}
									validationSchema={loginSchema}
									validateOnBlur={true}
									initialValues={initialValues}>
									{({handleSubmit, isValid, isSubmitting}) => (
										<>
											<Field name={'name'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														trimSpecialCharacters={true}
														labelText="First Name"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'Enter your first name',
														}}
														formikField={field}
													/>
												)}
											</Field>

											<CustomButton
												isLoading={isSubmitting}
												title={'Continue'}
												onPress={handleSubmit}
												// style={[
												// 	styles.button,
												// 	{backgroundColor: Colors.primary, marginTop: 250},
												// ]}
												disabled={!isValid}
											/>
										</>
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
	},
	formHolder: {},
	logo: {},

	title: {textAlign: 'center', fontSize: 32},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
});

export default AuthFirstNameScreen;
