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
	facility_name: yup
		.string()
		.matches(/\S/, 'cannot contain only blankspaces')
		.required('Required'),
	location: yup
		.string()
		.matches(/\S/, 'cannot contain only blankspaces')
		.required('Required'),
	position_title: yup.string().required('Required'),
	still_working_here: yup.string().required('Required'),
	specialisation: yup.string().required('Required'),
	// start_date: yup.string().required('Required'),
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
	hcpTypeList?: any;
	hcpSpecialityList?: any;
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
	const hcpTypeList = props.hcpTypeList;
	const hcpSpecialityList = props.hcpSpecialityList;

	const updateProfileExperienceDetails = (
		values: profileExperienceSchemaType,
		formikHelpers: FormikHelpers<profileExperienceSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {
			...values,
			exp_type: 'fulltime',
			// end_date: isWorking ? '' : values.end_date,
		};
		// if (values.end_date.length === 0 && !isWorking) {
		// 	formikHelpers.setSubmitting(false);
		// 	ToastAlert.show('Please give an end date');
		// 	return;
		// }
		// else
		if (
			values.start_date === values.end_date &&
			!isWorking &&
			values.start_date != '' &&
			values.end_date != ''
		) {
			ToastAlert.show('Start and end date should not be same');
			return;
		} else if (values.start_date > values.end_date && !isWorking) {
			formikHelpers.setSubmitting(false);
			ToastAlert.show('Start date should not be greater than end date');
			return;
		} else {
			if (HcpUser) {
				ApiFunctions.post(
					ENV.apiUrl + 'hcp/' + HcpUser._id + '/experience',
					payload,
				)
					.then(
						async (resp: TSAPIResponseType<profileExperienceSchemaType>) => {
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
						},
					)
					.catch((err: any) => {
						formikHelpers.setSubmitting(false);
						CommonFunctions.handleErrors(err, formikHelpers.setErrors);
					});
			}
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
												trimSpecialCharacters={true}
												trimNumbers={true}
												inputProperties={{
													keyboardType: 'default',
													placeholder: 'Facility Name',
													maxLength: 150,
												}}
												formikField={field}
											/>
										)}
									</Field>
									<Field name={'location'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												inputProperties={{
													keyboardType: 'default',
													placeholder: 'Location',
													maxLength: 150,
												}}
												formikField={field}
											/>
										)}
									</Field>
									<Field name={'position_title'}>
										{(field: FieldProps) => (
											<DropdownComponent
												contentWrapper={{marginHorizontal: 0}}
												data={hcpTypeList}
												labelText={'Role'}
												placeholder={'select the value'}
												formikField={field}
												search={false}
												onUpdate={selectedValue => {
													setHcpRole(selectedValue);
												}}
												style={{
													marginBottom: 10,
												}}
											/>
										)}
									</Field>
									<Field name={'specialisation'}>
										{(field: FieldProps) => (
											<DropdownComponent
												contentWrapper={{marginHorizontal: 0}}
												data={
													hcpRole === 'RN'
														? hcpSpecialityList.RN
														: hcpRole === 'LVN'
														? hcpSpecialityList.LVN
														: hcpRole === 'CNA'
														? hcpSpecialityList.CNA
														: hcpRole === 'CareGiver'
														? hcpSpecialityList.CareGiver
														: hcpRole === 'MedTech'
														? hcpSpecialityList.MedTech
														: [
																{
																	code: 'Please select your role first',
																	name: 'Please select your role first',
																},
														  ]
												}
												labelText={'Your Specialisation'}
												placeholder={'select your specialisation'}
												formikField={field}
												search={false}
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
													textStyle={{color: Colors.textDark}}
													labelDarkText="Still Working Here?"
													onUpdate={(e: any) => {
														if (e) {
															setIsWorking(true);
															console.log(e);
														} else {
															setIsWorking(false);
															console.log(e);
														}
													}}
												/>
											)}
										</Field>
									</View>
									<Field name={'start_date'}>
										{(field: FieldProps) => (
											<FormikDatepickerComponent
												formikField={field}
												style={{
													width: '100%',
													marginVertical: 20,
												}}
												labelDarkText="Start Date"
												baseStyle={{
													marginTop: -5,
												}}
												errorContainerStyle={{
													marginTop: -5,
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
														width: '100%',
													}}
													labelDarkText="End Date"
													errorContainerStyle={{
														marginTop: -5,
													}}
													baseStyle={{
														marginTop: -5,
													}}
													placeholer="End Date"
													mode="MonthYear"
												/>
											)}
										</Field>
									)}
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
