import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
	Animated,
	StyleProp,
	StyleSheet,
	TextStyle,
	ViewStyle,
	TouchableOpacity,
	View,
} from 'react-native';
import {Colors, FontConfig} from '../../constants';
import LabelComponent from './LabelComponent';

export interface RadioButtonComponentProps {
	checked?: boolean;
	style?: StyleProp<ViewStyle>;
	value?: string | number | boolean;
	onChange?: (value: string | number | boolean | undefined) => void;
	label?: string;
	class?: 'primary' | 'secondary' | 'success';
	size?: 'xs' | 'sm' | 'md' | 'lg';
	labelStyle?: StyleProp<TextStyle>;
	disabled?: boolean;
}

const sizesWrapper = {
	xs: {
		width: 20,
		height: 20,
		borderRadius: 10,
	},
	sm: {
		width: 24,
		height: 24,
		borderRadius: 12,
	},
	md: {
		width: 28,
		height: 28,
		borderRadius: 14,
	},
	lg: {
		width: 36,
		height: 36,
		borderRadius: 18,
	},
};
const sizesInner = {
	xs: 10,
	sm: 14,
	md: 19,
	lg: 26,
};

const RadioButtonComponent = (props: RadioButtonComponentProps) => {
	const {checked, onChange, value, label, disabled} = props;

	const size = props.size || 'sm';
	const style = props.style || {};
	const className = props.class || 'primary';
	const labelStyle = props.labelStyle || {};

	const [isSelected, setIsSelected] = useState(!!checked);
	const animationValue = useRef(new Animated.Value(0)).current;

	const updateSelected = useCallback(
		(checked: boolean) => {
			setIsSelected(checked);
			if (onChange) {
				onChange(value);
			}
		},
		[onChange, value],
	);

	useEffect(() => {
		setIsSelected(!!checked);
	}, [checked]);

	useEffect(() => {
		const toValue = isSelected ? sizesInner[size] : 0;
		Animated.timing(animationValue, {
			useNativeDriver: false, //Add this line
			toValue,
			duration: 100,
		}).start();
	}, [animationValue, isSelected, size]);

	const fillColor =
		className === 'primary'
			? Colors.approved
			: className === 'secondary'
			? Colors.textDark
			: Colors.success;

	const fillBorderColor =
		className === 'primary'
			? Colors.primary
			: className === 'secondary'
			? Colors.textDark
			: Colors.success;

	return (
		<TouchableOpacity
			style={[styles.mainWrapper, style]}
			activeOpacity={disabled ? 1 : 0.9}
			onPress={() => {
				if (!disabled) {
					updateSelected(true);
				}
			}}>
			<View
				style={[
					styles.radioCircle,
					sizesWrapper[size],
					{borderColor: isSelected ? fillBorderColor : Colors.textLight},
				]}>
				<Animated.View
					style={[
						styles.radioFill,
						{backgroundColor: fillColor},
						{width: animationValue, height: animationValue},
					]}
				/>
			</View>
			{!!label && (
				<LabelComponent
					style={styles.labelHolder}
					textStyle={disabled ? styles.labeltext : labelStyle}
					title={label}
				/>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	mainWrapper: {
		flex: 0,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		padding: 4,
	},
	radioCircle: {
		// borderColor: 'gray',
		width: 28,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		// padding: 2,
		borderRadius: 14,
	},

	radioFill: {
		backgroundColor: Colors.primary,
		width: 18,
		height: 18,
		borderRadius: 20,
	},
	labelHolder: {
		margin: 5,
		marginRight: 20,
		flex: 0,
	},
	labeltext: {
		color: Colors.textLight,
		fontFamily: FontConfig.primary.bold,
	},
});

export default RadioButtonComponent;
