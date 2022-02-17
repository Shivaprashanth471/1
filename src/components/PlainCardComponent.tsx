import React, {PropsWithChildren} from 'react';
import {
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
	useWindowDimensions,
} from 'react-native';
import {Colors} from '../constants';
import {CommonFunctions} from '../helpers';

export interface PlainCardComponentProps {
	style?: StyleProp<ViewStyle>;
	collapsable?: boolean;
	isLoading?: boolean;
	loadingPercent?: number;
}

const PlainCardComponent = (
	props: PropsWithChildren<PlainCardComponentProps>,
) => {
	const style = props.style || {};
	const collapsable =
		props.collapsable === undefined ? false : props.collapsable;
	const isLoading = props.isLoading || false;
	const loadingPercent = props.loadingPercent || 0;
	const dimensions = useWindowDimensions();

	return (
		<View collapsable={collapsable} style={[styles.wrapper, style]}>
			<View
				style={[
					styles.progressBarHolder,
					{width: dimensions.width - 40, opacity: isLoading ? 1 : 0},
				]}>
				<View style={[styles.progressBar, {width: loadingPercent + '%'}]} />
			</View>
			{props.children}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: CommonFunctions.getWidth() - 250,
		backgroundColor: Colors.backgroundColor,
		borderRadius: 5,
		marginHorizontal: 20,
		marginVertical: 10,
		paddingHorizontal: 10,
		paddingVertical: 14,
		...CommonFunctions.getElevationStyle(8),
	},
	progressBarHolder: {
		backgroundColor: Colors.backdropColor,
		// borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.borderColor,
		width: '100%',
		position: 'absolute',
		top: 0,
		// left: 0,
		// right: 0,
		height: 4,
		borderRadius: 8,
	},

	progressBar: {
		// color: '#0dd2b9',
		backgroundColor: Colors.textDark,
		width: '0%',
		height: 4,
		borderRadius: 8,
	},
});

export default PlainCardComponent;
