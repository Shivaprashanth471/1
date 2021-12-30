import React, {PropsWithChildren} from 'react';
import {KeyboardAvoidingView, StyleProp, ViewStyle} from 'react-native';
import {CommonFunctions, CommonStyles} from '../../helpers';

interface KeyboardAvoidCommonViewProps {
	style?: StyleProp<ViewStyle>;
}

const behaviorProps: any = {};
if (CommonFunctions.isIOS()) {
	behaviorProps.behavior = 'padding';
}

const KeyboardAvoidCommonView = (
	props: PropsWithChildren<KeyboardAvoidCommonViewProps>,
) => {
	const style = props.style || {};
	// return props.children;
	return (
		<KeyboardAvoidingView style={[CommonStyles.flex, style]} {...behaviorProps}>
			{props.children}
		</KeyboardAvoidingView>
	);
};

export default KeyboardAvoidCommonView;
