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
import LabelComponent from './LabelComponent';
import {FieldProps} from 'formik';
import RadioButtonComponent from './RadioButtonComponent';

export interface RadioButtonType {
	id: string | number | boolean;
	title: string;
	disabled?: boolean;
}

export interface FormikRadioGroupComponentProps {
	radioButtons: RadioButtonType[];
	showLabel?: boolean;
	labelText?: string;
	labelDarkText?: string;
	inputStyles?: StyleProp<TextStyle>;
	labelStyle?: StyleProp<TextStyle>;
	errorText?: StyleProp<TextStyle>;
	errorContainerStyle?: StyleProp<ViewStyle>;
	baseStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	style?: StyleProp<ViewStyle>;
	radioStyle?: StyleProp<ViewStyle>;
	buttonStyle?: StyleProp<ViewStyle>;
	formikField: FieldProps;
	onUpdate?: (value: any) => void;
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}

const FormikRadioGroupComponent = (props: FormikRadioGroupComponentProps) => {
	const {
		labelText,
		labelDarkText,
		radioStyle,
		radioButtons,
		formikField,
		onUpdate,
		labelStyle,
		errorText,
		textStyle,
	} = props;
	const {field, form} = formikField;
	const direction = props.direction || 'row';
	const showLabel =
		props.showLabel !== undefined
			? props.showLabel
			: !!(labelText && labelText.length > 0);
	const baseStyle = props.baseStyle || {};
	const errorContainerStyle = props.errorContainerStyle || {};
	const [selectedRadio, setSelectedRadio] = useState<
		string | number | boolean | undefined
	>(field.value);
	// const textChangeHandler = (text: string) => {
	//   // console.log(form.dirty);
	//   form.setFieldTouched(field.name);
	//   form.setFieldValue(field.name, text);
	//   form.handleChange(field.name);
	// };

	useEffect(() => {
		setSelectedRadio(field.value);
	}, [field.value]);

	const hasError =
		form.touched[field.name] && form.errors && form.errors[field.name];
	const style: any = props.style || {};

	return (
		<View style={[styles.inputBaseWrapper, baseStyle]}>
			{showLabel ? (
				<LabelComponent
					style={[{paddingBottom: 5}, textStyle]}
					title={labelText || ''}
				/>
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
					style={[
						{
							flex: 1,
							flexWrap: 'wrap',
							flexDirection: direction,
							alignItems: direction === 'row' ? 'flex-start' : 'flex-start',
							justifyContent: direction === 'row' ? 'flex-start' : 'flex-start',
						},
						props.buttonStyle,
					]}>
					{radioButtons &&
						radioButtons.map(radioButton => {
							return (
								<RadioButtonComponent
									disabled={radioButton.disabled}
									style={[
										{
											marginBottom: 6,
											justifyContent: 'flex-start',
											alignItems: 'center',
										},
										radioStyle,
									]}
									checked={selectedRadio === radioButton.id}
									labelStyle={[
										{fontSize: 13, color: Colors.textDark},
										labelStyle,
									]}
									key={radioButton.id + '_' + radioButton.title}
									label={radioButton.title}
									onChange={value => {
										if (!radioButton.disabled) {
											setSelectedRadio(value);
											form.setFieldTouched(field.name, true);
											form.setFieldValue(field.name, value);
											if (onUpdate) {
												onUpdate(value);
											}
										}
									}}
									size={'xs'}
									value={radioButton.id}
								/>
							);
						})}
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
		color: Colors.textLight,
	},
	baseErrorContainerStyle: {
		top: -23,
	},

	inputWrapper: {
		marginVertical: 0,
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

export default FormikRadioGroupComponent;
