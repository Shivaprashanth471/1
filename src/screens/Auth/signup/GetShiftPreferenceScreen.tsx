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
import {currentList, regionsList} from '../../../constants/CommonVariables';
import {Colors, ENV, FontConfig, NavigateTo} from '../../../constants';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import PickerComponent from '../../../components/core/PickerComponent';
import DropdownComponent from '../../../components/core/DropdownComponent';
import {
	BaseViewComponent,
	ErrorComponent,
	LoadingComponent,
	CustomButton,
	FormikRadioGroupComponent,
	KeyboardAvoidCommonView,
} from '../../../components/core';
import {StateParams} from '../../../store/reducers';
import moment from 'moment';
import * as yup from 'yup';

const GetShiftPreferenceSchema = yup.object().shape({
	is_fully_vaccinated: yup.string().required('Required'),
});

export interface GetShiftPreferenceType {
	is_fully_vaccinated: string;
}

const initialValues: GetShiftPreferenceType = {
	is_fully_vaccinated: '',
};

const GetShiftPreferenceScreen = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile] = useState<any[] | null>();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const [loadingPercent, setLoadingPercent]: any = useState(20);
	const navigation = props.navigation;

	const updateShiftPreferenceDetails = (
		values: GetShiftPreferenceType,
		formikHelpers: FormikHelpers<GetShiftPreferenceType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(payload);
		formikHelpers.setSubmitting(false);
		navigation.navigate(NavigateTo.GetWorkExperienceScreen);
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
			<BaseViewComponent>
				<StatusBar
					barStyle={'light-content'}
					animated={true}
					backgroundColor={Colors.backdropColor}
				/>
				<View
					style={{
						flex: 1,
						marginTop: 20,
						marginHorizontal: 20,
					}}>
					<View style={[styles.header]}>
						<View style={{}}>
							<Text style={styles.headerText}>What Shift do you prefer</Text>
						</View>
						<View style={styles.subHeadingHolder}>
							<Text style={styles.subHeading}>
								Please select appropriate response
							</Text>
						</View>
					</View>
					<View style={styles.formBlock}>
						<View style={styles.formHolder}>
							<Formik
								onSubmit={updateShiftPreferenceDetails}
								validationSchema={GetShiftPreferenceSchema}
								validateOnBlur={true}
								initialValues={initialValues}>
								{({handleSubmit, isValid, isSubmitting, values}) => (
									<View
										style={{
											justifyContent: 'space-between',
										}}>
										<Field name={'is_fully_vaccinated'}>
											{(field: FieldProps) => (
												<FormikRadioGroupComponent
													formikField={field}
													// labelText={'Shift Prefer'}
													radioButtons={[
														{id: 'AM', title: 'AM'},
														{id: 'PM', title: 'PM'},
														{id: 'NOC', title: 'NOC'},
													]}
													direction={'column'}
												/>
											)}
										</Field>
										<CustomButton
											isLoading={isSubmitting}
											title={'Continue'}
											onPress={handleSubmit}
											style={{
												backgroundColor: Colors.primary,
												marginTop: 250,
											}}
											disabled={!isValid}
										/>
									</View>
								)}
							</Formik>
						</View>
					</View>
				</View>
			</BaseViewComponent>
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
	},
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
	},
	headerText: {
		textAlign: 'left',
		fontSize: 26,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
	},
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'left',
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
	formBlock: {
		marginVertical: 25,
		flex: 3,
	},
	formHolder: {
		flex: 1,
	},
});

export default GetShiftPreferenceScreen;
