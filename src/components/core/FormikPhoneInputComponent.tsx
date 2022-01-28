import React, {useCallback, useRef, useState} from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TextInputProps,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {Colors, FontConfig} from '../../constants';
import {FieldProps} from 'formik';
import LabelComponent from './LabelComponent';

export interface FormikPhoneInputComponentProps {
	showLabel?: boolean;
	labelText?: string;
	inputStyles?: StyleProp<TextStyle>;
	errorText?: StyleProp<TextStyle>;
	errorContainerStyle?: StyleProp<ViewStyle>;
	baseStyle?: StyleProp<ViewStyle>;
	style?: StyleProp<ViewStyle>;
	inputWrapperStyle?: StyleProp<ViewStyle>;
	isPassword?: boolean;
	formikField: FieldProps;
	onUpdate?: (value: any) => void;
	inputProperties?: TextInputProps;
	secureTextEntry?: any;
	errorMessage?: any;
}

const FormikPhoneInputComponent = (props: FormikPhoneInputComponentProps) => {
	const {
		labelText,
		formikField,
		inputProperties,
		onUpdate,
		errorMessage,
		errorText,
	} = props;

	const {field, form} = formikField;
	const [hasFocus, setHasFocus] = useState(false);
	const [countryCode, setCountryCode] = useState('');

	const hasError =
		form.touched[field.name] && form.errors && form.errors[field.name];

	const showLabel =
		props.showLabel !== undefined
			? props.showLabel
			: !!(labelText && labelText.length > 0);

	const inputStyles = props.inputStyles || {};
	const errorContainerStyle = props.errorContainerStyle || {};

	const phoneInput = useRef<PhoneInput>(null);
	const style: any = props.style || {
		borderColor: styles.inputWrapper.borderColor,
	};

	const textChangeHandler = useCallback(
		(text: any) => {
			form.setFieldTouched(field.name);
			form.setFieldValue(field.name, text);
			// const checkValid = phoneInput.current?.isValidNumber(text);
			console.log('called this function');

			if (onUpdate) {
				const phnNumWithCountryCode = '+' + countryCode + text;
				onUpdate(phnNumWithCountryCode);
			}
		},
		[countryCode, field.name, form, onUpdate],
	);

	console.log(countryCode, 'country code........');

	return (
		<>
			{showLabel && <LabelComponent title={labelText || ''} />}
			<PhoneInput
				ref={phoneInput}
				defaultValue={''}
				defaultCode="US"
				layout="first"
				textInputProps={{
					autoCapitalize: 'none',
					autoCorrect: false,
					maxLength: 10,
					autoCompleteType: 'tel',
					keyboardType: 'phone-pad',
					placeholder: 'Phone number',
					...inputProperties,
					placeholderTextColor: Colors.textOnTextLight,
				}}
				containerStyle={[
					{
						width: '100%',
						borderRadius: 10,
						marginBottom: 20,
						borderColor: hasFocus
							? Colors.textDark
							: hasError
							? Colors.warn
							: style && style.borderColor
							? style.borderColor
							: styles.inputWrapper.borderColor,
					},
					style,
				]}
				textInputStyle={[{padding: 0}, inputStyles]}
				textContainerStyle={{
					padding: 0,
					height: 55,
				}}
				// onChangeCountry={value => {
				// 	console.log(value, 'value /////');
				// 	setCountryCode(value.callingCode[0]);
				// 	// textChangeHandler(value);
				// }}
				onChangeCountry={value => {
					phoneInput.current?.setState({
						number: '',
					});
					setCountryCode(value.callingCode[0]);
					textChangeHandler('');
				}}
				onChangeText={textChangeHandler}
				autoFocus
			/>
			{(errorMessage || hasError) && (
				<View
					style={[
						styles.errorContainer,
						styles.baseErrorContainerStyle,
						errorContainerStyle,
					]}>
					<Text style={[styles.errorText, errorText]}>
						{errorMessage || form.errors[field.name]}
					</Text>
				</View>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	wrapper: {marginVertical: 10},
	baseErrorContainerStyle: {
		top: 52,
	},
	inputWrapper: {
		marginVertical: 5,
		borderRadius: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.backgroundColor,
		backgroundColor: Colors.backgroundColor,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	input: {
		padding: 5,
		height: 45,
		borderRadius: 10,
		width: '99%',
		color: Colors.textDark,
		backgroundColor: Colors.backgroundColor,
		fontSize: 16,
		fontFamily: FontConfig.primary.regular,
	},
	errorContainer: {
		marginVertical: 5,
		position: 'absolute',
		right: 0,
	},
	errorText: {
		fontFamily: FontConfig.primary.regular,
		color: Colors.warn,
		fontSize: 14,
		textTransform: 'lowercase',
	},
});

export default FormikPhoneInputComponent;
