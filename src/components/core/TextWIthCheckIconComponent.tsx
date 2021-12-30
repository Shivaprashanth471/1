import React, {useState, useCallback} from 'react';
import {Text, View, StyleProp, ViewStyle} from 'react-native';
import {Colors, FontConfig, ImageConfig} from '../../constants';

export interface TextWIthCheckIconComponent {
	leadingCheckIcon: boolean | false;
	shiftText?: string | '';
	checkColor?: string;
	checkBackgroundColor?: string;
	textColor?: string;
	style?: StyleProp<ViewStyle>;
}

const TextWIthCheckIconComponent = (props: TextWIthCheckIconComponent) => {
	const [lengthMore, setLengthMore] = useState(false);
	const [textShown, setTextShown] = useState(false);
	const shiftText = props.shiftText;
	const leadingCheckIcon = props.leadingCheckIcon || false;
	const checkColor = props.checkColor || Colors.backgroundColor;
	const checkBackgroundColor = props.checkBackgroundColor || Colors.primary;
	const textColor = props.textColor;
	const style = props.style;

	const onTextLayout = useCallback(e => {
		setLengthMore(e.nativeEvent.lines.length >= 4);
	}, []);
	const toggleNumberOfLines = () => {
		setTextShown(!textShown);
	};
	return (
		<>
			<View
				style={[
					style,
					{
						flexDirection: 'row',
						alignItems: 'center',
					},
				]}>
				{/* {leadingCheckIcon && (
					<ImageConfig.IconCheck
						color={checkColor}
						style={{
							backgroundColor: checkBackgroundColor,
							borderRadius: 100,
							marginRight: 10,
						}}
						height={'15'}
						width={'15'}
					/>
				)} */}

				<Text
					onTextLayout={onTextLayout}
					numberOfLines={textShown ? undefined : 4}
					style={{
						fontFamily: FontConfig.primary.regular,
						fontSize: 12,
						color: textColor || Colors.textDark,
					}}>
					{shiftText}
				</Text>
			</View>
			<View>
				{lengthMore ? (
					<Text
						onPress={toggleNumberOfLines}
						style={{
							lineHeight: 21,
							marginTop: 10,
							color: Colors.primary,
							fontFamily: FontConfig.primary.semiBold,
							fontSize: 12,
						}}>
						{textShown ? 'Read less...' : 'Read more...'}
					</Text>
				) : null}
			</View>
		</>
	);
};

export default TextWIthCheckIconComponent;
