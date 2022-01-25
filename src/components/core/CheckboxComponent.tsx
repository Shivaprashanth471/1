import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
	Animated,
	StyleProp,
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
} from 'react-native';
import {Colors, ImageConfig} from '../../constants';
import LabelComponent from './LabelComponent';

export interface CheckboxComponentProps {
	checked?: boolean;
	onChange?: (isChecked: boolean) => void;
	label?: string;
	class?: 'primary' | 'secondary' | 'success';
	labelStyle?: StyleProp<TextStyle>;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	disabled?: boolean;
}

const sizesWrapper = {
	xs: {
		width: 20,
		height: 20,
	},
	sm: {
		width: 24,
		height: 24,
	},
	md: {
		width: 28,

		height: 28,
	},
	lg: {
		width: 36,
		height: 36,
	},
};

const CheckboxComponent = (props: CheckboxComponentProps) => {
	const {checked, onChange, label, labelStyle, disabled} = props;
	const size = props.size || 'sm';
	const className = props.class || 'primary';

	const [isChecked, setIsChecked] = useState(!!checked);
	const animationValue = useRef(new Animated.Value(0)).current;
	const updateChecked = useCallback(
		(checked: boolean) => {
			setIsChecked(checked);
			if (onChange) {
				onChange(checked);
			}
		},
		[onChange, setIsChecked],
	);

	useEffect(() => {
		setIsChecked(!!checked);
	}, [checked]);

	useEffect(() => {
		const toValue = isChecked ? styles.checkInner.opacity : 0;
		Animated.timing(animationValue, {
			useNativeDriver: true, //Add this line
			toValue,
			duration: 100,
		}).start();
	}, [animationValue, isChecked]);

	const borderColor =
		className === 'primary'
			? Colors.primary
			: className === 'secondary'
			? Colors.textDark
			: Colors.success;
	const textColor =
		className === 'primary'
			? Colors.backgroundColor
			: className === 'secondary'
			? Colors.textOnTextDark
			: Colors.textOnSuccess;

	return (
		<TouchableOpacity
			style={[styles.mainWrapper]}
			activeOpacity={disabled ? 1 : 0.9}
			onPress={() => {
				if (!disabled) {
					updateChecked(!isChecked);
					console.log('checked');
				}
			}}>
			<View
				style={[
					styles.checkBox,
					sizesWrapper[size],
					{borderColor: isChecked ? borderColor : Colors.primary},
				]}>
				<Animated.View
					style={[
						styles.checkInner,
						{backgroundColor: isChecked ? borderColor : Colors.backgroundColor},
						sizesWrapper[size],
						{opacity: animationValue},
					]}>
					<ImageConfig.IconCheck
						color={textColor}
						width={sizesWrapper[size].width}
						height={sizesWrapper[size].height}
					/>
				</Animated.View>
			</View>
			{!!label && (
				<LabelComponent
					style={styles.labelHolder}
					title={label}
					textStyle={[
						styles.labelStyle,
						{color: disabled ? Colors.textLight : Colors.textDark},
						labelStyle,
					]}
				/>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	mainWrapper: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 4,
		alignSelf: 'flex-start',
	},
	checkBox: {
		// borderColor: Colors.primary,
		marginVertical: 3,
		width: 28,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		padding: 2,
		// overflow: 'hidden',
		borderRadius: 50,
		marginBottom: 5,
	},

	checkInner: {
		opacity: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: Colors.primary,
		width: 26,
		borderRadius: 50,
		height: 26,
		paddingBottom: 3,
	},
	labelHolder: {marginHorizontal: 5},
	labelStyle: {
		fontSize: 13,
		color: Colors.textDark,
	},
});
export default CheckboxComponent;
