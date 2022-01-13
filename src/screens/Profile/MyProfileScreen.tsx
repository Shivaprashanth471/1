import React, {useState, useCallback, useEffect} from 'react';
import {
	StatusBar,
	StyleSheet,
	View,
	Alert,
	Text,
	TextInput,
} from 'react-native';
import {
	BaseViewComponent,
	CustomButton,
	FormikRadioGroupComponent,
	ErrorComponent,
	LoadingComponent,
	KeyboardAvoidCommonView,
} from '../../components/core';
import {useSelector} from 'react-redux';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../helpers';
import {Colors, ENV, FontConfig} from '../../constants';
import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import FormikInputComponent from '../../components/core/FormikInputComponent';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import {StateParams} from '../../store/reducers';
import DropdownComponent from '../../components/core/DropdownComponent';
import {currentList, regionsList} from '../../constants/CommonVariables';

const profileSchema = yup.object().shape({
	hcp_type: yup.string().required('Required'),
	region: yup.string().required('Required'),
	Experience: yup.string().required('Required'),
});

export interface ProfileSchemaType {
	hcp_type: string;
	region: string;
	Experience?: string;
	primarySpeciality?: string;
	shift_type_preference: string;
}

const initialValues: ProfileSchemaType = {
	hcp_type: '',
	region: '',
	Experience: '',
	primarySpeciality: '',
	shift_type_preference: '',
};

const MyProfileScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [profile, setProfile]: any = useState();
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;

	const [disableBtn, setDisableBtn] = useState<boolean>(true);

	const getProfileDetails = useCallback(() => {
		setIsLoading(true);
		if (user) {
			ApiFunctions.get(ENV.apiUrl + 'hcp/' + HcpUser._id + '/profile')
				.then(async resp => {
					if (resp) {
						setProfile(resp.data);
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
					Alert.alert('Error', err.error || 'Oops... Something went wrong!');
				});
		}
	}, [user]);
	useEffect(() => {
		console.log('loading get profile');
		getProfileDetails();
	}, [getProfileDetails]);

	const updateProfileDetails = (
		values: ProfileSchemaType,
		formikHelpers: FormikHelpers<ProfileSchemaType>,
	) => {
		// setIsLoading(true);
		formikHelpers.setSubmitting(true);
		delete values.primarySpeciality;
		delete values.Experience;

		const payload = {...values};
		console.log('>>>', payload);
		// formikHelpers.setSubmitting(false);
		console.log('HcpUser._id', HcpUser._id);
		values.primarySpeciality = profile.professional_details.speciality;
		values.Experience = profile.professional_details.experience.toString();

		if (HcpUser) {
			ApiFunctions.put(ENV.apiUrl + 'hcp/' + HcpUser._id + '/profile', payload)
				.then(async (resp: TSAPIResponseType<ProfileSchemaType>) => {
					formikHelpers.setSubmitting(false);
					if (resp.success) {
						ToastAlert.show('Profile Successfully Updated');
						setDisableBtn(true);
						// getProfileDetails();
					} else {
						ToastAlert.show(resp.error || '');
					}
					// setIsLoading(false);
					// setIsLoaded(true);
				})
				.catch((err: any) => {
					// setIsLoading(false);
					// setIsLoaded(true);
					formikHelpers.setSubmitting(false);
					CommonFunctions.handleErrors(err, formikHelpers.setErrors);
				});
		}
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
											hcp_type: profile.hcp_type,
											region: profile.region,
											Experience: profile.total_exp.toString(),
											// primarySpeciality: profile.specializations,
											shift_type_preference:
												profile.shift_type_preference || '',
										},
									}}>
									{({handleSubmit, isValid, isSubmitting, values}) => (
										<>
											<Field name={'hcp_type'}>
												{(field: FieldProps) => (
													<DropdownComponent
														contentWrapper={{marginHorizontal: 0}}
														// @ts-ignore
														data={currentList}
														labelText={'Current Role'}
														placeholder={'select the value'}
														formikField={field}
														search={false}
														disabled={false}
														onUpdate={e => {
															console.log('here', e);
															setDisableBtn(false);
														}}
													/>
												)}
											</Field>
											<Field name={'region'}>
												{(field: FieldProps) => (
													<DropdownComponent
														contentWrapper={{marginHorizontal: 0}}
														// @ts-ignore
														data={regionsList}
														labelText={'region'}
														placeholder={'select the value'}
														formikField={field}
														search={false}
														disabled={false}
														onUpdate={() => {
															console.log('here');
															setDisableBtn(false);
														}}
													/>
												)}
											</Field>
											<Field name={'Experience'}>
												{(field: FieldProps) => (
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
														onUpdate={() => {
															console.log('here');
															setDisableBtn(false);
														}}
													/>
												)}
											</Field>
											{/* <Field name={'primarySpeciality'}>
												{(field: FieldProps) => (
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
														onUpdate={() => {
															console.log('here');
															setDisableBtn(false);
														}}
													/>
												)}
											</Field> */}

											<View
												style={{
													marginVertical: 5,
												}}>
												<Text
													style={{
														color: Colors.textLight,
														marginVertical: 5,
													}}>
													Speciality
												</Text>
												{profile.specializations && (
													<>
														{profile.specializations.map(
															(item: any) => (
																console.log('>>>>', item),
																(
																	<>
																		<TextInput
																			placeholderTextColor={Colors.textLight}
																			style={{
																				width: '100%',
																				paddingHorizontal: 0,
																				color: Colors.textDark,
																				fontFamily: FontConfig.primary.semiBold,
																				fontSize: 18,
																				borderBottomColor: Colors.borderColor,
																				borderBottomWidth: 2,
																			}}
																			value={item}
																			autoCapitalize={'none'}
																			autoCorrect={false}
																			autoCompleteType={'off'}
																		/>
																	</>
																)
															),
														)}
													</>
												)}
											</View>
											<Field name={'shift_type_preference'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														labelText={'Shift Prefer'}
														radioButtons={[
															{id: 'AM', title: 'AM'},
															{id: 'PM', title: 'PM'},
															{id: 'NOC', title: 'NOC'},
														]}
														direction={'column'}
														onUpdate={() => {
															console.log('here');
															setDisableBtn(false);
														}}
													/>
												)}
											</Field>
											<View
												style={{
													flexDirection: 'row',
													marginTop: 20,
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
															fontSize: 16,
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
														disabled={disableBtn}
														textStyle={{
															textTransform: 'none',
															fontFamily: FontConfig.primary.bold,
															fontSize: 16,
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
			)}
		</>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
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
		marginVertical: 25,
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
		width: '80%',
	},
	headerText: {
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
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
