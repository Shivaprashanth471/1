import React, {useEffect, useRef} from 'react';
import {
	Animated,
	StyleProp,
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import {Colors} from '../../constants';
import LabelComponent from './LabelComponent';

export interface ToggleSwitchComponentProps {
	isOn: boolean;
	label?: string;
	onColor?: string;
	offColor?: string;
	size?: 'small' | 'large' | 'medium';
	labelStyle?: TextStyle;
	onToggle?: (isOn: boolean) => void;
	icon?: any;
	disabled?: boolean;
}

const ToggleSwitchComponent = (props: ToggleSwitchComponentProps) => {
	const defaultProps = {
		isOn: false,
		onColor: Colors.primary,
		offColor: Colors.textLight,
		size: 'medium',
		labelStyle: {},
		thumbOnStyle: {},
		thumbOffStyle: {},
		trackOnStyle: {},
		trackOffStyle: {},
		icon: null,
		disabled: false,
	};
	// @ts-ignore
	props = {...defaultProps, ...props};
	const {isOn, onToggle, disabled, label, icon, size, offColor, onColor} =
		props;

	const calculateDimensions = (size: string) => {
		switch (size) {
			case 'small':
				return {
					width: 40,
					padding: 10,
					circleWidth: 15,
					circleHeight: 15,
					translateX: 22,
				};
			case 'large':
				return {
					width: 70,
					padding: 20,
					circleWidth: 30,
					circleHeight: 30,
					translateX: 38,
				};
			default:
				return {
					width: 46,
					padding: 12,
					circleWidth: 18,
					circleHeight: 18,
					translateX: 26,
				};
		}
	};

	const offsetX = useRef(new Animated.Value(0)).current;
	const dimensions = calculateDimensions(size || defaultProps.size);

	const createToggleSwitchStyle = (): StyleProp<ViewStyle> => ({
		justifyContent: 'center',
		width: dimensions.width,
		borderRadius: 20,
		padding: dimensions.padding,
		backgroundColor: isOn ? onColor : offColor,
		...(isOn ? defaultProps.trackOnStyle : defaultProps.trackOffStyle),
	});

	const createInsideCircleStyle: any = () => ({
		alignItems: 'center',
		justifyContent: 'center',
		margin: 4,
		position: 'absolute',
		backgroundColor: 'white',
		transform: [{translateX: offsetX}],
		width: dimensions.circleWidth,
		height: dimensions.circleHeight,
		borderRadius: dimensions.circleWidth / 2,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2.5,
		elevation: 1.5,
		...(isOn ? defaultProps.thumbOnStyle : defaultProps.thumbOffStyle),
	});

	useEffect(() => {
		const toValue = isOn ? dimensions.width - dimensions.translateX : 0;

		Animated.timing(offsetX, {
			useNativeDriver: true, //Add this line
			toValue,
			duration: 300,
		}).start();
	}, [dimensions.translateX, dimensions.width, isOn, offsetX]);

	return (
		<View style={styles.container}>
			{!!label && <LabelComponent style={styles.labelStyle} title={label} />}
			<TouchableOpacity
				style={createToggleSwitchStyle()}
				activeOpacity={0.8}
				onPress={() => (disabled ? null : onToggle ? onToggle(!isOn) : null)}>
				<Animated.View style={createInsideCircleStyle()}>{icon}</Animated.View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	labelStyle: {
		marginHorizontal: 10,
	},
});
export default ToggleSwitchComponent;
