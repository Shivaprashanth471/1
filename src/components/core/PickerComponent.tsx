import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import LabelComponent from './LabelComponent';
import {Picker} from '@react-native-community/picker';
import {FieldProps} from 'formik';
import {Colors} from '../../constants';
import FontConfig from '../../constants/FontConfig';

export interface PickerComponentProps {
	labelText?: string;
	enabled?: boolean;
	showLabel?: boolean;
	style?: StyleProp<ViewStyle>;
	inputWrapperStyle?: StyleProp<ViewStyle>;
	errorContainerStyle?: StyleProp<ViewStyle>;
	formikField: FieldProps;
	onUpdate?: (value: any) => void;
	mode?: 'dropdown' | 'dialog';
}

const PickerComponent = (props: PropsWithChildren<PickerComponentProps>) => {
	const {labelText, inputWrapperStyle, formikField, onUpdate} = props;

	const enabled = props.enabled === undefined ? true : props.enabled;
	// const [enabled, setEnabled] = useState(!disabled);
	// console.log(disabled);
	// useEffect(() => {
	//     setEnabled(!disabled)
	// }, [disabled]);
	const {field, form} = formikField;
	const mode = props.mode || 'dropdown';

	const showLabel =
		props.showLabel !== undefined
			? props.showLabel
			: !!(labelText && labelText.length > 0);
	const hasError =
		form.touched[field.name] && form.errors && form.errors[field.name];
	const style: any = props.style || {
		borderColor: styles.inputWrapper.borderColor,
	};
	const errorContainerStyle = props.errorContainerStyle || {};

	return (
		<View
			style={[
				styles.inputWrapper,
				style,
				{
					borderColor: hasError
						? Colors.warn
						: style && style.borderColor
						? style.borderColor
						: styles.inputWrapper.borderColor,
				},
			]}>
			{showLabel && <LabelComponent title={labelText || ''} />}
			<Picker
				selectedValue={field.value}
				style={[styles.picker, inputWrapperStyle]}
				mode={mode}
				enabled={enabled}
				onValueChange={(itemValue: any) => {
					// console.log(field);
					form.setFieldTouched(field.name);
					form.setFieldValue(field.name, itemValue);
					form.handleChange(field.name);
					if (onUpdate) {
						onUpdate(itemValue);
					}
				}}>
				{props.children}
			</Picker>
			{hasError && (
				<View
					style={[
						styles.errorContainer,
						styles.baseErrorContainerStyle,
						errorContainerStyle,
					]}>
					<Text style={styles.errorText}>{form.errors[field.name]}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	inputWrapper: {
		borderBottomWidth: 1,
		borderColor: Colors.borderColor,
		backgroundColor: Colors.backgroundColor,
		marginTop: 10,
		paddingHorizontal: 0,
		marginBottom: 10,
	},
	picker: {
		height: 35,
	},
	baseErrorContainerStyle: {
		top: 10,
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

export default PickerComponent;
