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
import FormikInputComponent from '../../../components/core/FormikInputComponent';
import PickerComponent from '../../../components/core/PickerComponent';
import {
	BaseViewComponent,
	EditableTextInput,
	ErrorComponent,
	LoadingComponent,
	CustomButton,
	FormikRadioGroupComponent,
} from '../../../components/core';
import {StateParams} from '../../../store/reducers';
import moment from 'moment';
import {Picker} from '@react-native-community/picker';
import * as yup from 'yup';

const profileSchema = yup.object().shape({
	CurrentRole: yup.string().required('Required'),
	Experience: yup.string().required('Required'),
	About: yup.string().required('Required'),
});

export interface ProfileSchemaType {
	CurrentRole: string;
	Experience: string;
	About: string;
}

const initialValues: ProfileSchemaType = {
	CurrentRole: '',
	Experience: '',
	About: '',
};

const MyProfileProfessionalDetails = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile] = useState<any[] | null>();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	const [loadingPercent, setLoadingPercent]: any = useState(20);
	const {hcpType} = props.route.params;
	const [specialitiesMaster, setSpecialitiesMaster] = useState<any>([]);

	const gotoGetCurrentRole = () => {
		navigation.navigate(NavigateTo.MyProfileCreationCurrentRole);
	};

	// const getSpecialities = useCallback(() => {
	// 	ApiFunctions.get(ENV.apiUrl + 'meta/hcp-specialities')
	// 		.then((resp) => {
	// 			setSpecialitiesMaster(resp.data || []);
	// 			console.log('>>>>>>>>>>>>>>>>>>.', resp.data);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// }, []);

	// useEffect(() => {
	// 	console.log('loading get profile main screen');
	// 	getSpecialities();
	// }, [getSpecialities]);

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
	const [numOfLinesCompany, setNumOfLinesCompany]: any = useState(0);
	return (
		<>
			<BaseViewComponent isLoading={true} loadingPercent={loadingPercent}>
				<StatusBar
					barStyle={'light-content'}
					animated={true}
					backgroundColor={Colors.backdropColor}
				/>
				<View style={styles.screen}>
					<Text style={CommonStyles.pageTitle}>Professional Details</Text>
					{/* <Text style={styles.pageSubTitle}>
						Lorem ipsum dolor sit amet,consectetur adipiscing elit,
					</Text> */}
					<View style={styles.formBlock}>
						<View style={styles.formHolder}>
							<Formik
								onSubmit={updateProfileDetails}
								validationSchema={profileSchema}
								validateOnBlur={true}
								initialValues={{
									...initialValues,
									...{
										CurrentRole: '',
										Experience: '',
									},
								}}>
								{({handleSubmit, isValid, isSubmitting}) => (
									<>
										{hcpType === 'LVN' && (
											<Field name={'CurrentRole'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														labelText={'Speciality'}
														radioButtons={[
															{
																id: 'acute_care_hospital',
																title: 'Acute Care(Hospital)',
																disabled: false,
															},
															{
																id: 'skilled_nursing',
																title: 'Skilled Nurse/Assisted Living',
																disabled: false,
															},
															{
																id: 'behavioural_health',
																title: 'Behavioural Health',
																disabled: false,
															},
															{
																id: 'home_health',
																title: 'Home Health',
																disabled: false,
															},
															{
																id: 'sub_acute',
																title: 'Sub Acute',
																disabled: false,
															},
															{
																id: 'long_term_acute_care',
																title: 'Long Term Acute Care',
																disabled: false,
															},
															{
																id: 'other',
																title: 'Other',
																disabled: false,
															},
														]}
														direction={'column'}
													/>
												)}
											</Field>
										)}

										{hcpType === 'CNA' && (
											<Field name={'CurrentRole'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														labelText={'Speciality'}
														radioButtons={[
															{
																id: 'acute_care_hospital',
																title: 'Acute Care(Hospital)',
																disabled: false,
															},
															{
																id: 'skilled_nursing',
																title: 'Skilled Nurse/Assisted Living',
																disabled: false,
															},
															{
																id: 'behavioural_health',
																title: 'Behavioural Health',
																disabled: false,
															},
															{
																id: 'home_health',
																title: 'Home Health',
																disabled: false,
															},
															{
																id: 'other',
																title: 'Other',
																disabled: false,
															},
														]}
														direction={'column'}
													/>
												)}
											</Field>
										)}
										{hcpType === 'RN' && (
											<Field name={'CurrentRole'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														labelText={'Speciality'}
														radioButtons={[
															{
																id: 'cardiovascular_intensive_care_rn_cvicu_rn',
																title:
																	'Cardiovascular intensive Care RN (cvicu-rn)',
																disabled: false,
															},
															{
																id: 'catheterization_laboratory_cath_lab',
																title: 'Catheterization Laboratory (Cath Lab)',
																disabled: false,
															},
															{
																id: 'emergency_department_eder',
																title: 'Emergency Department (ED/ER)',
																disabled: false,
															},
															{
																id: 'intensive_care_unit_icu',
																title: 'Intensive Care Unit (ICU)',
																disabled: false,
															},
															{
																id: 'ip_behavioral_health_rn',
																title: 'IP Behavioral Health RN',
																disabled: false,
															},
															{
																id: 'ip_conscious_sedation',
																title: 'IP Conscious Sedation',
																disabled: false,
															},
															{
																id: 'ip_dialysis_rn',
																title: 'IP Dialysis RN',
																disabled: false,
															},
															{
																id: 'ip_interventional_radiology_rn',
																title: 'IP Interventional Radiology RN',
																disabled: false,
															},
															{
																id: 'ip_operating_room_circulator',
																title: 'IP Operating Room Circulator',
																disabled: false,
															},
															{
																id: 'ip_post_anesthesia_care_unit_pacu',
																title: 'IP Post-Anesthesia Care Unit (PACU)',
																disabled: false,
															},
															{
																id: 'ip_pre_operativepre_op',
																title: 'IP Pre-Operative(Pre-Op)',
																disabled: false,
															},
															{
																id: 'labor_and_delivery_landd',
																title: 'Labor and Delivery (L&D)',
																disabled: false,
															},
															{
																id: 'long_term_acute_careltach',
																title: 'Long Term Acute Care(LTACH)',
																disabled: false,
															},
															{
																id: 'medical_intensice_care_unit_rn_micu_rn',
																title:
																	'Medical Intensice Care Unit RN (micu-rn)',
																disabled: false,
															},
															{
																id: 'medical_surgicalmed_surg',
																title: 'Medical-Surgical(Med-Surg)',
																disabled: false,
															},
															{
																id: 'neonatal_intensive_care_unit_nicu',
																title: 'Neonatal Intensive Care Unit (NICU)',
																disabled: false,
															},
															{
																id: 'neuro_intensive_care_unit_rnneuro_icu_rn',
																title:
																	'Neuro Intensive Care Unit RN(neuro-icu-rn)',
																disabled: false,
															},
															{
																id: 'nursery_rn',
																title: 'Nursery RN',
																disabled: false,
															},
															{
																id: 'occ_helath_rn',
																title: 'Occ Helath RN',
																disabled: false,
															},
															{
																id: 'op_behavioural_health_rn',
																title: 'OP Behavioural Health RN',
																disabled: false,
															},
															{
																id: 'op_conscious_sedation',
																title: 'OP Conscious Sedation',
																disabled: false,
															},
															{
																id: 'op_dialysis_rn',
																title: 'OP Dialysis RN',
																disabled: false,
															},
															{
																id: 'op_interventional_radiology_rn',
																title: 'OP Interventional Radiology RN',
																disabled: false,
															},
															{
																id: 'op_operating_room_circulator',
																title: 'OP Operating Room Circulator',
																disabled: false,
															},
															{
																id: 'op_post_anesthesia_care_unit_pacu',
																title: 'OP Post-Anesthesia Care Unit (PACU)',
																disabled: false,
															},
															{
																id: 'op_pre_operativepre_op',
																title: 'OP Pre-Operative(Pre-op)',
																disabled: false,
															},
															{
																id: 'pediatric_intensive_care_unitpicu',
																title: 'Pediatric Intensive Care Unit(PICU)',
																disabled: false,
															},
															{
																id: 'pediatricpeds',
																title: 'Pediatric(Peds)',
																disabled: false,
															},
															{
																id: 'rehabilitation',
																title: 'Rehabilitation',
																disabled: false,
															},
															{
																id: 'skilled_nursing',
																title: 'Skilled Nursing',
																disabled: false,
															},
															{
																id: 'stepdown_unitsdu',
																title: 'Stepdown Unit(SDU)',
																disabled: false,
															},
															{
																id: 'surgical_intensive_care_unit_rnsicu_rn',
																title:
																	'Surgical Intensive Care Unit RN(sicu-rn)',
																disabled: false,
															},
															{
																id: 'telemetry_tele',
																title: 'Telemetry (Tele)',
																disabled: false,
															},
															{
																id: 'transplant_icu_rntransplant_icu',
																title: 'Transplant ICU RN(transplant-icu)',
																disabled: false,
															},
															{
																id: 'trauma_intensive_care_unit_rnticu_rn',
																title: 'Trauma Intensive Care Unit RN(ticu-rn)',
																disabled: false,
															},
														]}
														direction={'column'}
													/>
												)}
											</Field>
										)}
										<View
											style={{
												marginVertical: 10,
											}}></View>
										<Field name={'Experience'}>
											{(field: FieldProps) => (
												<PickerComponent
													style={{width: '100%'}}
													labelText={'Years of experience'}
													mode={'dialog'}
													enabled={true}
													formikField={field}>
													<Picker.Item label="" value="" />
													<Picker.Item label="0" value="0" />
													<Picker.Item label="1" value="1" />
													<Picker.Item label="2" value="2" />
													<Picker.Item label="3" value="3" />
													<Picker.Item label="4" value="4" />
													<Picker.Item label="5" value="5" />
													<Picker.Item label="6" value="6" />
													<Picker.Item label="7" value="7" />
													<Picker.Item label="8" value="8" />
													<Picker.Item label="9" value="9" />
													<Picker.Item label="10" value="10" />
													<Picker.Item label="11" value="11" />
													<Picker.Item label="12" value="12" />
													<Picker.Item label="13" value="13" />
													<Picker.Item label="14" value="14" />
													<Picker.Item label="15" value="15" />
													<Picker.Item label="16" value="16" />
													<Picker.Item label="17" value="17" />
													<Picker.Item label="18" value="18" />
													<Picker.Item label="19" value="19" />
													<Picker.Item label="20" value="20" />
													<Picker.Item label="21" value="21" />
													<Picker.Item label="22" value="22" />
													<Picker.Item label="23" value="23" />
													<Picker.Item label="24" value="24" />
													<Picker.Item label="25" value="25" />
													<Picker.Item label="26" value="26" />
													<Picker.Item label="27" value="27" />
													<Picker.Item label="28" value="28" />
													<Picker.Item label="29" value="29" />
													<Picker.Item label="30" value="30" />
												</PickerComponent>
											)}
										</Field>
										<View
											style={{
												marginVertical: 10,
											}}></View>
										<Field name={'About'}>
											{(field: FieldProps) => (
												<FormikInputComponent
													trimCharacters={true}
													trimSpaces={true}
													trimSpecialCharacters={true}
													labelText="About yourself"
													inputProperties={{
														multiline: true,
														numberOfLines: 6,
														textAlignVertical: 'top',
													}}
													inputStyles={{
														height: 120,
														// maxHeight: 100,
														borderBottomWidth: 0,
														borderWidth: 1,
														borderColor: Colors.borderColor,
														paddingHorizontal: 5,
													}}
													style={
														{
															// marginTop: 20,
														}
													}
													formikField={field}
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
													title={'Save'}
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
									</>
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
		marginVertical: 10,
	},
	button: {
		marginVertical: 40,
		// fontFamily: FontConfig.primary.bold,
		// height: 50,
		width: '100%',
	},
	formBlock: {
		// alignItems: 'center',
		marginVertical: 25,
		// backgroundColor: 'red',
	},
	formHolder: {
		marginHorizontal: 10,
	},
});

export default MyProfileProfessionalDetails;
