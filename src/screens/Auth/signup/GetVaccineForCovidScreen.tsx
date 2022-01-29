import React, {useCallback, useEffect, useState} from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
} from 'react-native';
import {ApiFunctions, ToastAlert, CommonFunctions} from '../../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	NavigateTo,
	ImageConfig,
} from '../../../constants';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import {
	BaseViewComponent,
	ErrorComponent,
	LoadingComponent,
	CustomButton,
	FormikRadioGroupComponent,
	FormikDatepickerComponent,
} from '../../../components/core';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../../helpers/ApiFunctions';
import Moment from 'moment';

const GetVaccineForCovid = yup.object().shape({
	is_vaccinated: yup.string().required('Required'),
});

export interface GetVaccineForCovidType {
	is_vaccinated: boolean;
	first_shot: any;
	latest_shot: any;
}

const initialValues: GetVaccineForCovidType = {
	is_vaccinated: false,
	first_shot: '',
	latest_shot: '',
};

const GetVaccineForCovidScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {GetHcpBasicDetailsPayload}: any = props.route.params;
	const [hcpDetails, setHcpDetails]: any = useState<null | {}>({});
	const [selectPickerModalVisible, setSelectPickerModalVisible] =
		useState<boolean>(false);

	const [loadingPercent, setLoadingPercent]: any = useState(71.42);
	const navigation = props.navigation;

	const updateShiftPreferenceDetails = (
		values: GetVaccineForCovidType,
		formikHelpers: FormikHelpers<GetVaccineForCovidType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			nc_details: {
				is_certified_to_practice:
					hcpDetails.nc_details.is_certified_to_practice,
				is_vaccinated: values.is_vaccinated,
				vaccination_dates: {
					first_shot:
						values.is_vaccinated === true
							? Moment(values.first_shot).format('MM-DD-YYYY')
							: hcpDetails.nc_details.vaccination_dates.first_shot,
					latest_shot:
						values.is_vaccinated === true
							? Moment(values.latest_shot).format('MM-DD-YYYY')
							: hcpDetails.nc_details.vaccination_dates.latest_shot,
				},
				is_authorized_to_work: hcpDetails.nc_details.is_authorized_to_work,
				is_require_employment_sponsorship:
					hcpDetails.nc_details.is_require_employment_sponsorship,
				travel_preferences: hcpDetails.nc_details.travel_preferences,
				dnr: '',
				shift_type_preference: '',
				location_preference: '',
				more_important_preference: '',
				family_consideration: '',
				zone_assignment: '',
				vaccine: '',
				covid_facility_preference: '',
				is_fulltime_job: '',
				is_supplement_to_income: '',
				is_studying: '',
				is_gusto_invited: '',
				is_gusto_onboarded: '',
				gusto_type: '',
				last_call_date: '',
				contact_type: '',
				other_information: '',
			},
		};
		ApiFunctions.put(ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload, payload)
			.then(async (resp: TSAPIResponseType<GetVaccineForCovidType>) => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					setSelectPickerModalVisible(false);
					navigation.navigate(NavigateTo.GetLegallyAuthorisedToWorkScreen, {
						GetHcpBasicDetailsPayload: GetHcpBasicDetailsPayload,
					});
				} else {
					ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
				console.log('>>', err);
			});
	};

	const getHcpDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload)
			.then(resp => {
				if (resp && resp.success) {
					setHcpDetails(resp.data);
				} else {
					console.log('Error', resp.error);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				console.log(err);
			});
	}, [GetHcpBasicDetailsPayload]);

	useEffect(() => {
		console.log('loading HCP details.....');
		getHcpDetails();
	}, [getHcpDetails]);

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !setHcpDetails && (
				<ErrorComponent text={'HCP details not available'} />
			)}
			{!isLoading && isLoaded && setHcpDetails && (
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
							<Text
								style={{
									fontFamily: FontConfig.primary.semiBold,
									color: Colors.textDark,
									fontSize: 16,
								}}>
								Profile
							</Text>
							<View
								style={{
									width: loadingPercent + '%',
									backgroundColor: Colors.approved,
									height: 4,
									borderRadius: 8,
									marginBottom: 20,
								}}
							/>
							<View style={{}}>
								<Text style={styles.headerText}>
									Are you vaccinated for COVID
								</Text>
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
									validationSchema={GetVaccineForCovid}
									validateOnBlur={true}
									initialValues={{
										...initialValues,
										...{
											is_vaccinated: hcpDetails.nc_details.is_vaccinated,
											first_shot:
												hcpDetails.nc_details.vaccination_dates.first_shot != ''
													? Moment(
															hcpDetails.nc_details.vaccination_dates
																.first_shot,
															'MM-DD-YYYY',
													  ).format('YYYY-MM-DD')
													: '',
											latest_shot:
												hcpDetails.nc_details.vaccination_dates.first_shot != ''
													? Moment(
															hcpDetails.nc_details.vaccination_dates
																.latest_shot,
															'MM-DD-YYYY',
													  ).format('YYYY-MM-DD')
													: '',
										},
									}}>
									{({handleSubmit, isValid, isSubmitting, values}) => (
										// console.log(values.first_shot, '<><><><>'),
										<View
											style={{
												justifyContent: 'space-between',
											}}>
											<Field name={'is_vaccinated'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														// labelText={'Shift Prefer'}
														radioButtons={[
															{id: true, title: 'Yes'},
															{id: false, title: 'No'},
														]}
														direction={'column'}
													/>
												)}
											</Field>
											<View style={styles.ModalContainer}>
												<Modal
													animationType="slide"
													transparent={true}
													visible={selectPickerModalVisible}
													onRequestClose={() => {
														setSelectPickerModalVisible(
															!selectPickerModalVisible,
														);
													}}>
													<View
														style={[
															styles.centeredView,
															{backgroundColor: '#000000A0'},
														]}>
														<View style={styles.modalView}>
															<View
																style={{
																	width: '100%',
																	alignItems: 'flex-end',
																	paddingHorizontal: 20,
																	paddingTop: 10,
																}}>
																<TouchableOpacity
																	onPress={() => {
																		navigation.navigate(
																			NavigateTo.GetLegallyAuthorisedToWorkScreen,
																			{
																				GetHcpBasicDetailsPayload:
																					GetHcpBasicDetailsPayload,
																			},
																		);
																		setSelectPickerModalVisible(
																			!selectPickerModalVisible,
																		);
																	}}>
																	<Text
																		style={{
																			color: Colors.textOnAccent,
																			fontFamily: FontConfig.primary.bold,
																			fontSize: 14,
																		}}>
																		Skip{' >'}
																	</Text>
																</TouchableOpacity>
															</View>
															<Text
																style={[styles.modalTextTitle, {fontSize: 24}]}>
																Add Vaccination dates
															</Text>
															<View
																style={{
																	width: '100%',
																}}>
																<Field name={'first_shot'}>
																	{(field: FieldProps) => (
																		<FormikDatepickerComponent
																			formikField={field}
																			maxDate={Moment().format('YYYY-MM-DD')}
																			labelDarkText={'First Shot'}
																			style={{
																				width: '100%',
																			}}
																		/>
																	)}
																</Field>
																<View
																	style={{
																		marginVertical: 20,
																	}}
																/>
																<Field name={'latest_shot'}>
																	{(field: FieldProps) => (
																		<FormikDatepickerComponent
																			formikField={field}
																			maxDate={Moment().format('YYYY-MM-DD')}
																			labelDarkText={'Latest Shot'}
																			style={{
																				width: '100%',
																			}}
																		/>
																	)}
																</Field>
																<CustomButton
																	isLoading={isSubmitting}
																	title={'Save'}
																	onPress={() => {
																		handleSubmit();
																	}}
																	style={{
																		backgroundColor: Colors.primary,
																		marginTop: 50,
																	}}
																	disabled={
																		values.first_shot === '' ||
																		values.latest_shot === ''
																			? true
																			: false
																	}
																/>
															</View>
														</View>
													</View>
												</Modal>
											</View>
											<CustomButton
												isLoading={isSubmitting}
												title={'Continue'}
												onPress={() => {
													if (values.is_vaccinated) {
														setSelectPickerModalVisible(true);
													} else {
														handleSubmit();
													}
												}}
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
			)}
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
	//
	ModalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalView: {
		backgroundColor: 'white',
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
		width: '100%',
		height: '50%',
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalTextTitle: {
		fontFamily: FontConfig.primary.bold,
		color: Colors.textOnInput,
		marginBottom: 5,
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
		marginVertical: 14,
		fontSize: 14,
	},
	modalTime: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textOnAccent,
		marginTop: 15,
	},
	dateText: {
		fontFamily: FontConfig.primary.regular,
		color: Colors.textDark,
		fontSize: 15,
	},
	uploadText: {
		fontSize: 14,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
		marginTop: 10,
	},
});

export default GetVaccineForCovidScreen;
