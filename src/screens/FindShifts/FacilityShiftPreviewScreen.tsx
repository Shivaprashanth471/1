import React, {useCallback, useEffect, useState} from 'react';
import {
	Alert,
	FlatList,
	ImageBackground,
	StatusBar,
	StyleSheet,
	Text,
	View,
	Modal,
	TouchableOpacity,
} from 'react-native';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import {
	ApiFunctions,
	CommonFunctions,
	CommonStyles,
	ToastAlert,
} from '../../helpers';
import {
	ErrorComponent,
	LoadingComponent,
	CustomButton,
} from '../../components/core';

import TotalShiftComponent from '../../components/TotalShiftComponent';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import {
	PaginationResponseType,
	PaginationType,
	TSAPIResponseType,
} from '../../helpers/ApiFunctions';
import moment from 'moment';
import {requirementsList} from '../../constants/CommonTypes';

const FacilityShiftPreviewScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);

	const [isShiftLoading, setIsShiftLoading]: any = useState(false);
	const [isShiftLoaded, setIsShiftLoaded]: any = useState(false);

	const [isFacilitReviewDetailsLoading, setIsFacilitReviewDetailsLoading]: any =
		useState(false);
	const [isFacilitReviewDetailsLoaded, setIsFacilitReviewDetailsLoaded]: any =
		useState(false);

	const [shift, setShift] = useState<requirementsList[] | null>(null);
	const [pagination, setPagination] = useState<PaginationType | null>(null);
	const [facility, setFacility]: any = useState<null | {}>({});
	const [facilityReviewDetails, setFacilityReviewDetails] = useState<any>();

	const [textShown, setTextShown] = useState(false);
	const [lengthMore, setLengthMore] = useState(false);
	const {facilityID} = props.route.params;
	// console.log('>>>>', facilityID);

	const {facilityName} = props.route.params;
	const {item} = props.route.params;

	const navigation = props.navigation;

	const [shiftApplyModalVisible, setShiftApplyModalVisible] = useState(false);

	const onTextLayout = useCallback(e => {
		setLengthMore(e.nativeEvent.lines.length >= 4);
	}, []);
	const toggleNumberOfLines = () => {
		setTextShown(!textShown);
	};

	const {hcp_type} = useSelector(
		(state: StateParams) => state.hcpDetails.HcpUser,
	);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;

	const getShiftDetails = useCallback(
		(page = 1, limit = 10) => {
			let date = new Date();
			const curDate = moment(date).format('YYYY-MM-DD');
			setIsShiftLoading(true);
			if (hcp_type && user) {
				const payload = {
					page,
					limit,
					facility_id: facilityID,
					hcp_type: hcp_type,
					new_shifts: curDate,
					status: 'open',
					// hcp_user_id: user._id,
				};
				ApiFunctions.post(ENV.apiUrl + 'shift/requirement/list', payload)
					.then(
						async (resp: TSAPIResponseType<PaginationResponseType<any>>) => {
							setIsShiftLoading(false);
							setIsShiftLoaded(true);
							if (resp && resp.success) {
								const docs = resp.data.docs || [];
								const paginationObj = resp.data;
								setShift(prevList => {
									prevList = prevList || [];
									if (paginationObj.page === 1) {
										return docs;
									} else {
										return [...prevList, ...docs];
									}
								});
								delete paginationObj.docs;
								setPagination(paginationObj);
							} else {
								ToastAlert.show(resp.error || '');
							}
						},
					)
					.catch((err: any) => {
						setIsShiftLoading(false);
						setIsShiftLoaded(true);
						Alert.alert('Error', err.error || 'Oops... Something went wrong!');
					});
			}
		},
		[hcp_type, facilityID, user],
	);

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
				Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [facilityID]);

	const getFacilityReviewDetails = useCallback(() => {
		setIsFacilitReviewDetailsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'facility/' + facilityID + '/reviews')
			.then(resp => {
				if (resp && resp.success) {
					setFacilityReviewDetails(resp.data);
				} else {
					Alert.alert('Error', resp.error);
				}
				setIsFacilitReviewDetailsLoading(false);
				setIsFacilitReviewDetailsLoaded(true);
			})
			.catch((err: any) => {
				setIsFacilitReviewDetailsLoading(false);
				setIsFacilitReviewDetailsLoaded(true);
				Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [facilityID]);

	useEffect(() => {
		const focusListener = navigation.addListener('focus', getShiftDetails);
		const focusListener2 = navigation.addListener('focus', getFacilityDetails);
		const focusListener3 = navigation.addListener(
			'focus',
			getFacilityReviewDetails,
		);
		return () => {
			focusListener();
			focusListener2();
			focusListener3();
		};
	}, [
		getShiftDetails,
		getFacilityDetails,
		getFacilityReviewDetails,
		navigation,
	]);

	useEffect(() => {
		console.log('loading shift list.....');
		getShiftDetails();
	}, [getShiftDetails]);

	useEffect(() => {
		console.log('loading facility.....');
		getFacilityDetails();
	}, [getFacilityDetails]);

	useEffect(() => {
		console.log('loading facility review.....');
		getFacilityReviewDetails();
	}, [getFacilityReviewDetails]);
	//
	const loadNextPage = useCallback(() => {
		console.log('next page ....', pagination);
		let page = 1;
		if (pagination) {
			page = pagination.page || 1;
			page++;
			const pages = Math.ceil(pagination.total / pagination.limit);
			if (pages >= page) {
				console.log('loading page ....', page);
				getShiftDetails(page);
			}
		}
	}, [pagination, getShiftDetails]);

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
						<View style={styles.modalView}>
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
			{(isLoading ||
				(isShiftLoading && !isShiftLoaded) ||
				(isFacilitReviewDetailsLoading && !isFacilitReviewDetailsLoaded)) && (
				<LoadingComponent />
			)}
			{!isLoading && isLoaded && !facility && (
				<ErrorComponent text={'Facility details not available'} />
			)}
			{!isFacilitReviewDetailsLoading &&
				isFacilitReviewDetailsLoaded &&
				!facilityReviewDetails && (
					<ErrorComponent text={'Facility details not available'} />
				)}
			{!isLoading &&
				isLoaded &&
				isShiftLoaded &&
				facility &&
				facilityReviewDetails && (
					<>
						<StatusBar
							barStyle={'light-content'}
							animated={true}
							backgroundColor={Colors.backdropColor}
						/>
						<View>
							<View style={{flexGrow: 1}}>
								<FlatList
									data={shift}
									onRefresh={getShiftDetails}
									refreshing={isShiftLoading}
									onEndReached={loadNextPage}
									showsVerticalScrollIndicator={false}
									ListHeaderComponent={
										<>
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
												]}
											/>
											<View
												style={{
													marginVertical: 10,
													marginHorizontal: 10,
													padding: 20,
													backgroundColor: Colors.backdropColor,
													elevation: 10,
													borderRadius: 5,
													// marginTop: -70,
													width: '95%',
												}}>
												<Text
													style={{
														fontFamily: FontConfig.primary.bold,
														fontSize: 18,
														color: Colors.textDark,
														textTransform: 'capitalize',
													}}>
													{facilityName}
												</Text>
												<View
													style={{
														flexDirection: 'row',
														alignItems: 'center',
														marginVertical: 10,
													}}>
													<ImageConfig.LocationIconBlue
														width="20"
														height="20"
													/>
													<Text
														style={{
															fontFamily: FontConfig.primary.regular,
															fontSize: 14,
															color: Colors.textOnTextLight,
															maxWidth: '90%',
															marginLeft: 2,
														}}>
														{item.address.street},{' ' + item.address.city},
														{' ' + item.address.state},
														{' ' + item.address.country},
														{' ' + item.address.zip_code}
													</Text>
												</View>
												<View
													style={[
														CommonStyles.horizontalLine,
														{marginVertical: 15},
													]}
												/>
												<View
													style={{
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'space-between',
													}}>
													<Text
														style={{
															fontFamily: FontConfig.primary.bold,
															fontSize: 18,
															color: Colors.textDark,
														}}>
														About Facility
													</Text>
													<TouchableOpacity
														onPress={() => {
															navigation.navigate(
																NavigateTo.FacilityReviewScreen,
																{
																	facilityReviewDetails: facilityReviewDetails,
																	facilityDetails: facility,
																},
															);
														}}
														style={{
															width: 70,
															shadowColor: '#000',
															shadowOffset: {
																width: 0,
																height: 2,
															},
															shadowOpacity: 0.25,
															shadowRadius: 4,
															elevation: 10,
															backgroundColor: 'white',
															borderRadius: 9,
															marginVertical: 5,
														}}>
														<View
															style={{
																backgroundColor: Colors.primary,
																justifyContent: 'center',
																alignItems: 'center',
																height: 35,
																borderTopLeftRadius: 9,
																borderTopRightRadius: 9,
															}}>
															<Text
																style={{
																	fontFamily: FontConfig.primary.semiBold,
																	fontSize: 12,
																	color: 'white',
																	textAlign: 'center',
																}}>
																{facility.rating
																	? facility.rating.toFixed(2)
																	: 0}{' '}
																☆
															</Text>
														</View>
														<View
															style={{
																backgroundColor: Colors.backdropColor,
																justifyContent: 'center',
																alignItems: 'center',
																borderBottomLeftRadius: 9,
																borderBottomRightRadius: 9,
																height: 35,
															}}>
															<Text
																style={{
																	fontFamily: FontConfig.primary.semiBold,
																	fontSize: 12,
																	color: Colors.primary,
																}}>
																({facilityReviewDetails.length})
															</Text>
															<Text
																style={{
																	fontFamily: FontConfig.primary.semiBold,
																	fontSize: 12,
																	color: Colors.primary,
																}}>
																Reviews
															</Text>
														</View>
													</TouchableOpacity>
												</View>
												<Text
													onTextLayout={onTextLayout}
													numberOfLines={textShown ? undefined : 4}
													style={{
														lineHeight: 21,
														fontFamily: FontConfig.primary.regular,
														fontSize: 14,
														color: Colors.textOnTextLight,
														marginTop: 5,
													}}>
													{facility.about}
												</Text>
												{lengthMore ? (
													<Text
														onPress={toggleNumberOfLines}
														style={{
															lineHeight: 21,
															marginTop: 10,
															color: Colors.primary,
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 12,
														}}>
														{textShown ? 'Read less...' : 'Read more...'}
													</Text>
												) : null}
											</View>
											<View
												style={{
													marginHorizontal: 20,
													marginVertical: 10,
												}}>
												<Text
													style={{
														color: Colors.textDark,
														fontSize: 18,
														fontFamily: FontConfig.primary.bold,
													}}>
													Available Shifts
												</Text>
											</View>
											{modalShiftApply()}
										</>
									}
									ListEmptyComponent={
										<ErrorComponent
											// icon={ImageConfig.IconAutomobile}
											text={'List is empty!'}
											style={{minHeight: 250}}
										/>
									}
									onEndReachedThreshold={0.7}
									keyExtractor={(item, index) => item._id + '_' + index}
									renderItem={({item}) => {
										return (
											<View key={item._id + '--'}>
												<View>
													<TotalShiftComponent
														id={facilityID}
														facility={facility}
														item={item}
														dateOfShift={item.shift_date}
														shiftStartTime={item.shift_timings.start_time}
														shiftEndTime={item.shift_timings.end_time}
														HCPLevel={item.hcp_type}
														requirementID={item._id}
														warningType={item.warning_type}
														shiftType={item.shift_type}
														navigation={navigation}
														showModal={() => {
															setShiftApplyModalVisible(true);
														}}
													/>
												</View>
											</View>
										);
									}}
								/>
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

	//////modal

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
