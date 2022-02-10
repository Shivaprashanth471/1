import React, {useState} from 'react';
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	TouchableOpacity,
} from 'react-native';
import {Colors, FontConfig, ImageConfig, NavigateTo} from '../../../constants';
import {CustomButton} from '../../../components/core';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../../helpers';
import {CONTACTUS_PHONE_NUMBER} from '../../../helpers/CommonFunctions';

const GetThankYouScreen = (props: any) => {
	const navigation = props.navigation;
	// const {GetHcpBasicDetailsPayload}: any = props.route.params;
	// console.log(GetHcpBasicDetailsPayload);
	const [phone, setPhone] = useState(CONTACTUS_PHONE_NUMBER);

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
				<View>
					<View
						style={{
							// backgroundColor: 'red',
							marginTop: 80,
							alignItems: 'center',
						}}>
						<Text>For any queries, please contact</Text>
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								marginTop: 15,
							}}
							onPress={() => {
								CommonFunctions.openCall(phone);
							}}>
							<ImageConfig.CallIcon height={25} width={25} />
							<Text
								style={{
									fontFamily: FontConfig.primary.semiBold,
									fontSize: 18,
									color: Colors.textOnAccent,
									marginLeft: 10,
								}}>
								+18187221230
							</Text>
						</TouchableOpacity>
					</View>
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
