import React from 'react';
import {
	FlexStyle,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	View,
} from 'react-native';
import {Colors, FontConfig} from '../../constants';

export interface LabelComponentProps {
	title: string;
	style?: StyleProp<FlexStyle>;
	textStyle?: StyleProp<TextStyle>;
}

const LabelComponent = (props: LabelComponentProps) => {
	const {title, style, textStyle} = props;
	return (
		<View style={[styles.label, style]}>
			<Text style={[styles.labelText, textStyle]}>{title}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		justifyContent: 'center',
	},
	labelText: {
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
		fontSize: 14,
	},
});

export default LabelComponent;
