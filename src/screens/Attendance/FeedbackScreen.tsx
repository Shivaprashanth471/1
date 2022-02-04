import React, {useState, useEffect, useCallback} from 'react';
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	Alert,
	Modal,
	ScrollView,
} from 'react-native';
import {
	ApiFunctions,
	CommonStyles,
	ToastAlert,
	CommonFunctions,
} from '../../helpers';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import AttendanceStatusBoxComponent from '../../components/AttendanceStatusBoxComponent';
import AttendanceTimelineComponent from '../../components/AttendanceTimelineComponent';
import UploadCDHPComponent from '../../components/UploadCDHPComponent';
import {ShiftDocumentsArray} from '../../constants/CommonVariables';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {
	Colors,
	ENV,
	FontConfig,
	NavigateTo,
	ImageConfig,
} from '../../constants';
import {
	BaseViewComponent,
	CustomButton,
	ErrorComponent,
	LoadingComponent,
	FormikRadioGroupComponent,
	FormikInputComponent,
} from '../../components/core';
import * as yup from 'yup';

const FeedbackSchema = yup.object().shape({
	is_covid_protocols_followed: yup.boolean().required('Required'),
	is_facility_hygienic: yup.boolean().required('Required'),
	is_facility_provided_assistance: yup.boolean().required('Required'),
	experience: yup.string().required('Required'),
});

export interface FeedbackType {
	is_covid_protocols_followed: any;
	is_facility_hygienic: any;
	is_facility_provided_assistance: any;
	experience: string;
}

const initialValues: FeedbackType = {
	is_covid_protocols_followed: '',
	is_facility_hygienic: '',
	is_facility_provided_assistance: '',
	experience: '',
};

