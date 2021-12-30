import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
	TextInput,
} from 'react-native';
import {
	BaseViewComponent,
	CustomButton,
	FormikRadioGroupComponent,
	EditableTextInput,
	ErrorComponent,
	LoadingComponent,
	KeyboardAvoidCommonView,
} from '../../components/core';
import {useDispatch, useSelector} from 'react-redux';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../helpers';
import {loginUser} from '../../store/actions/auth.action';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import FormikInputComponent from '../../components/core/FormikInputComponent';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import PickerComponent from '../../components/core/PickerComponent';
import {Picker} from '@react-native-community/picker';
import LabelComponent from '../../components/core/LabelComponent';
// import Intercom from 'react-native-intercom';
import {StateParams} from '../../store/reducers';
import DropdownComponent from '../../components/core/DropdownComponent';
import {
	ExperienceList,
	primarySpecialityList,
	currentList,
} from '../../constants/CommonVariables';

const profileSchema = yup.object().shape({
	CurrentRole: yup.string().required('Required'),
	Location: yup.string().required('Required'),
	Experience: yup.string().required('Required'),
	primarySpeciality: yup.string().required('Required'),
	shiftPrefer: yup.string().required('Required'),
});

export interface ProfileSchemaType {
	CurrentRole: string;
	Location: string;
	Experience: string;
	primarySpeciality: string;
	shiftPrefer: string;
}

const initialValues: ProfileSchemaType = {
	CurrentRole: '',
	Location: '',
	Experience: '',
	primarySpeciality: '',
	shiftPrefer: '',
};

const MyProfileScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [profile, setProfile]: any = useState();
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [inState, setInState] = useState([<View />]);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	const {hcpID} = props.route.params;

	const getProfileDetails = useCallback(() => {
		setIsLoading(true);

		ApiFunctions.get(ENV.apiUrl + 'hcp/user/' + user._id)
			.then(async resp => {
				if (resp) {
					setProfile(resp.data);
					// Intercom.updateUser(resp.data);
				} else {
					Alert.alert('Error', resp);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, []);
	useEffect(() => {
		console.log('loading get profile');
		getProfileDetails();
	}, [getProfileDetails]);

	const updateProfileDetails = (
		values: ProfileSchemaType,
		formikHelpers: FormikHelpers<ProfileSchemaType>,
	) => {
		// formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log(payload);
		formikHelpers.setSubmitting(false);
		// navigation.replace(NavigateTo.Main);
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

	const addLanguage = () => {
		setInState([
			...inState,
			<EditableTextInput
				title="Title"
				subTitle="Subtext"
				description="description"
			/>,
		]);
	};
	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !profile && <ErrorComponent />}
			{!isLoading && isLoaded && profile && (
				<KeyboardAvoidCommonView>
					<BaseViewComponent>
						<StatusBar
							barStyle={'light-content'}
							animated={true}
							backgroundColor={Colors.backdropColor}
						/>
						<View style={styles.formBlock} key={profile.user_id}>
							<View style={styles.formHolder}>
								<Formik
									onSubmit={updateProfileDetails}
									validationSchema={profileSchema}
									validateOnBlur={true}
									initialValues={{
										...initialValues,
										...{
											CurrentRole: profile.hcp_type,
											Location: profile.address.region,
											Experience: profile.professional_details.experience,
											primarySpeciality:
												profile.professional_details.speciality,
											shiftPrefer: 'AM',
										},
									}}>
									{({handleSubmit, isValid, isSubmitting}) => (
										<>
											<Field name={'CurrentRole'}>
												{(field: FieldProps) => (
													<DropdownComponent
														contentWrapper={{marginHorizontal: 0}}
														// @ts-ignore
														data={currentList}
														labelText={'Current Role'}
														placeholder={'select the value'}
														formikField={field}
														search={false}
														disabled={true}
													/>
												)}
											</Field>
											<Field name={'Location'}>
												{(field: FieldProps) => (
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														isEditable={false}
														trimSpecialCharacters={true}
														labelText="Location"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'Location',
														}}
														formikField={field}
														// defaultValue="hello"
													/>
												)}
											</Field>
											<Field name={'Experience'}>
												{(field: FieldProps) => (
													// <DropdownComponent
													// 	contentWrapper={{marginHorizontal: 0}}
													// 	// @ts-ignore
													// 	data={ExperienceList}
													// 	labelText={'Experience'}
													// 	placeholder={'select the value'}
													// 	formikField={field}
													// 	search={false}
													// 	// disabled={false}
													// />
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														isEditable={false}
														trimSpecialCharacters={true}
														labelText="Experience"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'Experience',
														}}
														formikField={field}
														// defaultValue="hello"
													/>
												)}
											</Field>
											<Field name={'primarySpeciality'}>
												{(field: FieldProps) => (
													// <DropdownComponent
													// 	contentWrapper={{marginHorizontal: 0}}
													// 	// @ts-ignore
													// 	data={primarySpecialityList}
													// 	labelText={'Primary Speciality'}
													// 	placeholder={'select the value'}
													// 	formikField={field}
													// 	search={false}
													// 	disabled={true}
													// />
													<FormikInputComponent
														trimCharacters={true}
														trimSpaces={true}
														isEditable={false}
														trimSpecialCharacters={true}
														labelText="Specialities"
														inputProperties={{
															keyboardType: 'default',
															placeholder: 'Primary Speciality',
															multiline: true,
														}}
														formikField={field}
														// defaultValue="hello"
													/>
												)}
											</Field>
											<Field name={'shiftPrefer'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														labelText={'Shift Prefer'}
														radioButtons={[
															{id: 'AM', title: 'AM', disabled: true},
															{id: 'PM', title: 'PM', disabled: true},
															{id: 'NOC', title: 'NOC', disabled: true},
															{
																id: 'Either',
																title: 'Either works for me',
																disabled: true,
															},
														]}
														direction={'column'}
													/>
												)}
											</Field>
											{/* <View>
												<LabelComponent
													style={{paddingBottom: 5}}
													title={'Language'}
												/>
												<EditableTextInput
													title="English"
													subTitle="Native Speaker"
												/>
												{inState}
												<TouchableOpacity
													onPress={addLanguage}
													style={{marginVertical: 10}}>
													<Text
														style={{
															color: Colors.primary,
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 14,
														}}>
														+ Add more
													</Text>
												</TouchableOpacity>
											</View> */}
											<View
												style={{
													flexDirection: 'row',
													marginTop: 20,
												}}>
												{/* <View
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
															fontSize: 16,
														}}
													/>
												</View> */}

												{/* <View
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
														// isLoading={isSubmitting}
														// onPress={handleSubmit}
														disabled={!isValid}
														textStyle={{
															textTransform: 'none',
															fontFamily: FontConfig.primary.bold,
															fontSize: 16,
														}}
													/>
												</View> */}
											</View>
										</>
									)}
								</Formik>
							</View>
						</View>
					</BaseViewComponent>
				</KeyboardAvoidCommonView>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		// flexDirection: 'row',
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		// marginHorizontal: 20,
		// backgroundColor: 'red',
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
		// alignItems: 'center',
		marginVertical: 25,
		// backgroundColor: 'red',
	},
	button: {
		marginVertical: 40,
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
		marginTop: 20,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '80%',
	},
	headerText: {
		// textAlign: 'center',
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
		// fontFamily: 'NunitoSans-Bold',
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

export default MyProfileScreen;
