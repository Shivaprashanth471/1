import React, {useCallback, useEffect, useState} from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
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
} from '../../../components/core';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../../helpers/ApiFunctions';

const GetVaccineForCovid = yup.object().shape({
	is_authorized_to_work: yup.string().required('Required'),
});

export interface GetAuthorisationForWorkType {
	is_authorized_to_work: string;
}

const initialValues: GetAuthorisationForWorkType = {
	is_authorized_to_work: '',
};

const GetLegallyAuthorisedToWorkScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {GetHcpBasicDetailsPayload}: any = props.route.params;
	const [hcpDetails, setHcpDetails]: any = useState<null | {}>({});

	const [loadingPercent, setLoadingPercent]: any = useState(85.71);
	const navigation = props.navigation;

	const updateAuthorisationForWorkDetails = (
		values: GetAuthorisationForWorkType,
		formikHelpers: FormikHelpers<GetAuthorisationForWorkType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			nc_details: {
				is_certified_to_practice:
					hcpDetails.nc_details.is_certified_to_practice,
				is_vaccinated: hcpDetails.nc_details.is_vaccinated,
				vaccination_dates: {
					first_shot: hcpDetails.nc_details.vaccination_dates.first_shot,
					latest_shot: hcpDetails.nc_details.vaccination_dates.latest_shot,
				},
				is_authorized_to_work: values.is_authorized_to_work,
			},
		};
		console.log(payload);
		// formikHelpers.setSubmitting(false);
		ApiFunctions.put(ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload, payload)
			.then(async (resp: TSAPIResponseType<GetAuthorisationForWorkType>) => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					navigation.navigate(NavigateTo.GetRequireSponsorshipScreen, {
						GetHcpBasicDetailsPayload: GetHcpBasicDetailsPayload,
					});
				} else {
					ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
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
									Are you legally authorized to work in United States?
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
									onSubmit={updateAuthorisationForWorkDetails}
									validationSchema={GetVaccineForCovid}
									validateOnBlur={true}
									initialValues={{
										...initialValues,
										...{
											is_authorized_to_work: hcpDetails.nc_details
												.is_authorized_to_work
												? hcpDetails.nc_details.is_authorized_to_work || ''
												: '',
										},
									}}>
									{({handleSubmit, isValid, isSubmitting, values}) => (
										<View
											style={{
												justifyContent: 'space-between',
											}}>
											<Field name={'is_authorized_to_work'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														radioButtons={[
															{id: 'true', title: 'Yes'},
															{id: 'false', title: 'No'},
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

export default GetLegallyAuthorisedToWorkScreen;