const FeedbackScreen = (props: any) => {
	const navigation = props.navigation;
	const {shiftID} = props.route.params;
	const [shiftDetails, setShiftDetails] = useState<any>();
	const [shiftTimeDetails, setShiftTimeDetails] = useState<any>();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [rating, setRating] = useState<any>(0);
	const [showQuestionnaireModal, setShowQuestionnaireModal] =
		useState<boolean>(false);
	console.log(shiftID);
	const [stateBtn, setStateBtn] = useState(true);

	const [viewMode, setViewMode] = useState<'getRating' | 'alreadyRated'>(
		'getRating',
	);
	const [checkInTime, setCheckInTime]: any = useState();
	const [checkOutTime, setCheckOutTime]: any = useState();

	const updateCertifiedToPractiseDetails = (
		values: FeedbackType,
		formikHelpers: FormikHelpers<FeedbackType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			experience_details: {
				...values,
			},
			shift_rating: rating,
		};
		// formikHelpers.setSubmitting(false);
		console.log(payload);

		ApiFunctions.put(ENV.apiUrl + 'shift/' + shiftID, payload)
			.then(async (resp: TSAPIResponseType<FeedbackType>) => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					console.log('resp', resp);
					navigation.navigate(NavigateTo.ThankYouScreen);
					setShowQuestionnaireModal(false);
				} else {
					ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
			});
	};

	// const getShiftDetails = useCallback(() => {
	// 	setIsLoading(true);
	// 	if (shiftID) {
	// 		ApiFunctions.get(ENV.apiUrl + 'shift/' + shiftID)
	// 			.then(async resp => {
	// 				if (resp) {
	// 					setShiftDetails(resp.data);
	// 				} else {
	// 					console.log('error');
	// 				}
	// 				setIsLoading(false);
	// 				setIsLoaded(true);
	// 			})
	// 			.catch((err: any) => {
	// 				setIsLoading(false);
	// 				setIsLoaded(true);
	// 				console.log(err);
	// 			});
	// 	}
	// }, [shiftID]);

	const tConvert = (time: any) => {
		// Check correct time format and split into components
		time = time
			.toString()
			.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

		if (time.length > 1) {
			// If time format correct
			time = time.slice(1); // Remove full string match value
			time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
			time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join(''); // return adjusted time or original string
	};

	const getShiftDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'shift/' + shiftID)
			.then(async resp => {
				if (resp) {
					const checkTime = resp.data.time_breakup
						? tConvert(resp.data.time_breakup.check_in_time.slice(11, 16))
							? tConvert(resp.data.time_breakup.check_in_time.slice(11, 16))
							: ''
						: {};

					setCheckInTime(checkTime);

					const checkOutTime = resp.data.time_breakup
						? tConvert(resp.data.time_breakup.check_out_time.slice(11, 16))
							? tConvert(resp.data.time_breakup.check_out_time.slice(11, 16))
							: ''
						: {};
					setCheckOutTime(checkOutTime);
					setShiftTimeDetails(resp.data.time_breakup);
					setShiftDetails(resp.data);
					// console.log('>>>>>>>>>>>>', resp.data);
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
	}, [shiftID]);

	useEffect(() => {
		getShiftDetails();
		// setRating(0);
		setShowQuestionnaireModal(false);
	}, [getShiftDetails]);

	const modalQuestionnaireView = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={showQuestionnaireModal}
					onRequestClose={() => {
						setShowQuestionnaireModal(!showQuestionnaireModal);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View style={styles.modalView}>
							<AirbnbRating
								count={5}
								reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Good']}
								reviewColor={'#2CD3C2'}
								defaultRating={rating}
								size={20}
							/>
							<View
								style={{
									alignItems: 'center',
									marginVertical: 15,
								}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.regular,
										fontSize: 14,
									}}>
									Were these followed ?
								</Text>
								<View style={styles.underline} />
							</View>
							<ScrollView>
								<View style={[styles.formBlock]}>
									<View style={[styles.formHolder]}>
										<Formik
											onSubmit={updateCertifiedToPractiseDetails}
											validationSchema={FeedbackSchema}
											validateOnBlur={true}
											initialValues={{
												...initialValues,
												...{
													experience: shiftDetails.experience_details
														? shiftDetails.experience_details.experience
														: '',
													is_covid_protocols_followed:
														shiftDetails.experience_details
															? shiftDetails.experience_details
																	.is_covid_protocols_followed
															: '',
													is_facility_hygienic: shiftDetails.experience_details
														? shiftDetails.experience_details
																.is_facility_hygienic
														: '',
													is_facility_provided_assistance:
														shiftDetails.experience_details
															? shiftDetails.experience_details
																	.is_facility_provided_assistance
															: '',
												},
											}}>
											{({
												handleSubmit,
												resetForm,
												values,
												isValid,
												setFieldValue,
												isSubmitting,
											}) => (
												<View>
													<View
														style={{
															flexDirection: 'row',
															justifyContent: 'space-between',
															paddingHorizontal: 10,
														}}></View>
													<View style={{}}>
														<Field name={'is_covid_protocols_followed'}>
															{(field: FieldProps) => (
																<FormikRadioGroupComponent
																	formikField={field}
																	labelDarkText={
																		'Was the facility following covid protocol?'
																	}
																	textStyle={{
																		color: Colors.primary,
																	}}
																	style={{
																		height: 40,
																	}}
																	radioButtons={[
																		{
																			id: true,
																			title: 'Yes',
																		},
																		{
																			id: false,
																			title: 'No',
																		},
																	]}
																	direction={'column'}
																/>
															)}
														</Field>
														<Field name={'is_facility_hygienic'}>
															{(field: FieldProps) => (
																<FormikRadioGroupComponent
																	formikField={field}
																	labelDarkText={'Was the facility hygienic?'}
																	textStyle={{
																		color: Colors.primary,
																	}}
																	style={{
																		height: 40,
																	}}
																	radioButtons={[
																		{
																			id: true,
																			title: 'Yes',
																		},
																		{
																			id: false,
																			title: 'No',
																		},
																	]}
																	direction={'column'}
																/>
															)}
														</Field>
														<Field name={'is_facility_provided_assistance'}>
															{(field: FieldProps) => (
																<FormikRadioGroupComponent
																	formikField={field}
																	labelDarkText={
																		'Was the facility helpful in work assitance?'
																	}
																	textStyle={{
																		color: Colors.primary,
																	}}
																	style={{
																		height: 40,
																	}}
																	radioButtons={[
																		{
																			id: true,
																			title: 'Yes',
																		},
																		{
																			id: false,
																			title: 'No',
																		},
																	]}
																	direction={'column'}
																/>
															)}
														</Field>
														<Field name={'experience'}>
															{(field: FieldProps) => (
																<FormikInputComponent
																	inputProperties={{
																		multiline: true,
																		keyboardType: 'default',
																		placeholder:
																			'Tell us more about your experience',
																		maxLength: 300,
																	}}
																	style={{
																		backgroundColor:
																			Colors.backgroundShiftColor,
																		height: 100,
																		padding: 0,
																		borderRadius: 10,
																	}}
																	inputStyles={{
																		fontSize: 16,
																	}}
																	formikField={field}
																/>
															)}
														</Field>
													</View>
													<View
														style={{
															flexDirection: 'row',
															marginHorizontal: 10,
															justifyContent: 'space-between',
															marginTop: 10,
														}}>
														<CustomButton
															isLoading={isSubmitting}
															title={'Submit your feedback'}
															onPress={() => {
																handleSubmit();
																// navigation.navigate(NavigateTo.ThankYouScreen);
															}}
															style={{
																width: '100%',
																height: 50,
																marginBottom: 50,
															}}
															textStyle={{
																textTransform: 'capitalize',
															}}
														/>
													</View>
												</View>
											)}
										</Formik>
									</View>
								</View>
							</ScrollView>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	return (
		<>
			{viewMode === 'getRating' && (
				<>
					{isLoading && <LoadingComponent />}
					{!isLoading && isLoaded && !shiftDetails && <ErrorComponent />}
					{!isLoading && isLoaded && shiftDetails && (
						<BaseViewComponent style={styles.screen}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<View style={styles.imageContainer}>
								<ImageConfig.Building
									style={{
										width: 220,
										height: 220,
									}}
								/>
							</View>
							<View
								style={[
									CommonStyles.flexCenter,
									{
										marginVertical: 20,
									},
								]}>
								<Text
									style={{
										fontFamily: FontConfig.primary.regular,
										fontSize: 14,
									}}>
									Rate your experience
								</Text>
								<View style={styles.underline} />
							</View>

							<View style={[CommonStyles.flexCenter, {marginVertical: 20}]}>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 20,
									}}>
									{shiftDetails.facility.facility_name}
								</Text>
							</View>
							<AirbnbRating
								count={5}
								reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Great !']}
								reviewColor={'#2CD3C2'}
								reviewSize={16}
								defaultRating={
									shiftDetails.shift_rating ? shiftDetails.shift_rating : 0
								}
								size={20}
								onFinishRating={rating => {
									setRating(rating);
									setShowQuestionnaireModal(true);
								}}
								showRating={false}
							/>
							<View
								style={{
									alignItems: 'center',
									marginTop: 150,
								}}>
								<Text
									style={{
										color: Colors.textLight,
										fontFamily: FontConfig.primary.regular,
										fontSize: 14,
									}}>
									Your word makes the facility a better place
								</Text>
							</View>

							{modalQuestionnaireView()}
						</BaseViewComponent>
					)}
				</>
			)}
			{viewMode === 'alreadyRated' && (
				<>
					{isLoading && <LoadingComponent />}
					{!isLoading && isLoaded && !shiftDetails && <ErrorComponent />}
					{!isLoading && isLoaded && shiftDetails && (
						<BaseViewComponent
							style={styles.screen}
							backgroundColor={Colors.backgroundShiftColor}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<View style={styles.timeSheetContainer}>
								<Text style={styles.timeLineText}>Timeline</Text>
								<AttendanceStatusBoxComponent
									status={'CheckIn'}
									time={checkInTime}
								/>
								<AttendanceTimelineComponent shiftID={shiftID} />
								<AttendanceStatusBoxComponent
									status={'Check-Out'}
									time={checkOutTime}
								/>
							</View>
							<View>
								{ShiftDocumentsArray.map((item: any) => (
									<>
										<UploadCDHPComponent
											title={item}
											shiftID={shiftID}
											state={setStateBtn}
											showOnlyDocument={true}
										/>
									</>
								))}
							</View>
							<View
								style={{
									marginHorizontal: 20,
									marginTop: 50,
								}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 18,
										color: Colors.textDark,
									}}>
									Review
								</Text>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 14,
										color: Colors.textDark,
									}}>
									{rating}/5
								</Text>
								<View
									style={{
										alignItems: 'flex-start',
										marginVertical: 5,
									}}>
									<AirbnbRating
										count={5}
										defaultRating={rating}
										size={24}
										showRating={false}
										isDisabled={true}
									/>
								</View>
								<Text
									style={{
										fontFamily: FontConfig.primary.italic,
										fontSize: 14,
										color: Colors.textLight,
										marginTop: 10,
									}}>
									You will be notified after your application has been approved
									by the facility
								</Text>
							</View>
						</BaseViewComponent>
					)}
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	imageContainer: {
		flex: 1,
		backgroundColor: Colors.backgroundShiftColor,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 10,
		borderRadius: 20,
	},
	underline: {
		backgroundColor: 'blue',
		width: 50,
		height: 4,
		borderRadius: 500,
		marginTop: 5,
	},
	formBlock: {
		marginHorizontal: 10,
		flex: 3,
	},
	formHolder: {
		flex: 1,
	},

	// modal
	ModalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: 'white',
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		// padding: 20,
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
		height: '70%',
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
		width: '70%',
	},
	modalTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textOnAccent,
		marginTop: 15,
		marginBottom: 10,
	},
	///

	timeSheetContainer: {
		padding: 20,
	},
	timeLineText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
	},
});

export default FeedbackScreen;
