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
import {useSelector} from 'react-redux';
import {StateParams} from '../store/reducers';
import {
	currentList,
	primarySpecialityList,
	CnaSpecialityList,
	RnSpecialityList,
	LvnSpecialityList,
	CareGiverSpecialityList,
	MedTechSpecialityList,
} from '../constants/CommonVariables';

import * as yup from 'yup';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import {
	FormikInputComponent,
	FormikRadioGroupComponent,
	KeyboardAvoidCommonView,
	FormikDatepickerComponent,
} from './core';
import {TSAPIResponseType} from '../helpers/ApiFunctions';
import DropdownComponent from './core/DropdownComponent';

const profileExperienceSchema = yup.object().shape({
	facility_name: yup.string().required('Required'),
	location: yup.string().required('Required'),
	position_title: yup.string().required('Required'),
	still_working_here: yup.string().required('Required'),
	specialisation: yup.string().required('Required'),
	start_date: yup.string().required('Required'),
});

export interface profileExperienceSchemaType {
	facility_name: string;
	location: string;
	position_title: string;
	still_working_here: string;
	specialisation: string;
	start_date: any;
	end_date: any;
}

const initialValues: profileExperienceSchemaType = {
	facility_name: '',
	location: '',
	position_title: '',
	still_working_here: '',
	start_date: '',
	end_date: '',
	specialisation: '',
};

export interface ProfileAddExperienceComponentProps {
	onUpdate?: () => void;
	setDisplayAddText?: any;
}

const ProfileAddExperienceComponent = (
	props: ProfileAddExperienceComponentProps,
) => {
	const {onUpdate} = props;
	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;
	const [display, setDisplay] = useState<'none' | 'flex' | undefined>('flex');
	const [isWorking, setIsWorking] = useState<boolean>(false);
	const [hcpRole, setHcpRole] = useState<string>('');
	const setDisplayAddText = props.setDisplayAddText;

	const updateProfileExperienceDetails = (
		values: profileExperienceSchemaType,
		formikHelpers: FormikHelpers<profileExperienceSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			...values,
			exp_type: 'fulltime',
			end_date: isWorking ? '' : values.end_date,
		};
		if (HcpUser) {
			ApiFunctions.post(
				ENV.apiUrl + 'hcp/' + HcpUser._id + '/experience',
				payload,
			)
				.then(async (resp: TSAPIResponseType<profileExperienceSchemaType>) => {
					formikHelpers.setSubmitting(false);
					if (resp.success) {
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
						Tell us about your work experience
					</Text>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={updateProfileExperienceDetails}
							validationSchema={profileExperienceSchema}
							validateOnBlur={true}
							initialValues={{
								...initialValues,
							}}>
							{({handleSubmit, isValid, isSubmitting, values}) => (
								<>
									<Field name={'facility_name'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												inputProperties={{
													keyboardType: 'default',
													placeholder: 'Facility Name',
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
									<Field name={'position_title'}>
										{(field: FieldProps) => (
											<DropdownComponent
												contentWrapper={{marginHorizontal: 0}}
												// @ts-ignore
												data={currentList}
												placeholder={'select your role'}
												formikField={field}
												search={false}
												disabled={false}
												onUpdate={selectedValue => {
													setHcpRole(selectedValue);
												}}
											/>
										)}
									</Field>
									<Field name={'specialisation'}>
										{(field: FieldProps) => (
											<DropdownComponent
												contentWrapper={{marginHorizontal: 0}}
												// @ts-ignore
												data={
													hcpRole === 'RN'
														? RnSpecialityList
														: hcpRole === 'LVN'
														? LvnSpecialityList
														: hcpRole === 'CNA'
														? CnaSpecialityList
														: hcpRole === 'CareGiver'
														? CareGiverSpecialityList
														: hcpRole === 'MedTech'
														? MedTechSpecialityList
														: primarySpecialityList
												}
												placeholder={'select your specialisation'}
												formikField={field}
												search={false}
												disabled={false}
											/>
										)}
									</Field>
									<View>
										<Field name={'still_working_here'}>
											{(field: FieldProps) => (
												<FormikRadioGroupComponent
													formikField={field}
													radioButtons={[
														{id: 1, title: 'Yes'},
														{id: 0, title: 'No'},
													]}
													direction={'row'}
													labelText="Still Working Here?"
													onUpdate={(e: any) => {
														if (e) {
															setIsWorking(true);
														} else {
															setIsWorking(false);
														}
													}}
												/>
											)}
										</Field>
									</View>
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
													mode="MonthYear"
												/>
											)}
										</Field>
										{!isWorking && (
											<Field name={'end_date'}>
												{(field: FieldProps) => (
													<FormikDatepickerComponent
														formikField={field}
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
														mode="MonthYear"
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
														if (values.still_working_here.length === 0) {
															handleSubmit();
														} else {
															if (isWorking) {
																handleSubmit();
															} else {
																if (values.end_date.length === 0) {
																	ToastAlert.show('Please give an end date');
																} else {
																	if (values.start_date > values.end_date) {
																		ToastAlert.show(
																			'Start date cannot be greater than end date',
																		);
																	} else {
																		handleSubmit();
																	}
																}
															}
														}
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

export default ProfileAddExperienceComponent;
