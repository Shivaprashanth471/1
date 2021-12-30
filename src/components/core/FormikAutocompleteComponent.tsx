import React, {useCallback, useEffect, useState} from 'react';
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
import AutoCompleteComponent, {
	AutoCompleteComponentProps,
} from './AutoCompleteComponent';

export interface FormikAutocompleteComponentProps {
	showLabel?: boolean;
	labelText?: string;
	inputStyles?: StyleProp<TextStyle>;
	errorContainerStyle?: StyleProp<ViewStyle>;
	baseStyle?: StyleProp<ViewStyle>;
	style?: StyleProp<ViewStyle>;
	formikField: FieldProps;
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	disabled?: boolean;
	value?: string | any;
	onChange?: (item: any) => void;
	searchUrl?: string;
	searchKey?: string;
	secondarySearchKey?: string;
	extraPayload?: any;
	autoCompleteProps: AutoCompleteComponentProps;
	onUpdate?: (value: any) => void;
	keyExtractor?: (item: any) => void;
	allowEmpty?: boolean;
	isEditable?: boolean;
	valueExtractor?: (item: any) => void;
	emptyMessage?: string;
	errorMessage?: string;
	errorText?: any;
}

const FormikAutocompleteComponent = (
	props: FormikAutocompleteComponentProps,
) => {
	const {
		labelText,
		formikField,
		autoCompleteProps,
		searchKey,
		secondarySearchKey,
		allowEmpty,
		keyExtractor,
		valueExtractor,
		searchUrl,
		extraPayload,
		onUpdate,
		errorMessage,
		emptyMessage,
		isEditable,
		errorText,
	} = props;
	const {field, form} = formikField;
	const baseStyle = props.baseStyle || {};
	const errorContainerStyle = props.errorContainerStyle || {};
	const [selected, setSelected] = useState<any>(field.value);
	const disabled = props.disabled !== undefined ? props.disabled : false;

	useEffect(() => {
		setSelected(field.value);
	}, [field.value]);

	const onChange = useCallback(
		item => {
			console.log(item);
			setSelected(item);
			form.setFieldValue(field.name, item);
			form.setFieldTouched(field.name, true);
			if (onUpdate) {
				onUpdate(item);
			}
		},
		[field.name, form, onUpdate],
	);
	const hasError =
		errorMessage ||
		(form.touched[field.name] && form.errors && form.errors[field.name]);
	const style: any = props.style || {};

	return (
		<View style={[styles.inputBaseWrapper, baseStyle]}>
			<View style={[styles.inputWrapper, style]}>
				{hasError && (
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
				<View
					style={{
						flex: 1,
					}}>
					<AutoCompleteComponent
						keyExtractor={keyExtractor}
						valueExtractor={valueExtractor}
						disabled={disabled}
						emptyMessage={emptyMessage}
						searchUrl={searchUrl}
						secondarySearchKey={secondarySearchKey}
						searchKey={searchKey}
						extraPayload={extraPayload}
						labelText={labelText}
						value={selected}
						onChange={onChange}
						allowEmpty={allowEmpty}
						{...autoCompleteProps}
						isEditable={isEditable}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	inputBaseWrapper: {
		// marginVertical: 8,
		// borderBottomWidth: 1,
		// // borderBottomColor: Colors.textDark
	},
	label: {
		// marginBottom: 5,
	},
	labelText: {
		fontFamily: FontConfig.secondary.regular,
		fontSize: 14,
		// opacity: 0.8,
		color: Colors.textLight,
	},
	baseErrorContainerStyle: {
		top: 10,
	},

	inputWrapper: {
		// marginVertical: 5,
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

export default FormikAutocompleteComponent;
