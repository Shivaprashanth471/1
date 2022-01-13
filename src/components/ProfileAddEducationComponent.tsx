import React, {useState} from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	ActivityIndicator,
} from 'react-native';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../helpers';
import {Colors, ENV, FontConfig} from '../constants';
import Moment from 'moment';
import {useSelector} from 'react-redux';
import {StateParams} from '../store/reducers';
import {currentList, primarySpecialityList} from '../constants/CommonVariables';

import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import {
	FormikInputComponent,
	CustomButton,
	FormikRadioGroupComponent,
	KeyboardAvoidCommonView,
	FormikDatepickerComponent,
} from './core';
import {TSAPIResponseType} from '../helpers/ApiFunctions';
import DropdownComponent from './core/DropdownComponent';

const profileEducationSchema = yup.object().shape({
	institute_name: yup.string().required('Required'),
	location: yup.string().required('Required'),
	degree: yup.string().required('Required'),
	start_date: yup.string().required('Required'),
	graduation_date: yup.string().required('Required'),
});

export interface profileEducationSchemaType {
	institute_name: string;
	location: string;
	degree: string;
	start_date: any;
	graduation_date: any;
}

const initialValues: profileEducationSchemaType = {
	institute_name: '',
	location: '',
	degree: '',
	start_date: '',
	graduation_date: '',
};

export interface ProfileAddEducationComponentProps {
	onUpdate?: () => void;
	setDisplayAddText?: any;
}

const ProfileAddEducationComponent = (
	props: ProfileAddEducationComponentProps,
) => {
	const {onUpdate} = props;
	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;
	const [display, setDisplay] = useState<'none' | 'flex' | undefined>('flex');
	const [isWorking, setIsWorking] = useState<boolean>(false);
	const setDisplayAddText = props.setDisplayAddText;

	const updateProfileEducationDetails = (
		values: profileEducationSchemaType,
		formikHelpers: FormikHelpers<profileEducationSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values};
		console.log('>>>>', payload);

		if (HcpUser) {
			ApiFunctions.post(
				ENV.apiUrl + 'hcp/' + HcpUser._id + '/education',
				payload,
			)
				.then(async (resp: TSAPIResponseType<profileEducationSchemaType>) => {
					formikHelpers.setSubmitting(false);
					if (resp.success) {
						console.log('>>>>', resp);
						if (onUpdate) {
							onUpdate();
						}
						setDisplay('none');
						ToastAlert.show('Experience added');
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
	return (
		<>
			<KeyboardAvoidCommonView>
				<View
					style={{
						display: display,
					}}>
					<Text
						style={{
							color: Colors.textDark,
							fontFamily: FontConfig.primary.bold,
							fontSize: 20,
							marginTop: 50,
						}}>
						Tell us about your education
					</Text>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={updateProfileEducationDetails}
							validationSchema={profileEducationSchema}
							validateOnBlur={true}
							initialValues={{
								...initialValues,
							}}>
							{({handleSubmit, isValid, isSubmitting, values}) => (
								<>
									<Field name={'institute_name'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												inputProperties={{
													keyboardType: 'default',
													placeholder: 'Institute Name',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<Field name={'location'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												inputProperties={{
													keyboardType: 'default',
													placeholder: 'Location',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<Field name={'degree'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												inputProperties={{
													keyboardType: 'default',
													placeholder: 'Degree',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}>
										<Field name={'start_date'}>
											{(field: FieldProps) => (
												<FormikDatepickerComponent
													formikField={field}
													style={{
														width: '90%',
													}}
													baseStyle={{
														marginTop: -15,
													}}
													errorContainerStyle={{
														marginVertical: 0,
													}}
													placeholer="Start Date"
												/>
											)}
										</Field>
										{!isWorking && (
											<Field name={'graduation_date'}>
												{(field: FieldProps) => (
													<FormikDatepickerComponent
														formikField={field}
														minDate={
															values.start_date && values.start_date.length > 0
																? Moment(values.start_date).format('YYYY-MM-DD')
																: Moment().format('YYYY-MM-DD')
														}
														style={{
															width: '90%',
														}}
														errorContainerStyle={{
															marginVertical: 0,
														}}
														baseStyle={{
															marginTop: -15,
														}}
														placeholer="End Date"
													/>
												)}
											</Field>
										)}
									</View>
									<View
										style={{
											flexDirection: 'row',
											marginTop: 20,
											justifyContent: 'flex-end',
										}}>
										{isSubmitting ? (
											<>
												<ActivityIndicator
													size={'small'}
													color={Colors.primary}
													style={{
														marginRight: 20,
													}}
												/>
											</>
										) : (
											<>
												<TouchableOpacity
													disabled={!isValid}
													onPress={() => {
														handleSubmit();
													}}
													style={{
														marginRight: 20,
													}}>
													<Text
														style={{
															color: isValid
																? Colors.textOnAccent
																: Colors.textLight,
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 14,
														}}>
														Save
													</Text>
												</TouchableOpacity>
											</>
										)}
										<TouchableOpacity
											onPress={() => {
												setDisplay('none');
												setDisplayAddText('flex');
											}}>
											<Text
												style={{
													color: Colors.textLight,
													fontFamily: FontConfig.primary.semiBold,
													fontSize: 14,
												}}>
												Cancel
											</Text>
										</TouchableOpacity>

										{/* <View
											style={{
												width: '45%',
												marginRight: '10%',
											}}>
											<CustomButton
												onPress={() => {
													setDisplay('none');
												}}
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
												onPress={() => {
													if (isWorking) {
														console.log('here');
														handleSubmit();
													} else {
														if (values.graduation_date.length === 0) {
															console.log('or here');
															console.log(values.graduation_date.length);
															ToastAlert.show('Please give an end date');
														} else {
															console.log('finally');
															handleSubmit();
														}
													}
												}}
												disabled={!isValid}
												textStyle={{
													textTransform: 'none',
													fontFamily: FontConfig.primary.bold,
													fontSize: 16,
												}}
											/>
										</View> */}
									</View>
								</>
							)}
						</Formik>
					</View>
				</View>
			</KeyboardAvoidCommonView>
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
	},
	editButtons: {
		flexDirection: 'row',
		width: '30%',
		justifyContent: 'flex-end',
		height: '100%',
	},
	titleText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
		color: Colors.textDark,
		marginBottom: 5,
	},
	subText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 12,
		color: Colors.textOnTextLight,
	},
	formHolder: {
		marginVertical: 20,
	},
});

export default ProfileAddEducationComponent;
