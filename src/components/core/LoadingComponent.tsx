import React from 'react';
import {
	ActivityIndicator,
	StyleProp,
	StyleSheet,
	useWindowDimensions,
	View,
	ViewStyle,
} from 'react-native';
import {Colors} from '../../constants';
// import LottieView from 'lottie-react-native';

export interface LoadingComponentProps {
	backgroundColor?: string;
	color?: string;
	size?: 'large' | 'small';
	style?: StyleProp<ViewStyle>;
	isNormal?: boolean;
}

const LoadingComponent = (props: LoadingComponentProps) => {
	const backgroundColor = props.backgroundColor || 'white';
	const color = props.color || Colors.primary;
	const size = props.size || 'large';
	const style = props.style || {};
	const isNormal = true; //props.isNormal === undefined ? false : props.isNormal;
	const dimensions = useWindowDimensions();
	return (
		<View style={[styles.screen, style, {backgroundColor}]}>
			{isNormal && <ActivityIndicator color={color} size={size} />}
			{!isNormal && (
				<View
					style={{
						width: dimensions.width,
						height: dimensions.height * 0.6,
					}}>
					{/*<LottieView*/}
					{/*	source={require('../../assets/lottie/loading.json')}*/}
					{/*	autoPlay*/}
					{/*	autoSize={false}*/}
					{/*	speed={2}*/}
					{/*	loop*/}
					{/*/>*/}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
});

export default LoadingComponent;
