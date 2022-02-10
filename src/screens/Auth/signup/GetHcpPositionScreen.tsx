import React, {useCallback, useEffect, useState} from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	StatusBar,
} from 'react-native';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../../constants';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../../helpers';
import {
	BaseViewComponent,
	CustomButton,
	KeyboardAvoidCommonView,
	LoadingComponent,
	ErrorComponent,
} from '../../../components/core';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../../helpers/ApiFunctions';
import DropdownComponent from '../../../components/core/DropdownComponent';
import {currentList} from '../../../constants/CommonVariables';
const hcpPositionSchema = yup.object().shape({
	hcp_type: yup.string().required('Required'),
});

export interface HcpPositionSchemaType {
	hcp_type: string;
}

const initialValues: HcpPositionSchemaType = {
	hcp_type: '',
};

const GetHcpPositionScreen = (props: any) => {
	const {GetHcpBasicDetailsPayload}: any = props.route.params;
	const {signupInitiated}: any = props.route.params;
	const navigation = props.navigation;
	const [loadingPercent, setLoadingPercent]: any = useState(14.28);
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [hcpDetails, setHcpDetails]: any = useState<null | {}>({});
	const [hcpTypeList, setHcpTypeList] = useState<any>();

	const hcpPositionHandler = (
		values: HcpPositionSchemaType,
		formikHelpers: FormikHelpers<HcpPositionSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			hcp_type: values.hcp_type,
			nc_details: {
				is_certified_to_practice:
					hcpDetails.nc_details.is_certified_to_practice,
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
		ApiFunctions.put(
			ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload._id,
			payload,
		)
			.then(async (resp: TSAPIResponseType<HcpPositionSchemaType>) => {
				formikHelpers.setSubmitting(false);
				if (resp.success) {
					navigation.navigate(NavigateTo.GetCertifiedToPractiseScreen, {
						GetHcpBasicDetailsPayload: resp.data,
						signupInitiated: signupInitiated,
					});
				} else {
					ToastAlert.show(resp.error || '');
				}
			})
			.catch((err: any) => {
				formikHelpers.setSubmitting(false);
				CommonFunctions.handleErrors(err, formikHelpers.setErrors);
				console.log('error: ', err);
			});
	};

	const getHcpDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + GetHcpBasicDetailsPayload._id)
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
				console.log('>>>>><<<<<<<<<<<<<<<<<<<<<', err);
			});
	}, [GetHcpBasicDetailsPayload._id]);

	// const getHcpTypeList = useCallback(() => {
	// 	setIsLoading(true);
	// 	ApiFunctions.get(ENV.apiUrl + 'meta/hcp-types')
	// 		.then((resp: any) => {
	// 			if (resp && resp.success) {
	// 				setHcpTypeList(resp.data);
	// 			} else {
	// 				ToastAlert.show('something went wrong');
	// 			}
	// 			setIsLoading(false);
	// 			setIsLoaded(true);
	// 		})
	// 		.catch((err: any) => {
	// 			ToastAlert.show(err.error || 'Something went wrong');
	// 			setIsLoading(false);
	// 			setIsLoaded(true);
	// 			console.log('>>>>', err);
	// 		});
	// }, []);

	useEffect(() => {
		console.log('loading HCP details.....');
		getHcpDetails();
	}, [getHcpDetails]);

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !hcpDetails && (
				<ErrorComponent text={'Facility details not available'} />
			)}
			{!isLoading && isLoaded && hcpDetails && (
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
										What position are you looking for
									</Text>
								</View>
								<View style={styles.subHeadingHolder}>
									<Text style={styles.subHeading}>
										Please select your HCP position
									</Text>
								</View>
							</View>
							<View style={styles.formBlock}>
								<View style={styles.formHolder}>
									<Formik
										onSubmit={hcpPositionHandler}
										validationSchema={hcpPositionSchema}
										validateOnBlur={true}
										initialValues={{
											...initialValues,
											...{
												hcp_type: hcpDetails.hcp_type
													? hcpDetails.hcp_type
													: '',
											},
										}}>
										{({handleSubmit, isValid, isSubmitting, values}) => (
											<View
												style={{
													flex: 1,
													justifyContent: 'space-between',
												}}>
												<Field name={'hcp_type'}>
													{(field: FieldProps) => (
														<DropdownComponent
															contentWrapper={{marginHorizontal: 0}}
															// @ts-ignore
															data={currentList}
															placeholder={'select your position'}
															formikField={field}
															search={false}
															onUpdate={() => {
																// setDisableBtn(false);
															}}
														/>
													)}
												</Field>

												<CustomButton
													isLoading={isSubmitting}
													title={'Continue'}
													onPress={handleSubmit}
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
			)}
		</>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f7fffd',
		alignItems: 'center',
	},
	header: {
		flex: 1,
		marginVertical: 20,
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
		fontSize: 16,
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
	logo: {},

	title: {textAlign: 'center', fontSize: 32},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
});

export default GetHcpPositionScreen;
