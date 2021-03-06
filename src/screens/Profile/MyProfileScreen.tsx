import React, {useState, useCallback, useEffect} from 'react';
import {
	StatusBar,
	StyleSheet,
	View,
	Alert,
	Text,
	TouchableOpacity,
	Platform,
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
import {useDispatch} from 'react-redux';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import {StateParams} from '../../store/reducers';
import DropdownComponent from '../../components/core/DropdownComponent';
import {updateHcpDetails} from '../../store/actions/hcpDetails.action';
import analytics from '@segment/analytics-react-native';

const profileSchema = yup.object().shape({
	hcp_type: yup.string().required('Required'),
	region: yup.string().required('Required'),
});

export interface ProfileSchemaType {
	hcp_type: string;
	region: string;
	shift_type_preference: string;
}

const initialValues: ProfileSchemaType = {
	hcp_type: '',
	region: '',
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
	const [regionList, setRegionList] = useState<any>();
	const [hcpTypeList, setHcpTypeList] = useState<any>();
	const [disableBtn, setDisableBtn] = useState<boolean>(true);

	const getProfileDetails = useCallback(() => {
		setIsLoading(true);
		if (HcpUser) {
			ApiFunctions.get(ENV.apiUrl + 'profile')
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
					// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
				});
		}
	}, [HcpUser]);

	const updateProfileDetails = (
		values: ProfileSchemaType,
		formikHelpers: FormikHelpers<ProfileSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);

		const payload = {...values};

		if (HcpUser) {
			ApiFunctions.put(ENV.apiUrl + 'profile', payload)
				.then(async (resp: TSAPIResponseType<ProfileSchemaType>) => {
					// formikHelpers.setSubmitting(false);
					if (resp.success) {
						ToastAlert.show('Profile Successfully Updated');
						setDisableBtn(true);
						dispatchProfileDetails(formikHelpers);
					} else {
						ToastAlert.show(resp.error || '');
					}
				})
				.catch((err: any) => {
					formikHelpers.setSubmitting(false);
					CommonFunctions.handleErrors(err, formikHelpers.setErrors);
				});
		}
	};

	const dispatch = useDispatch();

	const dispatchProfileDetails = useCallback(
		formikHelpers => {
			ApiFunctions.get(ENV.apiUrl + 'hcp/user/' + user._id)
				.then((resp: any) => {
					if (resp && resp.success) {
						if (resp.data != null) {
							dispatch(updateHcpDetails(resp.data));
							formikHelpers.setSubmitting(false);
							ToastAlert.show('Profile Successfully Updated');
							analytics.identify(resp.data._id, {
								firstName: resp.data.first_name,
								lastName: resp.data.last_name,
								email: resp.data.email,
								hcpType: resp.data.hcp_type,
								region: resp.data.address.region,
							});
						} else {
							ToastAlert.show('HCP data not found, please contact vitawerks');
						}
					} else {
						ToastAlert.show('something went wrong');
					}
				})
				.catch((err: any) => {
					ToastAlert.show(err.error || 'Something went wrong');
				});
		},
		[dispatch, user._id],
	);

	const getRegion = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'meta/hcp-regions')
			.then((resp: any) => {
				if (resp && resp.success) {
					setRegionList(resp.data);
				} else {
					ToastAlert.show('something went wrong');
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				ToastAlert.show(err.error || 'Something went wrong');
				setIsLoading(false);
				setIsLoaded(true);
			});
	}, []);
	const getHcpTypeList = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'meta/hcp-types')
			.then((resp: any) => {
				if (resp && resp.success) {
					setHcpTypeList(resp.data);
				} else {
					ToastAlert.show('something went wrong');
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				ToastAlert.show(err.error || 'Something went wrong');
				setIsLoading(false);
				setIsLoaded(true);
			});
	}, []);

	useEffect(() => {
		console.log('loading get profile');
		getProfileDetails();
	}, [getProfileDetails]);
	useEffect(() => {
		console.log('loading get profile');
		getHcpTypeList();
	}, [getHcpTypeList]);
	useEffect(() => {
		console.log('loading get profile');
		getRegion();
	}, [getRegion]);

	return (
		<>
			{(isLoading || !profile || !regionList || !hcpTypeList) && (
				<LoadingComponent />
			)}
			{!isLoading && isLoaded && !profile && !regionList && !hcpTypeList && (
				<ErrorComponent />
			)}
			{!isLoading && isLoaded && profile && regionList && hcpTypeList && (
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
											shift_type_preference:
												profile.shift_type_preference || '',
										},
									}}>
									{({handleSubmit, isSubmitting}) => (
										<>
											<Field name={'hcp_type'}>
												{(field: FieldProps) => (
													<DropdownComponent
														contentWrapper={{marginHorizontal: 0}}
														data={hcpTypeList}
														labelText={'Current Role'}
														placeholder={'select the value'}
														formikField={field}
														search={false}
														onUpdate={() => {
															setDisableBtn(false);
														}}
														style={{
															marginBottom: 10,
														}}
													/>
												)}
											</Field>
											<Field name={'region'}>
												{(field: FieldProps) => (
													<DropdownComponent
														contentWrapper={{marginHorizontal: 0}}
														data={regionList}
														labelText={'Address'}
														placeholder={'select the value'}
														formikField={field}
														search={false}
														onUpdate={() => {
															setDisableBtn(false);
														}}
														style={{
															marginBottom: 10,
														}}
													/>
												)}
											</Field>
											<View
												style={{
													marginBottom: 20,
												}}>
												<Text
													style={{
														color: Colors.textLight,
														fontSize: 14,
														fontFamily: FontConfig.primary.bold,
													}}>
													Experience
												</Text>
												<TouchableOpacity
													onPress={() => {
														ToastAlert.show(
															'Please add experience under work experience tab for the changes to reflect',
														);
													}}>
													<View
														style={{
															borderBottomColor: Colors.borderColor,
															borderBottomWidth: 2,
														}}>
														<Text
															style={{
																width: '100%',
																paddingHorizontal: 0,
																color: Colors.textLight,
																fontFamily: FontConfig.primary.regular,
																fontSize: 18,
																borderBottomColor: Colors.borderColor,
																borderBottomWidth: 2,
															}}>
															{profile.total_exp
																? profile.total_exp.toString()
																: '0'}
														</Text>
													</View>
												</TouchableOpacity>
											</View>

											{profile.specializations.length != 0 && (
												<View
													style={{
														marginBottom: 20,
													}}>
													<Text
														style={{
															color: Colors.textLight,
															fontSize: 14,
															fontFamily: FontConfig.primary.bold,
														}}>
														Specialities
													</Text>
													<>
														{profile.specializations.map((item: any) => (
															<>
																<TouchableOpacity
																	onPress={() => {
																		ToastAlert.show(
																			'Please add experience under work experience tab for the changes to reflect',
																		);
																	}}>
																	<View
																		style={{
																			borderBottomColor: Colors.borderColor,
																			borderBottomWidth: 2,
																		}}>
																		<Text
																			style={{
																				width: '100%',
																				paddingHorizontal: 0,
																				paddingVertical:
																					Platform.OS === 'ios' ? 2 : 0,
																				color: Colors.textLight,
																				fontFamily: FontConfig.primary.regular,
																				fontSize: 18,
																				borderBottomColor: Colors.borderColor,
																				borderBottomWidth: 2,
																			}}>
																			{item}
																		</Text>
																	</View>
																</TouchableOpacity>
															</>
														))}
													</>
												</View>
											)}
											<Field name={'shift_type_preference'}>
												{(field: FieldProps) => (
													<FormikRadioGroupComponent
														formikField={field}
														labelDarkText="Shift Prefer"
														radioButtons={[
															{id: 'AM', title: 'AM'},
															{id: 'PM', title: 'PM'},
															{id: 'NOC', title: 'NOC'},
														]}
														direction={'column'}
														onUpdate={() => {
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
