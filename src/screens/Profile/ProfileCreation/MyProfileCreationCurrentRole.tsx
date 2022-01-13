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
import PickerComponent from '../../../components/core/PickerComponent';
import {
	BaseViewComponent,
	ProfileDetailsContainerComponent,
	ErrorComponent,
	LoadingComponent,
	CustomButton,
	FormikRadioGroupComponent,
} from '../../../components/core';
import {StateParams} from '../../../store/reducers';
import moment from 'moment';
import * as yup from 'yup';

const profileSchema = yup.object().shape({
	CurrentRole: yup.string().required('Required'),
});

export interface ProfileSchemaType {
	CurrentRole: string;
}

const initialValues: ProfileSchemaType = {
	CurrentRole: '',
};

const MyProfileCreationCurrentRole = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile] = useState<any[] | null>();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	const [loadingPercent, setLoadingPercent]: any = useState(20);

	// const gotoGetCurrentRole = () => {
	// 	props.navationa.navigate(NavigateTo.MyProfileCreationGetStartedScreen);
	// };

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

	return (
		<>
			<BaseViewComponent isLoading={true} loadingPercent={loadingPercent}>
				<StatusBar
					barStyle={'light-content'}
					animated={true}
					backgroundColor={Colors.backdropColor}
				/>
				<View style={styles.screen}>
					<Text style={CommonStyles.pageTitle}>What's your current role</Text>
					<Text style={styles.pageSubTitle}>
						Lorem ipsum dolor sit amet,consectetur adipiscing elit,
					</Text>
					<View style={styles.formBlock}>
						<View style={styles.formHolder}>
							<Formik
								onSubmit={updateProfileDetails}
								validationSchema={profileSchema}
								validateOnBlur={true}
								initialValues={{
									...initialValues,
									...{
										CurrentRole: 'Registered nurse',
									},
								}}>
								{({handleSubmit, isValid, isSubmitting}) => (
									<>
										<Field name={'CurrentRole'}>
											{(field: FieldProps) => (
												<FormikRadioGroupComponent
													formikField={field}
													// labelText={'Shift Prefer'}
													radioButtons={[
														{
															id: 'Registered nurse',
															title: 'Registered nurse',
															disabled: false,
														},
														{
															id: 'Practical nurse',
															title: 'Practical nurse',
															disabled: false,
														},
														{
															id: 'Nurse practitioner',
															title: 'Nurse practitioner',
															disabled: false,
														},
														{
															id: 'Nursing assistant',
															title: 'Nursing assistant',
															disabled: false,
														},
														{
															id: 'Nurse midwife',
															title: 'Nurse midwife',
															disabled: false,
														},
														{
															id: 'Nurse specialist',
															title: 'Nurse specialist',
															disabled: false,
														},
													]}
													direction={'column'}
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
		marginHorizontal: 20,
	},
});

export default MyProfileCreationCurrentRole;
