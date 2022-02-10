import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
	Image,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
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
		placeholder,
	} = props;
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
				key: item.name,
				label: item.code,
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
					<LabelComponent title={labelText || ''} />
					{isRequired && <Text style={{color: Colors.primary, top: -4}}></Text>}
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
					overlayStyle={{paddingTop: 80}}
					selectStyle={styles.picker}
					selectTextStyle={styles.pickerTxt}
					initValueTextStyle={styles.placeholderTxt}
					initValue={placeholder ? placeholder : ''}
					selectedKey={field.value}
					search={search}
					onChange={option => {
						console.log(option, 'From Modal Selector');
						form.setFieldTouched(field.name);
						form.handleChange(field.name);
						let value = option;
						if (typeof option === 'object') {
							value = option.key;
						}
						form.setFieldValue(field.name, value);
						if (onUpdate) {
							onUpdate(value);
						}
					}}
					componentExtractor={option => <ListItem data={option} />}
				/>
				<Image
					style={styles.dropdownIcon}
					source={require('../../assets/images/dropdown.png')}
					resizeMode={'contain'}
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
		backgroundColor: Colors.backgroundColor,
		marginTop: 10,
		// paddingHorizontal: 10,
		// marginBottom: 10,
		justifyContent: 'center',
	},
	picker: {
		borderColor: 'transparent',
		height: 46,
		paddingRight: 24,
	},
	pickerTxt: {
		flex: 1,
		textAlign: 'left',
		marginTop: 5,
	},
	placeholderTxt: {
		alignSelf: 'flex-start',
		marginTop: 5,
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
	dropdownIcon: {
		position: 'absolute',
		marginTop: 10,
		right: 0,
		// alignSelf: 'center',
		width: 30,
		height: 20,
	},
});

export default DropdownComponent;
