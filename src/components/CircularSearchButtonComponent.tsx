import React, {useCallback} from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
	ViewStyle,
} from 'react-native';
import {Colors, FontConfig, ImageConfig, NavigateTo} from '../constants';
import {CommonFunctions} from '../helpers';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

export interface DiamondPlusButtonComponentProps {
	iconColor?: string;
	backgroundColor?: string;
	text?: string;
	textColor?: string;
	style?: StyleProp<ViewStyle>;
	innerStyle?: StyleProp<ViewStyle>;
	onPress?: () => void;
	touchProps?: TouchableOpacityProps;
}

const CircularSearchButtonComponent = (
	props: DiamondPlusButtonComponentProps,
) => {
	const navigation = useNavigation();
	const iconColor = Colors.textOnPrimary;
	const backgroundColor = props.backgroundColor || Colors.primary;
	const text = props.text || false;
	const textColor = props.textColor || Colors.primary;
	const style = props.style || {};
	const innerStyle = props.innerStyle || {};
	const touchProps = props.touchProps || {};
	const fallBack = useCallback(() => {
		navigation.navigate(NavigateTo.FindShifts);
	}, [navigation]);
	const onPress = props.onPress || fallBack;

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={onPress}
			style={[styles.holder, style]}
			{...touchProps}>
			<View style={[styles.headWrapper, {backgroundColor}, innerStyle]}>
				<LinearGradient
					colors={Colors.gradients[0]}
					style={[{borderRadius: 100}]}
					start={{x: 0.5, y: 0}}
					end={{x: 0.5, y: 1}}>
					<View style={styles.wrapper}>
						<ImageConfig.FindShiftIcon
							color={iconColor}
							height="50"
							// style={[{transform: [{rotate: '-45deg'}]}]}
						/>
					</View>
				</LinearGradient>
			</View>
			{text && (
				<View style={[styles.textHolder]}>
					<Text style={[styles.text, {color: textColor}]}>{text}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	holder: {
		marginBottom: 5,
		paddingBottom: 3,
		// bottom: 0,
		height: 80,
		// backgroundColor: 'red',
		justifyContent: 'center',
		position: 'absolute',
		zIndex: 10,
		alignItems: 'center',
	},
	headWrapper: {
		width: 57,
		// marginBottom: 10,
		// padding: 10,
		height: 57,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100,
		// transform: [{rotate: '45deg'}],
		...CommonFunctions.getElevationStyle(8, Colors.primary),
	},
	wrapper: {
		width: 48,
		// marginBottom: 8,
		// padding: 10,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100,
		// backgroundColor: 'green',
	},
	textHolder: {
		marginBottom: 5,
		paddingTop: 3,
		position: 'relative',
	},
	text: {
		fontFamily: FontConfig.primary.semiBold,
		fontSize: 12,
		color: Colors.primary,
		// textTransform: 'uppercase',
	},
});

export default CircularSearchButtonComponent;
