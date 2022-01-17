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

const profileReferenceSchema = yup.object().shape({
	reference_name: yup.string().required('Required'),
	job_title: yup.string().required('Required'),
	phone: yup
		.string()
		.max(10, 'max 10 digits')
		.required('required')
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			'Invalid',
		),
	email: yup.string().email('Invalid Email'),
});

export interface profileReferenceSchemaType {
	reference_name: string;
	job_title: string;
	phone: string;
	email: any;
}

const initialValues: profileReferenceSchemaType = {
	reference_name: '',
	job_title: '',
	phone: '',
	email: '',
};

export interface ProfileAddReferenceComponentProps {
	onUpdate?: () => void;
	setDisplayAddText?: any;
}

const ProfileAddReferenceComponent = (
	props: ProfileAddReferenceComponentProps,
) => {
	const {onUpdate} = props;
	const setDisplayAddText = props.setDisplayAddText;
	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;

	const [display, setDisplay] = useState<'none' | 'flex' | undefined>('flex');
	const [isWorking, setIsWorking] = useState<boolean>(false);

	const updateProfileReferenceDetails = (
		values: profileReferenceSchemaType,
		formikHelpers: FormikHelpers<profileReferenceSchemaType>,
	) => {
		formikHelpers.setSubmitting(true);
		const payload = {...values, contact_method: 'phone'};

		if (HcpUser) {
			ApiFunctions.post(
				ENV.apiUrl + 'hcp/' + HcpUser._id + '/reference',
				payload,
			)
				.then(async (resp: TSAPIResponseType<profileReferenceSchemaType>) => {
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
						Tell us about your reference
					</Text>
					<View style={styles.formHolder}>
						<Formik
							onSubmit={updateProfileReferenceDetails}
							validationSchema={profileReferenceSchema}
							validateOnBlur={true}
							initialValues={{
								...initialValues,
							}}>
							{({handleSubmit, isValid, isSubmitting, values}) => (
								<>
									<Field name={'reference_name'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												inputProperties={{
													maxLength: 10,
													keyboardType: 'default',
													placeholder: 'Name',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<Field name={'job_title'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												inputProperties={{
													keyboardType: 'default',
													placeholder: 'Job Title',
												}}
												formikField={field}
											/>
										)}
									</Field>
									<Field name={'phone'}>
										{(field: FieldProps) => (
											<FormikInputComponent
												trimSpaces={true}
												inputProperties={{
													keyboardType: 'phone-pad',
													placeholder: 'Phone Number',
													maxLength: 10,
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
										<Field name={'email'}>
											{(field: FieldProps) => (
												<FormikInputComponent
													trimSpaces={true}
													inputProperties={{
														keyboardType: 'default',
														placeholder: 'Email (optional)',
													}}
													formikField={field}
												/>
											)}
										</Field>
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

export default ProfileAddReferenceComponent;
