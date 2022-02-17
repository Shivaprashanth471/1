import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, FontConfig} from '../constants';

export interface ReviewBoxComponentProps {
	reviewText?: string;
	rating?: any;
}

const ReviewBoxComponent = (props: ReviewBoxComponentProps) => {
	const reviewText = props.reviewText;
	const rating = props.rating;
	const [textShown, setTextShown] = useState<boolean>(false);
	const [lengthMore, setLengthMore] = useState<boolean>(false);

	const onTextLayout = useCallback(e => {
		setLengthMore(e.nativeEvent.lines.length >= 4);
	}, []);
	const toggleNumberOfLines = () => {
		setTextShown(!textShown);
	};

	return (
		<>
			<>
				<View style={styles.screen}>
					<View
						style={{
							backgroundColor:
								rating < 3
									? 'red'
									: rating >= 3 && rating < 4
									? 'orange'
									: Colors.primary,
							width: 55,
							paddingVertical: 5,
							paddingHorizontal: 5,
							borderRadius: 6,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Text
							style={{
								fontFamily: FontConfig.primary.semiBold,
								fontSize: 13,
								color: 'white',
								textAlignVertical: 'center',
							}}>
							{rating ? rating : 'N/A'}
						</Text>
					</View>
					<View
						style={{
							marginTop: 20,
						}}>
						<Text
							onTextLayout={onTextLayout}
							numberOfLines={textShown ? undefined : 4}
							style={{
								fontFamily: FontConfig.primary.semiBold,
								fontSize: 14,
								color: Colors.textLight,
							}}>
							{reviewText}
						</Text>
						{lengthMore ? (
							<Text
								onPress={toggleNumberOfLines}
								style={{
									lineHeight: 21,
									marginTop: 10,
									color: Colors.primary,
									fontFamily: FontConfig.primary.semiBold,
									fontSize: 13,
									textDecorationLine: 'underline',
								}}>
								{textShown ? 'Read less...' : 'Read more...'}
							</Text>
						) : null}
					</View>
				</View>
			</>
		</>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		marginBottom: 20,
		minHeight: 140,
		padding: 20,
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
		borderRadius: 9,
	},
});

export default ReviewBoxComponent;
