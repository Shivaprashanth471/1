import React from 'react';
import {StyleSheet, Text, View, StatusBar, ImageBackground} from 'react-native';
import {CommonStyles, CommonFunctions} from '../helpers';
import {Colors, FontConfig, ImageConfig, NavigateTo} from '../constants';
import BaseViewComponent from '../components/core/BaseViewComponent';
import CustomButton from '../components/core/CustomButton';
// import { SliderBox } from "react-native-image-slider-box";

const WelcomeScreen = (props: any) => {
	const navigation = props.navigation;
	const gotoLogin = () => {
		navigation.navigate(NavigateTo.Auth);
	};

	return (
		<BaseViewComponent noScroll={true} normal={true}>
			<StatusBar
				barStyle={'light-content'}
				animated={true}
				backgroundColor={Colors.backdropColor}
			/>
			<View
				style={{
					height: '100%',
					justifyContent: 'space-between',
				}}>
				<View>
					<View style={styles.wrapper}>
						{
							<View>
								<ImageBackground
									source={ImageConfig.welcomeImg1}
									resizeMethod={'auto'}
									resizeMode={'contain'}
									style={{
										// marginBottom: 0,
										height: 250,

										width: CommonFunctions.getWidth() * 0.8,
									}}
								/>
							</View>
						}
					</View>
					<View style={styles.header}>
						<View style={{}}>
							<Text style={styles.headerText}>
								Marketplace for Healthcare Heroes
							</Text>
						</View>
						<View style={styles.subHeadingHolder}>
							<Text style={styles.subHeading}>
								Find your flexible role with us
							</Text>
						</View>
					</View>
				</View>
				<View>
					<CustomButton
						title={'Get Started'}
						onPress={gotoLogin}
						style={styles.button}
						// disabled={!isValid}
						// class={'primary'}
					/>
				</View>
			</View>
		</BaseViewComponent>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		flex: 0,
		justifyContent: 'center',
		// alignItems: 'center',
		marginTop: 30,
		marginHorizontal: 20,
	},
	logo: {
		flex: 1,
		justifyContent: 'center',
		marginTop: 20,
		alignItems: 'center',
	},
	screen: {
		padding: 10,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	header: {
		flex: 0,
		marginVertical: 20,
		justifyContent: 'center',
		flexDirection: 'column',
	},
	headerText: {
		textAlign: 'center',
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
		marginHorizontal: 50,
	},
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'center',
		fontSize: 12,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textDark,
	},
	button: {
		marginVertical: 40,
		marginHorizontal: 20,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
});

export default WelcomeScreen;
