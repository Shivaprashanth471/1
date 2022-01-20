import React, {useEffect, useState} from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import FontConfig from '../../constants/FontConfig';
import Colors from '../../constants/Colors';
import {FieldProps} from 'formik';
import DatePickerComponent from './DatePickerComponent';
import LabelComponent from './LabelComponent';
import MonthYearPickerComponent from './MonthYearPickerComponent';
export interface FormikDatepickerComponentProps {
	showLabel?: boolean;
	labelText?: string;
	labelDarkText?: string;
	inputStyles?: StyleProp<TextStyle>;
	errorText?: StyleProp<TextStyle>;
	errorContainerStyle?: StyleProp<ViewStyle>;
	baseStyle?: StyleProp<ViewStyle>;
	style?: StyleProp<ViewStyle>;
	formikField: FieldProps;
	onUpdate?: (value: any) => void;
	minDate?: string;
	maxDate?: string;
	placeholer?: string;
	mode?: string;
}

const FormikDatepickerComponent = (props: FormikDatepickerComponentProps) => {
	const {
		labelText,
		labelDarkText,
		formikField,
		onUpdate,
		minDate,
		maxDate,
		errorText,
		placeholer,
	} = props;
	const {field, form} = formikField;
	const showLabel =
		props.showLabel !== undefined
			? props.showLabel
			: !!(labelText && labelText.length > 0);
	const mode = props.mode || 'DateMonthYear';
	const baseStyle = props.baseStyle || {};
	const errorContainerStyle = props.errorContainerStyle || {};
	const [selected, setSelected] = useState<string>(field.value);

	useEffect(() => {
		setSelected(field.value);
	}, [field.value]);

	const hasError =
		form.touched[field.name] && form.errors && form.errors[field.name];
	const style: any = props.style || {};

	return (
		<View style={[styles.inputBaseWrapper, baseStyle]}>
			{showLabel ? (
				<LabelComponent style={styles.label} title={labelText || ''} />
			) : (
				<View style={[{paddingBottom: 5}]}>
					<Text
						style={{
							fontFamily: FontConfig.primary.bold,
							fontSize: 14,
							color: Colors.textLight,
						}}>
						{labelDarkText}
					</Text>
				</View>
			)}
			<View style={[styles.inputWrapper, style]}>
				{hasError && (
					<View
						style={[
							styles.errorContainer,
							styles.baseErrorContainerStyle,
							errorContainerStyle,
						]}>
						<Text style={[styles.errorText, errorText]}>
							{form.errors[field.name]}
						</Text>
					</View>
				)}
				<View
					style={{
						flex: 1,
					}}>
					{mode === 'MonthYear' ? (
						<MonthYearPickerComponent
							placeHolder={placeholer}
							date={selected}
							minDate={minDate}
							maxDate={maxDate}
							onChange={value => {
								setSelected(value);
								form.setFieldTouched(field.name, true);
								form.setFieldValue(field.name, value);
								if (onUpdate) {
									onUpdate(value);
								}
							}}
						/>
					) : (
						<DatePickerComponent
							placeHolder={placeholer}
							date={selected}
							minDate={minDate}
							maxDate={maxDate}
							onChange={value => {
								setSelected(value);
								form.setFieldTouched(field.name, true);
								form.setFieldValue(field.name, value);
								if (onUpdate) {
									onUpdate(value);
								}
							}}
						/>
					)}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	inputBaseWrapper: {
		marginVertical: 8,
	},
	label: {
		marginBottom: 0,
	},
	labelText: {
		fontFamily: FontConfig.secondary.regular,
		fontSize: 15,
		// opacity: 0.8,
		color: Colors.textLight,
	},
	baseErrorContainerStyle: {
		top: -15,
	},

	inputWrapper: {
		marginTop: 0,
	},
	input: {
		height: 40,
		// borderRadius: 10,
		width: '100%',
		paddingHorizontal: 0,
		color: Colors.textDark,
		// backgroundColor: Colors.backgroundColor,
		fontFamily: FontConfig.primary.regular,
		fontSize: 16,
	},
	errorContainer: {
		marginVertical: 3,
		position: 'absolute',
		right: 0,
	},
	errorText: {
		fontFamily: FontConfig.primary.light,
		color: Colors.warn,
		fontSize: 13,
		textTransform: 'capitalize',
	},
});

export default FormikDatepickerComponent;
