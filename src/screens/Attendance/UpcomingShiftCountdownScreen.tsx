import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StatusBar, StyleSheet, View, Text} from 'react-native';
import {ApiFunctions} from '../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	NavigateTo,
	ImageConfig,
} from '../../constants';
import {
	BaseViewComponent,
	ErrorComponent,
	LoadingComponent,
	CustomButton,
} from '../../components/core';
import {StateParams} from '../../store/reducers';
import {useSelector} from 'react-redux';
import moment from 'moment';
import analytics from '@segment/analytics-react-native';
import UpComingShiftCountdownComponent from '../../components/UpComingShiftCountdownComponent';

const UpcomingShiftCountdownScreen = (props: any) => {
	const [viewMode, setViewMode] = useState<'shiftAvailable' | 'shiftEmpty'>(
		'shiftAvailable',
	);
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const [shiftID, setShiftID]: any = useState();
	const navigation = props.navigation;
	const [facilityShift, setFacilityShift]: any = useState();
	const [statusInProgress, setStatusInProgress]: any = useState(false);

	const getFacilityShiftDetails = useCallback(shift_id => {
		setIsLoading(true);
		console.log('shiftId>>>>>>>>>>>>>>>>>>>>>', shift_id);
		ApiFunctions.get(ENV.apiUrl + 'shift/' + shift_id)

			.then(async resp => {
				if (resp) {
					setFacilityShift(resp.data);
				} else {
					Alert.alert('Error', resp);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				console.log('getFacilityShiftDetails', err);
			});
		setIsLoading(true);
	}, []);

	const getNextShiftDetails = useCallback(() => {
		setIsLoading(true);
		if (user) {
			const payload = {shift_status: 'in_progress'};
			ApiFunctions.post(
				ENV.apiUrl + 'shift/hcp/' + user._id + '/shift',
				payload,
			)
				.then(async resp => {
					if (resp) {
						let getToday = moment().utcOffset(0, false);
						let wantedProgressData = resp.data.docs.filter(function (i: any) {
							const element = i.shift_date;
							let dateDiff = getToday.diff(element, 'days') * -1;
							return i.shift_status === 'in_progress' && dateDiff >= 0;
						});

						if (wantedProgressData.length > 0) {
							setShiftID(wantedProgressData[0]._id);
							getFacilityShiftDetails(wantedProgressData[0]._id);
							setViewMode('shiftAvailable');
							setStatusInProgress(true);
						} else {
							console.log('here');

							getPendingShiftDetails();
						}
					} else {
						Alert.alert('Error', resp);
					}
				})
				.catch((err: any) => {
					setIsLoading(false);
					setIsLoaded(true);
					console.log('getNextShiftDetails', err);
				});
		}
	}, [getFacilityShiftDetails, navigation, user]);

	const getPendingShiftDetails = useCallback(() => {
		setIsLoading(true);
		if (user) {
			let date = new Date();
			const curDate = moment(date).format('YYYY-MM-DD');
			const payload = {new_shifts: curDate, shift_status: 'pending'};
			console.log('>>>>>>>>>>>>>>>>>>>>>', user._id);
			ApiFunctions.post(
				ENV.apiUrl + 'shift/hcp/' + user._id + '/shift',
				payload,
			)
				.then(async resp => {
					if (resp) {
						let getToday = moment().utcOffset(0, false);
						let wantedPendingData = resp.data.docs.filter(function (i: any) {
							const element = i.shift_date;
							let dateDiff = getToday.diff(element, 'days') * -1;
							return i.shift_status === 'pending' && dateDiff >= 0;
						});
						console.log('><><><', resp.data);

						setStatusInProgress(false);

						if (wantedPendingData.length > 0) {
							let today = new Date().getTime();
							const result = wantedPendingData.sort((a: any, b: any) => {
								const diffA =
									new Date(a.expected.shift_start_time).getTime() - today;
								const diffB =
									new Date(b.expected.shift_start_time).getTime() - today;
								return diffA - diffB;
							})[0];
							setShiftID(result._id);
							getFacilityShiftDetails(result._id);
							setViewMode('shiftAvailable');
							setStatusInProgress(false);
						} else {
							setViewMode('shiftEmpty');
							setIsLoading(false);
							setIsLoaded(true);
						}
					} else {
						Alert.alert('Error', resp);
					}
				})
				.catch((err: any) => {
					setIsLoading(false);
					setIsLoaded(true);
					console.log('getPendingShiftDetails', err);
				});
		}
	}, [getFacilityShiftDetails, user]);

	useEffect(() => {
		const focusListener = navigation.addListener('focus', getNextShiftDetails);
		return () => {
			focusListener();
		};
	}, [getNextShiftDetails, navigation]);

	useEffect(() => {
		analytics.screen('Attendance Screen Opened');
		return () => {
			analytics.screen('Attendance Screen Exited');
		};
	}, []);
	useEffect(() => {
		getNextShiftDetails();
	}, [getNextShiftDetails, user]);

	const onNext = () => {
		navigation.navigate(NavigateTo.ShiftDetailsScreen, {
			facilityID: facilityShift.facility_id,
			requirementID: facilityShift.requirement_id,
			dateOfShift: facilityShift.shift_date,
			shiftStartTime: facilityShift.expected.shift_start_time,
			shiftEndTime: facilityShift.expected.shift_end_time,
			HCPLevel: facilityShift.hcp_type,
			warningType: facilityShift.warning_type ? facilityShift.warning_type : '',
			shiftType: facilityShift.shift_type ? facilityShift.shift_type : '',
			shiftDetails: facilityShift.shift_details
				? facilityShift.shift_details
				: '',
			phoneNumber: facilityShift.facility
				? facilityShift.facility.phone_number
				: '',
			disable: true,
		});
	};

	const onAttendanceStart = () => {
		navigation.navigate(NavigateTo.Attendance, {
			shiftID: shiftID,
		});
	};

	return (
		<>
			{viewMode === 'shiftAvailable' && (
				<>
					{isLoading && (
						<LoadingComponent backgroundColor={Colors.textDark} color="white" />
					)}
					{!isLoading && isLoaded && !facilityShift && (
						<ErrorComponent backgroundColor={Colors.textDark} />
					)}
					{!isLoading && isLoaded && facilityShift && (
						<BaseViewComponent
							style={styles.screen}
							backgroundColor={Colors.textDark}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<UpComingShiftCountdownComponent
								dateOfShift={
									facilityShift.shift_date ? facilityShift.shift_date : ''
								}
								shiftStartTime={
									facilityShift.expected
										? facilityShift.expected.shift_start_time
										: ''
								}
								shiftEndTime={
									facilityShift.expected
										? facilityShift.expected.shift_end_time
										: ''
								}
								HCPLevel={facilityShift.hcp_type ? facilityShift.hcp_type : ''}
								onNext={onNext}
								onAttendanceStart={onAttendanceStart}
								facilityAddress={
									facilityShift.facility ? facilityShift.facility.address : ''
								}
								facilityName={
									facilityShift.facility
										? facilityShift.facility.facility_name
										: ''
								}
								shiftDuration={
									facilityShift.expected
										? facilityShift.expected.shift_duration_minutes
										: ''
								}
								statusInProgress={statusInProgress}
							/>
						</BaseViewComponent>
					)}
				</>
			)}
			{viewMode === 'shiftEmpty' && (
				<>
					{isLoading && (
						<LoadingComponent backgroundColor={Colors.textDark} color="white" />
					)}
					{!isLoading && isLoaded && (
						<BaseViewComponent
							style={{
								padding: 20,
								flex: 1,
								height: 600,
							}}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={'#ffffff'}
							/>
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<ImageConfig.NoShiftAttandanceScreenImage
									width={'200'}
									height={'200'}
								/>
								<View
									style={{
										alignItems: 'center',
									}}>
									<Text
										style={{
											fontFamily: FontConfig.primary.bold,
											fontSize: 43,
											color: Colors.textOnAccent,
										}}>
										Oops!
									</Text>
									<Text
										style={{
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 18,
										}}>
										there are no shifts to attend
									</Text>
								</View>
								<View
									style={{
										width: '100%',
									}}>
									<CustomButton
										title={'Search for new shift'}
										onPress={() => {
											navigation.navigate(NavigateTo.FindShifts);
										}}
										style={styles.button}
										textStyle={{textTransform: 'none'}}
									/>
								</View>
							</View>
						</BaseViewComponent>
					)}
				</>
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
	},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
	shiftDetailsContainer: {
		marginHorizontal: 10,
		marginVertical: 20,
		width: '100%',
	},
	shiftTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	shiftTimeText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 14,
	},
	horizontalRule: {
		width: 10,
		height: 1,
		backgroundColor: Colors.textLight,
	},
	shiftTimeDifferenceText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 10,
		color: Colors.textLight,
		marginHorizontal: 5,
	},
});

export default UpcomingShiftCountdownScreen;
