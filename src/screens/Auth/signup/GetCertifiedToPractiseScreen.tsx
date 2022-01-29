import React, {useCallback, useEffect, useState} from 'react';
import {
	Alert,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
} from 'react-native';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../../helpers';
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
} from '../../../components/core';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../../helpers/ApiFunctions';
import DocumentPicker from 'react-native-document-picker';

const GetCertifiedToPractise = yup.object().shape({
	is_certified_to_practice: yup.string().required('Required'),
});

export interface GetCertifiedToPractiseType {
	is_certified_to_practice: boolean;
}

const initialValues: GetCertifiedToPractiseType = {
	is_certified_to_practice: false,
};

const GetCertifiedToPractiseScreen = (props: any) => {
	const {GetHcpBasicDetailsPayload}: any = props.route.params;
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [hcpDetails, setHcpDetails]: any = useState<null | {}>({});
	const [selectPickerModalVisible, setSelectPickerModalVisible] =
		useState<boolean>(false);
	const [loadingPercent, setLoadingPercent]: any = useState(28.57);
	const [documentAvailable, setDocumentAvailable]: any = useState(false);
	const navigation = props.navigation;

	const updateCertifiedToPractiseDetails = (
		values: GetCertifiedToPractiseType,
		formikHelpers: FormikHelpers<GetCertifiedToPractiseType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			nc_details: {
				is_certified_to_practice: values.is_certified_to_practice,
				is_vaccinated: hcpDetails.nc_details.is_vaccinated,
				vaccination_dates: {
					first_shot: hcpDetails.nc_details.vaccination_dates.first_shot,
					latest_shot: hcpDetails.nc_details.vaccination_dates.latest_shot,
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
		// formikHelpers.setSubmitting(false);
		// console.log(payload.nc_details.is_certified_to_practice);

		ApiFunctions.put(
			ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload._id,
			payload,
		)
			.then(async (resp: TSAPIResponseType<GetCertifiedToPractiseType>) => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					if (!documentAvailable) {
						if (values.is_certified_to_practice === true) {
							setSelectPickerModalVisible(true);
						} else {
							navigation.navigate(NavigateTo.GetDistanceToTravelScreen, {
								GetHcpBasicDetailsPayload: hcpDetails._id,
							});
						}
					} else {
						if (values.is_certified_to_practice === true) {
							ToastAlert.show(
								'You have already uploaded the license, Contact team vitawerks team to update it',
							);
							navigation.navigate(NavigateTo.GetDistanceToTravelScreen, {
								GetHcpBasicDetailsPayload: hcpDetails._id,
							});
						} else {
							ToastAlert.show(
								'You have already uploaded the license, Contact team vitawerks team to update it',
							);
							navigation.navigate(NavigateTo.GetDistanceToTravelScreen, {
								GetHcpBasicDetailsPayload: hcpDetails._id,
							});
						}
					}
				} else {
					ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
			});
	};

	const uploadPut = useCallback(
		(dataURL, file) => {
			setIsLoading(true);

			const myHeaders = new Headers();
			myHeaders.append('Content-Type', file.type);

			const fileContent = file;

			const requestOptions = {
				method: 'PUT',
				headers: myHeaders,
				body: fileContent,
				redirect: 'follow',
			};

			fetch(dataURL, requestOptions)
				.then(response => {
					setSelectPickerModalVisible(false);
					setDocumentAvailable(true);
					setIsLoading(false);
					setIsLoaded(true);
					navigation.navigate(NavigateTo.GetDistanceToTravelScreen, {
						GetHcpBasicDetailsPayload: hcpDetails._id,
					});
				})
				.catch(error => console.log('error:', error));
		},
		[hcpDetails._id, navigation],
	);

	const uploadHandler = useCallback(
		file => {
			const payload = {
				file_name: file.name,
				file_type: file.type,
				attachment_type: 'License',
			};
			setIsLoaded(false);
			setIsLoading(true);

			if (GetHcpBasicDetailsPayload._id) {
				ApiFunctions.post(
					ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload._id + '/attachment',
					payload,
				)
					.then(resp => {
						uploadPut(resp.data, file);
					})
					.catch(err => {
						console.log(err.error);
						ToastAlert.show(err.error);
					});
			}
		},
		[GetHcpBasicDetailsPayload._id, uploadPut],
	);

	const openImageUpload = useCallback(
		(mode: 'pdf' | 'camera' | 'image' = 'pdf') => {
			if (mode === 'camera') {
				CommonFunctions.openMedia(undefined, mode)
					.then(file => {
						setSelectPickerModalVisible(false);
						uploadHandler(file);
					})
					.catch(error => {
						setSelectPickerModalVisible(false);
						ToastAlert.show(error.err || 'Something went wrong');
					});
			} else {
				let picMode: any = [DocumentPicker.types.pdf];
				if (mode === 'pdf') {
				}
				if (mode === 'image') {
					picMode = [DocumentPicker.types.images];
				}
				CommonFunctions.openDocumentPicker(picMode)
					.then(file => {
						setSelectPickerModalVisible(false);
						uploadHandler(file);
					})
					.catch(error => {
						setSelectPickerModalVisible(false);
						ToastAlert.show(error.err || 'Something went wrong');
					});
			}
		},
		[uploadHandler],
	);

	const getAttachmentData = useCallback(() => {
		ApiFunctions.get(
			ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload._id + '/attachments',
		)
			.then(async resp => {
				if (resp) {
					var wantedData = resp.data.filter(function (i: any) {
						return i.attachment_type === 'License';
					});

					if (wantedData.length === 0) {
						setDocumentAvailable(false);
					} else {
						setDocumentAvailable(true);
					}
				} else {
					Alert.alert('Error');
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	}, [GetHcpBasicDetailsPayload._id]);

	const getHcpDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload._id)
			.then(resp => {
				if (resp && resp.success) {
					setHcpDetails(resp.data);
					// console.log('>>', resp.data.nc_details);
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
	}, [GetHcpBasicDetailsPayload._id]);

	useEffect(() => {
		console.log('loading HCP details.....');
		getHcpDetails();
		getAttachmentData();
	}, [getHcpDetails, getAttachmentData]);
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
									Do you carry a valid certification and/or license to practice
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
									onSubmit={updateCertifiedToPractiseDetails}
									validationSchema={GetCertifiedToPractise}
									validateOnBlur={true}
									initialValues={{
										...initialValues,
										...{
											is_certified_to_practice:
												hcpDetails.nc_details.is_certified_to_practice,
										},
									}}>
									{({handleSubmit, isValid, isSubmitting, values}) => (
										<View
											style={{
												justifyContent: 'space-between',
											}}>
											<Field name={'is_certified_to_practice'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														radioButtons={[
															{id: true, title: 'Yes'},
															{id: false, title: 'No'},
														]}
														direction={'column'}
													/>
												)}
											</Field>
											<CustomButton
												isLoading={isSubmitting}
												title={'Continue'}
												onPress={() => {
													handleSubmit();
												}}
												style={{
													backgroundColor: Colors.primary,
													marginTop: 250,
												}}
												disabled={!isValid}
											/>
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
																		setSelectPickerModalVisible(
																			!selectPickerModalVisible,
																		);
																	}}>
																	<ImageConfig.CloseIconModal
																		height={'25'}
																		width={'25'}
																	/>
																</TouchableOpacity>
															</View>
															<Text
																style={[styles.modalTextTitle, {fontSize: 24}]}>
																Upload Document
															</Text>

															<View
																style={{
																	flexDirection: 'row',
																	marginHorizontal: 10,
																	marginTop: 30,
																	width: '100%',
																	justifyContent: 'space-evenly',
																}}>
																<TouchableOpacity
																	onPress={openImageUpload.bind(null, 'pdf')}
																	style={{
																		justifyContent: 'center',
																		alignItems: 'center',
																	}}>
																	<View
																		style={{
																			backgroundColor:
																				Colors.backgroundShiftColor,
																			padding: 20,
																			borderRadius: 500,
																		}}>
																		<ImageConfig.docUploadIcon
																			height={'35'}
																			width={'35'}
																		/>
																	</View>
																	<Text style={styles.uploadText}>PDF</Text>
																</TouchableOpacity>
																<TouchableOpacity
																	onPress={openImageUpload.bind(null, 'camera')}
																	style={{
																		justifyContent: 'center',
																		alignItems: 'center',
																	}}>
																	<View
																		style={{
																			backgroundColor:
																				Colors.backgroundShiftColor,
																			padding: 20,
																			borderRadius: 500,
																		}}>
																		<ImageConfig.cameraIcon
																			height={'35'}
																			width={'35'}
																		/>
																	</View>
																	<Text style={styles.uploadText}>CAMERA</Text>
																</TouchableOpacity>
																<TouchableOpacity
																	onPress={openImageUpload.bind(null, 'image')}
																	style={{
																		justifyContent: 'center',
																		alignItems: 'center',
																	}}>
																	<View
																		style={{
																			backgroundColor:
																				Colors.backgroundShiftColor,
																			padding: 20,
																			borderRadius: 500,
																		}}>
																		<ImageConfig.imageUploadIcon
																			height={'35'}
																			width={'35'}
																		/>
																	</View>
																	<Text style={styles.uploadText}>IMAGE</Text>
																</TouchableOpacity>
															</View>
														</View>
													</View>
												</Modal>
											</View>
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
		height: '40%',
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

export default GetCertifiedToPractiseScreen;
