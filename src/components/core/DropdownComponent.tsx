import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
	TextStyle,
} from 'react-native';
import LabelComponent from './LabelComponent';
import ModalSelector from 'react-native-modal-selector-searchable';
import {FieldProps} from 'formik';
import {Colors} from '../../constants';
import FontConfig from '../../constants/FontConfig';

export interface DropdownComponentProps {
	data: [];
	labelText?: string;
	showLabel?: boolean;
	style?: StyleProp<ViewStyle>;
	inputWrapperStyle?: StyleProp<ViewStyle>;
	contentWrapper?: StyleProp<ViewStyle>;
	errorContainerStyle?: StyleProp<ViewStyle>;
	formikField: FieldProps;
	onUpdate?: (value: any) => void;
	isRequired?: boolean;
	search?: boolean;
	placeholder?: string;
	disabled?: boolean;
	textStyle?: StyleProp<TextStyle>;
}

const DropdownComponent = (
	props: PropsWithChildren<DropdownComponentProps>,
) => {
	const {
		data,
		labelText,
		formikField,
		onUpdate,
		contentWrapper,
		search,
		textStyle,
	} = props;
	const placeholder = props.placeholder || 'select value';
	const disabled = props.disabled || false;
	const {field, form} = formikField;
	const showLabel =
		props.showLabel !== undefined
			? props.showLabel
			: !!(labelText && labelText.length > 0);

	const isRequired = props.isRequired !== undefined ? props.isRequired : true;
	const hasError =
		form.touched[field.name] && form.errors && form.errors[field.name];
	const style: any = props.style || {
		borderColor: styles.inputWrapper.borderColor,
	};
	const errorContainerStyle = props.errorContainerStyle || {};
	const [dropdownList, setDropdownList] = useState<any[]>([]);

	useEffect(() => {
		const options: any[] = [];
		data.forEach((item: any) => {
			const option = {
				key: item.value,
				label: item.label,
			};
			options.push(option);
		});
		setDropdownList(options);
	}, [data]);

	const ListItem = ({data}: any) => {
		return (
			<View key={data.key}>
				<Text
					style={
						field.value === data.key
							? {color: Colors.primary}
							: {color: 'black'}
					}>
					{data.label}
				</Text>
			</View>
		);
	};

	return (
		<View style={[{marginVertical: 10, marginHorizontal: 20}, contentWrapper]}>
			{showLabel && (
				<View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
					<LabelComponent title={labelText || ''} textStyle={textStyle} />
					{/*{isRequired && (*/}
					{/*	<Text style={{color: Colors.primary, top: -4}}>*</Text>*/}
					{/*)}*/}
				</View>
			)}
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
				<ModalSelector
					data={dropdownList}
					style={{flex: 1, justifyContent: 'center'}}
					overlayStyle={{paddingTop: 80}}
					selectStyle={styles.picker}
					selectTextStyle={styles.pickerTxt}
					initValueTextStyle={styles.placeholderTxt}
					initValue={placeholder ? placeholder : 'select'}
					selectedKey={field.value}
					search={search}
					onChange={option => {
						form.setFieldTouched(field.name);
						form.setFieldValue(field.name, option.key);
						form.handleChange(field.name);
						if (onUpdate) {
							onUpdate(option.key);
						}
					}}
					componentExtractor={option => <ListItem data={option} />}
					disabled={disabled}
				/>
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
		</View>
	);
};

const styles = StyleSheet.create({
	inputWrapper: {
		height: 46,
		borderWidth: 1.5,
		borderRadius: 5,
		borderColor: Colors.borderColor,
		// padding: 0,
		backgroundColor: Colors.backgroundShiftColor,
		marginTop: 10,
		// paddingHorizontal: 10,
		// marginBottom: 10,
		justifyContent: 'center',
	},
	picker: {
		borderColor: 'transparent',
		height: 46,
	},
	pickerTxt: {
		flex: 1,
		textAlign: 'left',
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
		marginTop: 2,
	},
	placeholderTxt: {
		alignSelf: 'flex-start',
		marginTop: 2,
	},
	baseErrorContainerStyle: {
		top: -20,
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

export default DropdownComponent;
