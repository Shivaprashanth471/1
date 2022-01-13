import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
	Alert,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {ApiFunctions, CommonStyles} from '../../../helpers';
import {Colors, ENV, FontConfig, NavigateTo} from '../../../constants';
import {
	BaseViewComponent,
	ProfileDetailsContainerComponent,
	ErrorComponent,
	LoadingComponent,
	CustomButton,
} from '../../../components/core';
import {StateParams} from '../../../store/reducers';
import moment from 'moment';

const MyProfileCreationGetStartedScreen = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile]: any = useState<any[] | null>();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;

	const getProfileDetails = useCallback(() => {
		setIsLoading(true);

		ApiFunctions.get(ENV.apiUrl + 'hcp/user/' + user._id)
			.then(async resp => {
				if (resp) {
					setProfile(resp.data);
					console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', resp.data.hcp_type);

					// Intercom.updateUser(resp.data);
				} else {
					Alert.alert('Error', resp);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, []);
	useEffect(() => {
		console.log('loading get profile');
		getProfileDetails();
	}, [getProfileDetails]);

	// const gotoGetCurrentRole = () => {
	// 	navigation.navigate(NavigateTo.MyProfileProfessionalDetails, {
	// 		hcpType: profile.hcp_type
	// 	});
	// };

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !profile && <ErrorComponent />}
			{!isLoading && isLoaded && profile && (
				<View style={styles.screen}>
					<View
						style={{
							flex: 5,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Text
							style={{
								fontFamily: FontConfig.primary.bold,
								fontSize: 26,
								color: Colors.textDark,
								textAlign: 'center',
								// backgroundColor: 'red',
							}}>
							Lets get started with ypur onboarding
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							// backgroundColor: 'green',
							width: '100%',
						}}>
						<CustomButton
							title={'Get Started'}
							style={styles.button}
							// autoWidth={true}
							onPress={() => {
								navigation.navigate(NavigateTo.MyProfileProfessionalDetails, {
									hcpType: profile.hcp_type,
								});
							}}
						/>
					</View>
				</View>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		padding: 20,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'red',
	},
	button: {
		marginVertical: 40,
		// fontFamily: FontConfig.primary.bold,
		// height: 50,
		width: '100%',
	},
});

export default MyProfileCreationGetStartedScreen;
