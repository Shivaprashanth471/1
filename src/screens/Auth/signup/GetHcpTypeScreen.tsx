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
} from '../../../components/core';
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
import DropdownComponent from '../../../components/core/DropdownComponent';
import {currentList, regionsList} from '../../../constants/CommonVariables';
const loginSchema = yup.object().shape({
	hcp_type: yup.string().required('Required'),
});

export interface GetHcpTypeType {
	hcp_type: string;
}

const initialValues: GetHcpTypeType = {
	hcp_type: '',
};

const GetHcpTypeScreen = (props: any) => {
	const dispatch = useDispatch();
	const navigation = props.navigation;
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const [isLoading, setIsLoading]: any = useState(false);
	const [isResendLoading, setIsResendLoading]: any = useState(false);

	const lastNameHandler = (
		values: GetHcpTypeType,
		formikHelpers: FormikHelpers<GetHcpTypeType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(values);
		formikHelpers.setSubmitting(false);
		navigation.navigate(NavigateTo.GetCertifiedToPractiseScreen);
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
								<Text style={styles.headerText}>Where are you located</Text>
							</View>
							<View style={styles.subHeadingHolder}>
								<Text style={styles.subHeading}>Please select your region</Text>
							</View>
						</View>
						<View style={styles.formBlock}>
							<View style={styles.formHolder}>
								<Formik
									onSubmit={lastNameHandler}
									validationSchema={loginSchema}
									validateOnBlur={true}
									initialValues={initialValues}>
									{({handleSubmit, isValid, isSubmitting}) => (
										<View
											style={{
												flex: 1,
												justifyContent: 'space-between',
											}}>
											<Field name={'hcp_type'}>
												{(field: FieldProps) => (
													<DropdownComponent
														contentWrapper={{marginHorizontal: 0}}
														// @ts-ignore
														data={regionsList}
														labelText={'Region'}
														placeholder={'select your region'}
														formikField={field}
														search={false}
														disabled={false}
														onUpdate={() => {
															// setDisableBtn(false);
														}}
													/>
												)}
											</Field>

											<CustomButton
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
		// alignItems: 'center',
		marginVertical: 25,
		flex: 3,
	},
	formHolder: {
		flex: 1,
	},
	logo: {},

	title: {textAlign: 'center', fontSize: 32},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
});

export default GetHcpTypeScreen;
