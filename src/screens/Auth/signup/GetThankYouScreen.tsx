import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {Colors, FontConfig, NavigateTo} from '../../../constants';
import {CustomButton} from '../../../components/core';

const GetThankYouScreen = (props: any) => {
	const navigation = props.navigation;
	// const {GetHcpBasicDetailsPayload}: any = props.route.params;
	// console.log(GetHcpBasicDetailsPayload);

	return (
		<>
			<StatusBar
				barStyle={'light-content'}
				animated={true}
				backgroundColor={Colors.backgroundShiftColor}
			/>
			<View style={styles.screen}>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Text
						style={{
							fontFamily: FontConfig.primary.bold,
							fontSize: 26,
							color: Colors.primary,
							textAlign: 'center',
						}}>
						Thank you!
					</Text>
					<Text
						style={{
							textAlign: 'center',
							maxWidth: '90%',
							color: Colors.textLight,
							fontFamily: FontConfig.primary.semiBold,
						}}>
						we have received your application, our team will get back to you
						shortly
					</Text>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						width: '45%',
					}}>
					<CustomButton
						title={'Done'}
						style={styles.button}
						onPress={() => {
							navigation.navigate(NavigateTo.Signin);
						}}
					/>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		padding: 20,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.backgroundShiftColor,
	},
	button: {
		marginVertical: 40,
		width: '100%',
	},
});

export default GetThankYouScreen;
