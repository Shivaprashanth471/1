import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
	Alert,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {ApiFunctions, CommonStyles} from '../../../helpers';
import {Colors, ENV, FontConfig, NavigateTo} from '../../../constants';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import PickerComponent from '../../../components/core/PickerComponent';
import {
	BaseViewComponent,
	ProfileDetailsContainerComponent,
	ErrorComponent,
	LoadingComponent,
	CustomButton,
	FormikRadioGroupComponent,
	KeyboardAvoidCommonView,
} from '../../../components/core';
import {StateParams} from '../../../store/reducers';
import moment from 'moment';
import * as yup from 'yup';

const ShiftPreferenceSchema = yup.object().shape({
	shiftPreference: yup.string().required('Required'),
});

export interface ShiftPreferenceSchemaType {
	shiftPreference: string;
}

const initialValues: ShiftPreferenceSchemaType = {
	shiftPreference: '',
};

const MyProfileShiftPreferencesScreen = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile] = useState<any[] | null>();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const [loadingPercent, setLoadingPercent]: any = useState(20);
	const navigation = props.navigation;

	// const gotoGetCurrentRole = () => {
	// 	props.navationa.navigate(NavigateTo.MyProfileCreationGetStartedScreen);
	// };

	const updateShiftPreferenceDetails = (
		values: ShiftPreferenceSchemaType,
		formikHelpers: FormikHelpers<ShiftPreferenceSchemaType>,
	) => {
		// formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(payload);
		formikHelpers.setSubmitting(false);
		navigation.navigate(NavigateTo.MyProfileCreationGetLanguage);
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
									What shift would you prefer
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
									onSubmit={updateShiftPreferenceDetails}
									validationSchema={ShiftPreferenceSchema}
									validateOnBlur={true}
									initialValues={initialValues}>
									{({handleSubmit, isValid, isSubmitting}) => (
										<View
											style={{
												flex: 1,
												justifyContent: 'space-between',
											}}>
											<Field name={'shiftPreference'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														// labelText={'Shift Prefer'}
														radioButtons={[
															{
																id: 'AM',
																title: 'AM',
															},
															{
																id: 'AM-12',
																title: 'AM-12',
															},
															{
																id: 'PM',
																title: 'PM-12',
															},
															{
																id: 'NOC',
																title: 'NOC',
															},
														]}
														direction={'row'}
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
		padding: 10,
		flex: 1,
	},
	pageSubTitle: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 16,
		color: Colors.textLight,
		// marginVertical: 10,
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
	},
	formHolder: {
		flex: 1,
		// justifyContent: 'space-around',
	},
});

export default MyProfileShiftPreferencesScreen;
