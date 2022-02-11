import React, {useState, useCallback} from 'react';
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	TouchableOpacity,
} from 'react-native';
import {
	Colors,
	FontConfig,
	ImageConfig,
	NavigateTo,
	ENV,
} from '../../../constants';
import {CustomButton} from '../../../components/core';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../../helpers';
import {CONTACTUS_PHONE_NUMBER} from '../../../helpers/CommonFunctions';

const GetThankYouScreen = (props: any) => {
	const navigation = props.navigation;
	const GetHcpBasicDetailsPayload: any = props.route.params;

	const [phone, setPhone] = useState(CONTACTUS_PHONE_NUMBER);
	const [isLoading, setIsLoading]: any = useState(false);

	const signupClose = useCallback(() => {
		setIsLoading(true);
		const payload = {
			hcp_id: GetHcpBasicDetailsPayload.GetHcpBasicDetailsPayload,
		};

		ApiFunctions.post(ENV.apiUrl + 'hcp/signUPNotification', payload)
			.then(async resp => {
				if (resp && resp.success) {
					navigation.navigate(NavigateTo.Signin);
				} else {
					ToastAlert.show('Something went wrong!!');
				}
				setIsLoading(false);
			})
			.catch((err: any) => {
				setIsLoading(false);
				console.log('Error in api', err);
				ToastAlert.show('Something went wrong!!');
			});
	}, [GetHcpBasicDetailsPayload.GetHcpBasicDetailsPayload, navigation]);

	return (
		<>
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
								signupClose();
							}}
							isLoading={isLoading}
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
