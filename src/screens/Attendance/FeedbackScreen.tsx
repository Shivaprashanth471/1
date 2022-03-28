import React, {useState, useEffect, useCallback} from 'react';
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	Alert,
	Platform,
	KeyboardAvoidingView,
} from 'react-native';
import {
	ApiFunctions,
	CommonStyles,
	ToastAlert,
	CommonFunctions,
} from '../../helpers';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import {AirbnbRating} from 'react-native-ratings';
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
	FormikInputComponent,
	KeyboardAvoidCommonView,
} from '../../components/core';
import * as yup from 'yup';

const FeedbackSchema = yup.object().shape({});

export interface FeedbackType {
	experience: string;
}

const initialValues: FeedbackType = {
	experience: '',
};

const FeedbackScreen = (props: any) => {
	const navigation = props.navigation;
	const {shiftID} = props.route.params;
	const [shiftDetails, setShiftDetails] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [focusText, setFocusText] = useState<boolean>(false);
	const [rating, setRating] = useState<any>(0);
	// console.log(shiftID);

	const updateShiftFeedbackDetails = useCallback(
		(values: FeedbackType, formikHelpers: FormikHelpers<FeedbackType>) => {
			formikHelpers.setSubmitting(true);
			const payload = {
				experience: values.experience,
				facility_rating: rating,
			};
			ApiFunctions.put(ENV.apiUrl + 'shift/' + shiftID, payload)
				.then(async (resp: TSAPIResponseType<FeedbackType>) => {
					formikHelpers.setSubmitting(false);
					if (resp.success) {
						navigation.navigate(NavigateTo.ThankYouScreen);
					} else {
						ToastAlert.show(resp.error || '');
					}
				})
				.catch((err: any) => {
					formikHelpers.setSubmitting(false);
					CommonFunctions.handleErrors(err, formikHelpers.setErrors);
					console.log(err);
				});
		},
		[navigation, rating, shiftID],
	);

	const getShiftDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'shift/' + shiftID)
			.then(async resp => {
				if (resp) {
					setShiftDetails(resp.data);
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

	console.log(focusText, 'focussing the text');

	useEffect(() => {
		getShiftDetails();
	}, [getShiftDetails]);

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !shiftDetails && <ErrorComponent />}
			{!isLoading && isLoaded && shiftDetails && (
				<KeyboardAvoidCommonView>
					<BaseViewComponent
						style={[
							styles.screen,
							{marginBottom: Platform.OS === 'ios' ? (focusText ? 150 : 0) : 0},
						]}
						contentContainerStyle={{
							flexGrow: 1,
							// marginBottom: focusText ? 150 : 0,
						}}>
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

						<View style={[CommonStyles.flexCenter, {marginTop: 15}]}>
							<Text
								style={{
									fontFamily: FontConfig.primary.semiBold,
									fontSize: 20,
								}}>
								{shiftDetails.facility.facility_name}
							</Text>
						</View>
						<AirbnbRating
							reviewSize={16}
							defaultRating={
								shiftDetails.shift_rating ? shiftDetails.shift_rating : 0
							}
							size={20}
							onFinishRating={rating => {
								setRating(rating);
							}}
							count={5}
							reviews={[
								'Bad',
								'Not Satisfactory',
								'Satisfactory',
								'Good',
								'Excellent',
							]}
							reviewColor={'#2CD3C2'}
						/>
						<View style={[styles.formBlock]}>
							<View style={[styles.formHolder]}>
								<Formik
									onSubmit={updateShiftFeedbackDetails}
									validationSchema={FeedbackSchema}
									validateOnBlur={true}
									initialValues={{
										...initialValues,
										...{
											experience: shiftDetails.experience_details
												? shiftDetails.experience_details.experience
												: '',
										},
									}}>
									{({handleSubmit, isSubmitting}) => (
										<View>
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
													Please add your comments below
												</Text>
												<View
													style={{
														backgroundColor: 'blue',
														width: 100,
														height: 4,
														borderRadius: 500,
														marginTop: 5,
													}}
												/>
											</View>
											<View style={{}}>
												<Field name={'experience'}>
													{(field: FieldProps) => (
														<FormikInputComponent
															inputProperties={{
																onFocus: () => {
																	setFocusText(true);
																},
																onBlur: () => {
																	setFocusText(false);
																},
																multiline: true,
																keyboardType: 'default',
																placeholder:
																	'Tell us more about your experience',
															}}
															style={{
																backgroundColor: Colors.backgroundShiftColor,
																height: 150,
																padding: 0,
																borderRadius: 10,
																marginHorizontal: 5,
															}}
															inputStyles={{
																fontSize: 16,
															}}
															formikField={field}
														/>
													)}
												</Field>
											</View>
											<View>
												<CustomButton
													isLoading={isSubmitting}
													title={'Submit your feedback'}
													onPress={() => {
														if (rating === 0) {
															ToastAlert.show('Please rate the facility');
														} else {
															handleSubmit();
														}
													}}
													style={{
														width: '100%',
														height: 50,
														marginTop: 20,
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
					</BaseViewComponent>
				</KeyboardAvoidCommonView>
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
		marginTop: 10,
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
