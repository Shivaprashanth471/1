import React, {useState} from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import FontConfig from '../../constants/FontConfig';
import Colors from '../../constants/Colors';
import LabelComponent from './LabelComponent';
import {FieldProps} from 'formik';

export interface FormikInputComponentProps {
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
	trimSpaces?: boolean;
	trimSpecialCharacters?: boolean;
	trimNumbers?: boolean;
	trimLeft?: boolean;
	isEditable?: boolean;
	trimCharacters?: boolean;
	secureTextEntry?: any;
	errorMessage?: any;
}

const FormikInputComponent = (props: FormikInputComponentProps) => {
	const {
		labelText,
		formikField,
		inputProperties,
		onUpdate,
		trimSpaces,
		trimSpecialCharacters,
		trimNumbers,
		trimCharacters,
		errorMessage,
		errorText,
	} = props;
	const isEditable = props.isEditable !== undefined ? props.isEditable : true;

	const {field, form} = formikField;
	const [hasFocus, setHasFocus] = useState(false);

	// console.log({field, form, meta});
	const showLabel =
		props.showLabel !== undefined
			? props.showLabel
			: !!(labelText && labelText.length > 0);
	const inputStyles = props.inputStyles || {};
	const baseStyle = props.baseStyle || {};
	const inputWrapperStyle = props.inputWrapperStyle || {};
	const errorContainerStyle = props.errorContainerStyle || {};

	const hasError =
		form.touched[field.name] && form.errors && form.errors[field.name];
	const style: any = props.style || {
		borderColor: styles.inputWrapper.borderColor,
	};
	const trimLeft = props.trimLeft === undefined ? false : props.trimLeft;

	// const trimHandler =(text:string)=>{
	//   if (trimSpaces) {
	//
	//   }
	// }

	const textChangeHandler = (text: string) => {
		// console.log(form.dirty);
		if (trimSpaces) {
			text = text.replace(/ /g, '');
		}
		if (trimSpecialCharacters) {
			text = text.replace(/[^a-zA-Z0-9 ]/g, '');
		}
		if (trimNumbers) {
			text = text.replace(/[^a-zA-Z ]/g, '');
		}
		if (trimCharacters) {
			text = text.replace(/[^0-9 ]/g, '');
		}
		if (trimLeft) {
			text = text.trimLeft();
		}
		form.setFieldTouched(field.name);
		form.setFieldValue(field.name, text);
		// form.handleChange(field.name);
		if (onUpdate) {
			onUpdate(text);
		}
	};
	const onInputBlur = () => {
		setHasFocus(false);
		form.handleBlur(field.name);
		form.setFieldTouched(field.name);
	};
	const onFocus = () => {
		// form.setFieldTouched(field.name);
		setHasFocus(true);
	};

	return (
		<View style={[styles.inputBaseWrapper, baseStyle, inputWrapperStyle]}>
			{showLabel && <LabelComponent title={labelText || ''} />}
			<View
				style={[
					styles.inputWrapper,
					style,
					{
						borderColor: hasFocus
							? Colors.textDark
							: hasError
							? Colors.warn
							: style && style.borderColor
							? style.borderColor
							: styles.inputWrapper.borderColor,
					},
				]}>
				{/*{props.sideIcon && <Ionicons size={20} color={Colors.textLight} name={props.sideIcon}/>}*/}
				<TextInput
					placeholderTextColor={Colors.textLight}
					// selectionColor={Colors.textLight}
					style={[styles.input, inputStyles]}
					value={field.value.toString()}
					autoCapitalize={'none'}
					editable={isEditable}
					autoCorrect={false}
					autoCompleteType={'off'}
					onFocus={onFocus}
					nativeID={field.name}
					testID={field.name}
					onChangeText={textChangeHandler}
					onBlur={onInputBlur}
					{...inputProperties}
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
		fontFamily: FontConfig.primary.regular,
		fontSize: 14,
		// opacity: 0.8,
		color: Colors.textLight,
	},
	baseErrorContainerStyle: {
		top: -22,
	},

	inputWrapper: {
		marginVertical: 5,
		paddingHorizontal: 5,
		// borderRadius: 5,
		// borderWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: 1.5,
		borderColor: Colors.borderColor,
		// backgroundColor: Colors.backgroundShiftColor,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// height: 44,
	},
	input: {
		// height: 40,
		// borderRadius: 10,
		width: '100%',
		paddingHorizontal: 0,
		color: Colors.textDark,
		// backgroundColor: Colors.backgroundColor,
		fontFamily: FontConfig.primary.semiBold,
		fontSize: 18,
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

export default FormikInputComponent;
