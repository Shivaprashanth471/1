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
import CheckboxComponent from './CheckboxComponent';

export interface FormikCheckboxComponentProps {
	showLabel?: boolean;
	labelText?: string;
	inputStyles?: StyleProp<TextStyle>;
	errorText?: StyleProp<TextStyle>;

	errorContainerStyle?: StyleProp<ViewStyle>;
	baseStyle?: StyleProp<ViewStyle>;
	style?: StyleProp<ViewStyle>;
	formikField: FieldProps;
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	onUpdate?: (value: any) => void;
	disabled?: boolean;
}

const FormikCheckboxComponent = (props: FormikCheckboxComponentProps) => {
	const {labelText, formikField, onUpdate, disabled, errorText} = props;
	const {field, form} = formikField;
	const showLabel =
		props.showLabel !== undefined
			? props.showLabel
			: !!(labelText && labelText.length > 0);
	const baseStyle = props.baseStyle || {};
	const errorContainerStyle = props.errorContainerStyle || {};
	const [selected, setSelected] = useState<boolean>(field.value);
	// const textChangeHandler = (text: string) => {
	//   // console.log(form.dirty);
	//   form.setFieldTouched(field.name);
	//   form.setFieldValue(field.name, text);
	//   form.handleChange(field.name);
	// };

	useEffect(() => {
		setSelected(field.value);
	}, [field.value]);

	const hasError =
		form.touched[field.name] && form.errors && form.errors[field.name];
	const style: any = props.style || {};

	return (
		<View style={[styles.inputBaseWrapper, baseStyle]}>
			{/*{showLabel && (*/}
			{/*  <LabelComponent style={{paddingBottom: 10}} title={labelText || ''} />*/}
			{/*)}*/}
			<View style={[styles.inputWrapper, style]}>
				{/*{props.sideIcon && <Ionicons size={20} color={Colors.textLight} name={props.sideIcon}/>}*/}

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
					<CheckboxComponent
						disabled={disabled}
						checked={selected}
						onChange={value => {
							setSelected(value);
							form.setFieldTouched(field.name, true);
							form.setFieldValue(field.name, value);
							if (onUpdate) {
								onUpdate(value);
							}
						}}
						label={labelText}
						size={'xs'}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	inputBaseWrapper: {
		marginVertical: 8,
		// borderBottomWidth: 1,
		// // borderBottomColor: Colors.textDark
	},
	label: {
		marginBottom: 5,
	},
	labelText: {
		fontFamily: FontConfig.secondary.regular,
		fontSize: 14,
		// opacity: 0.8,
		color: Colors.textDark,
	},
	baseErrorContainerStyle: {
		top: -30,
	},

	inputWrapper: {
		marginVertical: 5,
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

export default FormikCheckboxComponent;
