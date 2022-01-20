import React, {useState, useCallback, useEffect} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
	ImageBackground,
	Image,
	Modal,
	Platform,
	Linking,
	Alert,
} from 'react-native';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import {
	BaseViewComponent,
	CustomButton,
	ToggleSwitchComponent,
	TextWIthCheckIconComponent,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	CommonStyles,
	CommonFunctions,
	ApiFunctions,
	ToastAlert,
} from '../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import {logoutUser} from '../../store/actions/auth.action';
import {CONTACTUS_PHONE_NUMBER} from '../../helpers/CommonFunctions';
import analytics from '@segment/analytics-react-native';

const ProfileScreen = (props: any) => {
	const dispatch = useDispatch();
	const [modalVisible, setModalVisible] = useState(false);
	const [phone, setPhone] = useState(CONTACTUS_PHONE_NUMBER);
	const [isLoading, setIsLoading]: any = useState(true);
	const [profile, setProfile]: any = useState();
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const [logoutModalVisible, setLogoutOutModalVisible] = useState(false);
	// const [hcpID, setHcpID] = useState('');
	const {user} = auth;
	const navigation = props.navigation;

	const getProfileDetails = useCallback(() => {
		setIsLoading(true);

		if (!user) {
			return;
		}
		ApiFunctions.get(ENV.apiUrl + 'hcp/user/' + user._id)
			.then(async resp => {
				if (resp) {
					setProfile(resp.data);
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
	}, [user]);
	useEffect(() => {
		console.log('loading get profile main screen');
		getProfileDetails();
	}, [getProfileDetails]);

	const onCall = () => {
		setModalVisible(!modalVisible);
		CommonFunctions.openCall(phone);
	};
	const onSMS = () => {
		setModalVisible(!modalVisible);
		CommonFunctions.openSMS(phone, '');
	};

	const gotoProfileEditScreen = () => {
		navigation.navigate(NavigateTo.ProfileEditScreen);
	};
	const gotoMyProfileScreen = () => {
		navigation.navigate(NavigateTo.MyProfileScreen, {
			// hcpID: hcpID,
		});
	};
	const gotoProfileExperienceScreen = () => {
		navigation.navigate(NavigateTo.ProfileExperienceScreen, {
			// hcpID: hcpID,
		});
	};
	const gotoProfileEducationScreen = () => {
		navigation.navigate(NavigateTo.ProfileEducationScreen, {
			// hcpID: hcpID,
		});
	};
	const gotoProfileVolunteerScreen = () => {
		navigation.navigate(NavigateTo.ProfileVolunteerScreen, {
			// hcpID: hcpID,
		});
	};
	const gotoProfileReferenceScreen = () => {
		navigation.navigate(NavigateTo.ProfileReferenceScreen, {
			// hcpID: hcpID,
		});
	};
	const gotoProfileDocumentScreen = () => {
		navigation.navigate(NavigateTo.ProfileDocumentScreen, {
			// hcpID: hcpID,
		});
	};
	// const gotoProfileCreationScreen = () => {
	// 	navigation.navigate(NavigateTo.MyProfileCreationGetStartedScreen, {
	// 		hcpID: hcpID,
	// 	});
	// };

	// useEffect(() => {
	// 	dispatch(logoutUser());
	// 	navigation.replace(NavigateTo.Auth);
	// }, [dispatch, navigation]);

	const modalLogout = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={logoutModalVisible}
					onRequestClose={() => {
						setLogoutOutModalVisible(!logoutModalVisible);
					}}>
					<View style={[[styles.centeredView, {backgroundColor: '#000000A0'}]]}>
						<View style={styles.modalView}>
							<Text style={styles.modalTextTitle}>Do you want to logout</Text>

							<View
								style={{
									flexDirection: 'row',
									marginHorizontal: 10,
									marginTop: 30,
								}}>
								<View
									style={{
										width: '45%',
										marginRight: '10%',
									}}>
									<CustomButton
										onPress={() =>
											setLogoutOutModalVisible(!logoutModalVisible)
										}
										style={{
											flex: 0,
											borderRadius: 8,
											marginVertical: 0,
											height: 45,
											backgroundColor: Colors.backgroundShiftColor,
										}}
										title={'Cancel'}
										class={'secondary'}
										textStyle={{color: Colors.primary}}
									/>
								</View>
								<View
									style={{
										width: '45%',
									}}>
									<CustomButton
										style={{
											flex: 0,
											borderRadius: 8,
											marginVertical: 0,
											height: 45,
										}}
										title={'Logout'}
										onPress={() => {
											analytics.track('Logout');
											analytics.reset();
											dispatch(logoutUser());
											navigation.replace(NavigateTo.Auth);
										}}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	const modalHelpSupport = () => {
		return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					// Alert.alert('Modal has been closed.');
					setModalVisible(!modalVisible);
				}}>
				<View style={styles.ModalCenteredView}>
					<View style={styles.modalView1}>
						<View
							style={{
								// backgroundColor: 'red',
								width: '100%',
								alignItems: 'flex-end',
								// marginHorizontal: 20,
								paddingHorizontal: 20,
								paddingTop: 10,
							}}>
							<TouchableOpacity
								onPress={() => {
									setModalVisible(!modalVisible);
								}}>
								<ImageConfig.CloseIconModal height={'25'} width={'25'} />
							</TouchableOpacity>
						</View>
						<View
							style={{
								padding: 10,
							}}>
							<Text style={styles.modalText}>Choose an option to contact</Text>
							<View
								style={{
									backgroundColor: 'white',
									paddingVertical: 20,
								}}>
								<View
									style={{
										flexDirection: 'row',
										marginHorizontal: 10,
									}}>
									<View
										style={{
											width: '45%',
											marginRight: '10%',
										}}>
										<CustomButton
											onPress={onCall}
											style={{
												flex: 0,
												borderRadius: 8,
												marginVertical: 0,
												height: 40,
												backgroundColor: Colors.backgroundShiftColor,
											}}
											title={'Call'}
											class={'secondary'}
											textStyle={{color: Colors.primary}}
											ImageConfigCall={true}
										/>
									</View>
									<View
										style={{
											width: '45%',
										}}>
										<CustomButton
											onPress={onSMS}
											style={{
												flex: 0,
												borderRadius: 8,
												marginVertical: 0,
												height: 40,
												backgroundColor: Colors.backgroundShiftColor,
											}}
											title={'SMS'}
											class={'secondary'}
											textStyle={{color: Colors.primary}}
											ImageConfigSMS={true}
										/>
									</View>
								</View>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);
	};

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !profile && <ErrorComponent />}
			{!isLoading && isLoaded && profile && (
				<BaseViewComponent
					contentContainerStyle={{
						flexGrow: 1,
						paddingBottom: 20,
					}}
					backgroundColor={Colors.backdropColor}>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backgroundColor}
					/>
					{/* <TouchableOpacity onPress={gotoProfileCreationScreen}>
						<Text style={CommonStyles.pageTitle}>ProfileCreationScreen</Text>
					</TouchableOpacity> */}
					{modalHelpSupport()}
					{modalLogout()}
					<View style={styles.screen}>
						<View style={[styles.contentBoxContainer]}>
							<View style={styles.avatarStyle}>
								{/*<Image*/}
								{/*	resizeMethod={'auto'}*/}
								{/*	resizeMode={'contain'}*/}
								{/*	source={ImageConfig.placeholder}*/}
								{/*	style={{*/}
								{/*		height: 120,*/}
								{/*		width: 120,*/}
								{/*		borderRadius: 500,*/}
								{/*	}}*/}
								{/*/>*/}

								<ImageConfig.IconAccountCircle
									width={100}
									height={100}
									color={Colors.primary}
								/>
							</View>
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 18,
									}}>
									{profile.first_name + ' ' + profile.last_name}
								</Text>
								{profile.is_approved && (
									<TextWIthCheckIconComponent
										leadingCheckIcon={true}
										shiftText={'Approved'}
										checkBackgroundColor={Colors.approved}
										textColor={Colors.approved}
										style={{marginTop: 10}}
									/>
								)}
								<Text
									style={{
										fontFamily: FontConfig.primary.regular,
										fontSize: 14,
										color: Colors.textOnTextLight,
										marginTop: 10,
									}}>
									{profile.contact_number}
								</Text>
								<Text
									style={{
										fontFamily: FontConfig.primary.regular,
										fontSize: 14,
										color: Colors.textOnTextLight,
										marginTop: 10,
									}}>
									{profile.email}
								</Text>
							</View>

							{/* <View
								style={{
									width: 150,
									marginTop: 10,
									// backgroundColor: 'red',
								}}>
								<CustomButton
									onPress={gotoProfileEditScreen}
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 40,
										backgroundColor: Colors.backgroundShiftColor,
									}}
									title={'View Profile'}
									class={'secondary'}
									textStyle={{
										color: Colors.primary,
										textTransform: 'none',
										fontFamily: FontConfig.primary.bold,
										fontSize: 14,
									}}
								/>
							</View> */}
						</View>
						<View style={styles.subHeaderContainer}>
							<Text style={styles.subHeaderText}>Profile details</Text>
						</View>
						<View style={styles.contentBoxContainer}>
							<TouchableOpacity
								onPress={gotoMyProfileScreen}
								style={{flexDirection: 'row'}}>
								<View style={styles.contentBoxRow}>
									<View style={styles.rowLeftContent}>
										<ImageConfig.ProfileScreenProfileIcon
											color={'red'}
											style={{
												borderRadius: 100,
												marginRight: 10,
											}}
											height={'17'}
											width={'17'}
										/>
										<Text style={styles.contentBoxText}>Profile</Text>
									</View>
									<ImageConfig.ArrowBackIcon
										color={Colors.textLight}
										style={{
											borderRadius: 100,
											marginRight: 10,
										}}
										height={'17'}
										width={'17'}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{flexDirection: 'row'}}
								onPress={gotoProfileExperienceScreen}>
								<View style={styles.contentBoxRow}>
									<View style={styles.rowLeftContent}>
										<ImageConfig.ProfileScreenExperienceIcon
											color={'red'}
											style={{
												borderRadius: 100,
												marginRight: 10,
											}}
											height={'17'}
											width={'17'}
										/>
										<Text style={styles.contentBoxText}>Work Experience</Text>
									</View>
									<ImageConfig.ArrowBackIcon
										color={Colors.textLight}
										style={{
											borderRadius: 100,
											marginRight: 10,
										}}
										height={'17'}
										width={'17'}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{flexDirection: 'row'}}
								onPress={gotoProfileEducationScreen}>
								<View style={styles.contentBoxRow}>
									<View style={styles.rowLeftContent}>
										<ImageConfig.ProfileScreenEducationIcon
											color={'red'}
											style={{
												borderRadius: 100,
												marginRight: 10,
											}}
											height={'17'}
											width={'17'}
										/>
										<Text style={styles.contentBoxText}>Education</Text>
									</View>
									<ImageConfig.ArrowBackIcon
										color={Colors.textLight}
										style={{
											borderRadius: 100,
											marginRight: 10,
										}}
										height={'17'}
										width={'17'}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{flexDirection: 'row'}}
								onPress={gotoProfileVolunteerScreen}>
								<View style={styles.contentBoxRow}>
									<View style={styles.rowLeftContent}>
										<ImageConfig.ProfileScreenVolunteerIcon
											color={'red'}
											style={{
												borderRadius: 100,
												marginRight: 10,
											}}
											height={'17'}
											width={'17'}
										/>
										<Text style={styles.contentBoxText}>Volunteer</Text>
									</View>
									<ImageConfig.ArrowBackIcon
										color={Colors.textLight}
										style={{
											borderRadius: 100,
											marginRight: 10,
										}}
										height={'17'}
										width={'17'}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{flexDirection: 'row'}}
								onPress={gotoProfileReferenceScreen}>
								<View style={styles.contentBoxRow}>
									<View style={styles.rowLeftContent}>
										<ImageConfig.ProfileScreenReferenceIcon
											color={'red'}
											style={{
												borderRadius: 100,
												marginRight: 10,
											}}
											height={'17'}
											width={'17'}
										/>
										<Text style={styles.contentBoxText}>References</Text>
									</View>
									<ImageConfig.ArrowBackIcon
										color={Colors.textLight}
										style={{
											borderRadius: 100,
											marginRight: 10,
										}}
										height={'17'}
										width={'17'}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{flexDirection: 'row'}}
								onPress={gotoProfileDocumentScreen}>
								<View style={styles.contentBoxRow}>
									<View style={styles.rowLeftContent}>
										<ImageConfig.ProfileScreenMyDocumentIcon
											color={'red'}
											style={{
												borderRadius: 100,
												marginRight: 10,
											}}
											height={'17'}
											width={'17'}
										/>
										<Text style={styles.contentBoxText}>My Documents</Text>
									</View>
									<ImageConfig.ArrowBackIcon
										color={Colors.textLight}
										style={{
											borderRadius: 100,
											marginRight: 10,
										}}
										height={'17'}
										width={'17'}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{flexDirection: 'row'}}
								onPress={() => setModalVisible(true)}>
								<View style={styles.contentBoxRow}>
									<View style={styles.rowLeftContent}>
										<ImageConfig.HeadphoneIcon
											color={'red'}
											style={{
												borderRadius: 100,
												marginRight: 10,
											}}
											height={'17'}
											width={'17'}
										/>
										<Text style={styles.contentBoxText}>Help and Support</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
						<View
							style={[
								{
									height: 2,
									backgroundColor: Colors.backgroundShiftBoxColor,
									marginVertical: 10,
									marginHorizontal: 20,
								},
							]}
						/>
						<TouchableOpacity
							onPress={() => {
								setLogoutOutModalVisible(true);
							}}>
							<View
								style={{
									marginHorizontal: 20,
									flexDirection: 'row',
									alignItems: 'center',
									marginVertical: 15,
								}}>
								<ImageConfig.LogOutIcon
									color={Colors.primary}
									style={{
										borderRadius: 100,
										marginRight: 10,
									}}
									height={'17'}
									width={'17'}
								/>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 16,
										color: Colors.primary,
									}}>
									Logout
								</Text>
							</View>
						</TouchableOpacity>
						{/* <TouchableOpacity onPress={() => setModalVisible(true)}>
							<View style={styles.helpSupportContainer}>
								<ImageConfig.HeadphoneIcon
									style={{
										borderRadius: 100,
										marginRight: 10,
									}}
									height={'30.85'}
									width={'30.85'}
								/>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 17,
									}}>
									Help and Support
								</Text>
							</View>
						</TouchableOpacity> */}
					</View>
				</BaseViewComponent>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		// marginHorizontal: 20,
	},
	avatarStyle: {
		height: 120,
		width: 120,
		// backgroundColor: 'red',
		borderRadius: 500,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	dashMainItem: {
		width: 200,
		height: 200,
		borderRadius: 500,
	},
	rowLeftContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	subHeaderContainer: {
		backgroundColor: Colors.backgroundShiftColor,
		paddingVertical: 10,
	},
	subHeaderText: {
		fontFamily: FontConfig.primary.semiBold,
		color: Colors.textOnTextLight,
		marginHorizontal: 10,
	},
	contentBoxRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginVertical: 10,
	},
	contentBoxText: {
		fontFamily: FontConfig.primary.semiBold,
		fontSize: 16,
		color: Colors.textDark,
	},
	contentBoxContainer: {
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	helpSupportContainer: {
		flexDirection: 'row',
		marginHorizontal: 20,
		backgroundColor: '#EDFDF7',
		borderWidth: 1.5,
		borderColor: Colors.backgroundShiftBoxColor,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20,
		borderRadius: 5,
		marginTop: 10,
	},
	ModalCenteredView: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#000000A0',
	},
	modalView1: {
		marginHorizontal: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
		fontFamily: FontConfig.primary.bold,
		fontSize: 16,
	},

	//
	ModalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: 'white',
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
		width: '100%',
		height: '25%',
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalTextTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textOnInput,
		marginBottom: 5,
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
	},
	modalTime: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textOnAccent,
		marginTop: 15,
	},
});

export default ProfileScreen;
