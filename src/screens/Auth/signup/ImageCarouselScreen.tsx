import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CustomButton} from '../../../components/core';
import {Colors, FontConfig, ImageConfig, NavigateTo} from '../../../constants';
import {SliderBox} from 'react-native-image-slider-box';

const ImageCarouselScreen = (props: any) => {
	const navigation = props.navigation;
	const [width, setWidth] = useState<any>();
	const images = [
		'https://source.unsplash.com/1024x768/?nature',
		'https://source.unsplash.com/1024x768/?water',
		'https://source.unsplash.com/1024x768/?girl',
	];

	const onLayout = (e: any) => {
		setWidth(e.nativeEvent.layout.width);
	};
	return (
		<View style={{flexDirection: 'column', height: '100%'}}>
			<View
				style={{
					justifyContent: 'space-around',
					height: '100%',
				}}>
				<View style={{}}>
					<View
						onLayout={onLayout}
						style={{
							marginHorizontal: 20,
						}}>
						<SliderBox
							images={images}
							autoplay={true}
							circleLoop
							dotStyle={{
								width: 8,
								height: 8,
								borderRadius: 0,
							}}
							inactiveDotColor="#CCD3D8"
							dotColor={Colors.textDark}
							parentWidth={width}
							sliderBoxHeight={300}
							paginationBoxStyle={{
								position: 'absolute',
								bottom: -40,
								padding: 0,
								alignItems: 'center',
								alignSelf: 'center',
								justifyContent: 'center',
								paddingVertical: 10,
							}}
							imageLoadingColor={Colors.primary}
						/>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 50,
						}}>
						<Text style={styles.titleText}>Marketplace for</Text>
						<Text style={styles.titleText}>Healthcare Heroes</Text>
						<Text
							style={{
								fontFamily: FontConfig.primary.regular,
								fontSize: 12,
								color: Colors.textOnTextLight,
								marginTop: 10,
							}}>
							Find your flexible role with us
						</Text>
					</View>
				</View>
				<View>
					<CustomButton
						title={'Get Started'}
						onPress={() => {
							navigation.navigate(NavigateTo.EmailVerifyScreen);
						}}
						style={{
							marginHorizontal: 20,
						}}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	titleText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textDark,
	},
});

export default ImageCarouselScreen;
