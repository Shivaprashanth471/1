import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colors, ImageConfig} from '../constants';

export interface ChatTypeSchema {
	orientation: 'string';
	chatText: 'string';
}

const ChatBubbleComponent = (props: any) => {
	const orientation = props.orientation;
	const chatText = props.chatText;
	return (
		<View
			style={[
				orientation === 'left'
					? {alignItems: 'flex-end'}
					: {alignItems: 'flex-start'},
			]}>
			<View
				style={[
					orientation === 'left'
						? {flexDirection: 'row'}
						: {flexDirection: 'row-reverse'},
					{
						alignItems: 'center',
					},
				]}>
				<View
					style={
						orientation === 'left'
							? styles.bubbleContainerLeft
							: styles.bubbleContainerRight
					}>
					<Text>{chatText}</Text>
				</View>
				<Image
					source={ImageConfig.placeholder}
					style={{
						width: 30,
						height: 30,
						resizeMode: 'contain',
						marginHorizontal: 5,
					}}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: 'flex-end',
	},
	bubbleContainerRight: {
		flexDirection: 'row',
		backgroundColor: Colors.borderColor,
		paddingHorizontal: 10,
		paddingVertical: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		maxWidth: '70%',
		marginVertical: 10,
		borderBottomRightRadius: 30,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	bubbleContainerLeft: {
		flexDirection: 'row-reverse',
		backgroundColor: Colors.primary,
		paddingHorizontal: 10,
		paddingVertical: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		maxWidth: '70%',
		marginVertical: 10,
		borderBottomLeftRadius: 30,
		alignItems: 'flex-end',
	},
});

export default ChatBubbleComponent;
