import React, {useCallback, useEffect, useState} from 'react';
import {
	Alert,
	ImageBackground,
	Linking,
	Modal,
	Platform,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {Colors, ENV, FontConfig, ImageConfig} from '../../constants';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../helpers';
import {
	BaseViewComponent,
	CustomButton,
	ErrorComponent,
	LoadingComponent,
	TextWIthCheckIconComponent,
} from '../../components/core';
import analytics from '@segment/analytics-react-native';

import TotalShiftComponent from '../../components/TotalShiftComponent';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';

const FacilityShiftPreviewScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [facility, setFacility]: any = useState<null | {}>({});

	const navigation = props.navigation;

	const [modalVisible, setModalVisible] = useState(false);

	const [disableBtnLoading, setDisableBtnLoading] = useState(false);

	const [shiftApplyModalVisible, setShiftApplyModalVisible] = useState(false);

	//params
	const {
		facilityID,
		dateOfShift,
		requirementID,
		shiftStartTime,
		shiftEndTime,
		HCPLevel,
		warningType,
		shiftType,
		shiftDetails,
		phoneNumber,
		disable,
	} = props.route.params;

	const [disableApplyBtn, setDisableApplyBtn]: any = useState(disable);

	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;

	const onApply = () => {
		setDisableBtnLoading(true);
		const payload = {hcp_user_id: user._id, applied_by: user._id};
		ApiFunctions.post(
			ENV.apiUrl + 'shift/requirement/' + requirementID + '/application',
			payload,
		)
			.then(async resp => {
				setIsLoading(false);
				if (resp) {
					setDisableApplyBtn(true);
					ToastAlert.show('Application Submitted');
					setShiftApplyModalVisible(!shiftApplyModalVisible);
					analytics.track('Applied For A Shift');
				} else {
					ToastAlert.show(resp, 'failed to update');
				}
				setDisableBtnLoading(false);
			})

			.catch((err: any) => {
				setIsLoading(false);
				console.log(err);
				ToastAlert.show('You have already applied to this shift');
				setDisableBtnLoading(false);
			});
	};

	const getFacilityDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'facility/' + facilityID)
			.then(resp => {
				if (resp && resp.success) {
					setFacility(resp.data);
				} else {
					Alert.alert('Error', resp.error);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				console.log(err);
			});
	}, [facilityID]);

	const openGoogleMap = (longitude: any, latitude: any, facility: string) => {
		const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
		const latLng = `${latitude},${longitude}`;
		const label = facility;

		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});
		if (typeof url === 'string') {
			Linking.openURL(url);
		}
	};

	useEffect(() => {
		console.log('loading facility.....');
		getFacilityDetails();
	}, [getFacilityDetails]);

	const onCall = () => {
		setModalVisible(!modalVisible);
		CommonFunctions.openCall(phoneNumber);
	};
	const onSMS = () => {
		setModalVisible(!modalVisible);
		CommonFunctions.openSMS(phoneNumber, '');
	};

	const modalContact = () => {
		return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<View style={styles.ModalCenteredView}>
					<View style={styles.modalView}>
						<View
							style={{
								width: '100%',
								alignItems: 'flex-end',
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

	const modalShiftApply = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={shiftApplyModalVisible}
					onRequestClose={() => {
						setShiftApplyModalVisible(!shiftApplyModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View style={styles.modalView2}>
							<Text style={styles.modalTitle}>Application Received!</Text>
							<Text style={styles.modalTextSub}>
								You will be notified after your application has been approved by
								the facility
							</Text>
							<View
								style={{
									marginHorizontal: 10,
									marginTop: 40,
								}}>
								<CustomButton
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 45,
									}}
									title={'Done'}
									onPress={() => {
										setShiftApplyModalVisible(!shiftApplyModalVisible);
									}}
								/>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !facility && (
				<ErrorComponent text={'Facility details not available'} />
			)}
			{!isLoading && isLoaded && facility && (
				<>
					<BaseViewComponent noScroll={false} style={[styles.wrapper]}>
						<StatusBar
							barStyle={'light-content'}
							animated={true}
							backgroundColor={Colors.backdropColor}
						/>
						<View
							style={{
								backgroundColor: '#F6FEFB',
							}}>
							<View style={{flexGrow: 1}}>
								<ImageBackground
									resizeMethod={'auto'}
									resizeMode={facility.image_url ? 'cover' : 'contain'}
									source={
										facility.image_url
											? {uri: facility.image_url}
											: ImageConfig.placeholder
									}
									style={[
										styles.dashMainItem,
										{backgroundColor: Colors.backdropColor},
									]}>
									<View
										style={{
											margin: 10,
										}}>
										<TouchableOpacity
											onPress={() => {
												navigation.goBack();
											}}>
											<ImageBackground
												resizeMethod={'auto'}
												resizeMode={'contain'}
												source={ImageConfig.arrow}
												style={{
													width: 15,
													height: 15,
												}}
											/>
										</TouchableOpacity>
									</View>
								</ImageBackground>
								<View>
									<TotalShiftComponent
										id={facilityID}
										dateOfShift={dateOfShift}
										shiftStartTime={shiftStartTime}
										shiftEndTime={shiftEndTime}
										HCPLevel={HCPLevel}
										style={
											{
												// marginTop: -70,
											}
										}
										requirementID={requirementID}
										warningType={warningType}
										shiftType={shiftType}
										removeApplyViewSection={true}
										facility={facility}
									/>
								</View>
								<View
									style={[
										styles.shiftRequirementContainer,
										{
											borderStyle: 'dashed',
											borderWidth: 1,
											borderColor: '#9ADBC3',
										},
									]}>
									<Text
										style={{
											fontFamily: FontConfig.primary.bold,
											fontSize: 18,
										}}>
										Shift Requirement details:
									</Text>
									{shiftDetails === '' ? (
										<></>
									) : (
										<>
											<TextWIthCheckIconComponent
												leadingCheckIcon={true}
												shiftText={shiftDetails}
												style={{marginTop: 15}}
											/>
										</>
									)}
								</View>
								<TouchableOpacity
									onPress={() => {
										if (facility.location) {
											openGoogleMap(
												facility.location.coordinates[0],
												facility.location.coordinates[1],
												facility.facility_name,
											);
										} else {
											ToastAlert.show('Facility coordinates not found');
										}
									}}
									style={{
										marginHorizontal: 10,
										flexDirection: 'row',
										marginBottom: 5,
									}}>
									<ImageConfig.LocationIconBlue width="20" height="20" />

									<View
										style={{
											marginHorizontal: 10,
											marginBottom: 20,
											flex: 1,
										}}>
										<Text
											style={{
												color: Colors.textDark,
												fontSize: 16,
												fontFamily: FontConfig.primary.bold,
												marginBottom: 5,
												textTransform: 'capitalize',
											}}>
											{facility.facility_name}
										</Text>
										<Text
											// numberOfLines={2}
											style={{
												textTransform: 'capitalize',
												fontFamily: FontConfig.primary.regular,
												fontSize: 14,
												color: Colors.textDark,
											}}>
											{facility?.address.street +
												', ' +
												facility?.address.city +
												', ' +
												facility?.address.region_name +
												', ' +
												facility?.address.state +
												', ' +
												facility?.address.country +
												', ' +
												facility?.address.zip_code}
										</Text>
									</View>
									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											width: 50,
										}}>
										<ImageConfig.IconNearMe color={Colors.primary} />
									</View>
								</TouchableOpacity>
							</View>
						</View>
						{modalShiftApply()}
						{modalContact()}
					</BaseViewComponent>
					<View
						style={{
							backgroundColor: 'white',
							paddingVertical: 15,
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
									onPress={() => setModalVisible(true)}
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 45,
										backgroundColor: Colors.backgroundShiftColor,
									}}
									title={'Contact'}
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
									title={'Apply Now'}
									onPress={onApply}
									disabled={disableApplyBtn}
									isLoading={disableBtnLoading}
								/>
							</View>
						</View>
					</View>
				</>
			)}
		</>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	dashMainItem: {
		width: CommonFunctions.getWidth(),
		height: 240,
	},
	wrapper: {
		marginVertical: 10,
		marginTop: 30,
		paddingBottom: 0,
	},
	shiftRequirementContainer: {
		marginVertical: 20,
		marginHorizontal: 10,
		backgroundColor: Colors.backgroundShiftBoxColor,
		paddingVertical: 20,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
	shiftDetailsContainer: {
		marginHorizontal: 10,
		marginVertical: 20,
	},
	ModalCenteredView: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#000000A0',
	},
	modalView: {
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
		fontFamily: FontConfig.primary.semiBold,
	},

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
	modalView2: {
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
		height: '35%',
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
		width: '70%',
	},
	modalTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textOnAccent,
		marginTop: 15,
		marginBottom: 10,
	},
});

export default FacilityShiftPreviewScreen;
