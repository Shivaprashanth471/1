import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, StatusBar, Modal, Alert} from 'react-native';
import {ApiFunctions, ToastAlert} from '../../helpers';
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
	ErrorComponent,
	LoadingComponent,
	KeyboardAvoidCommonView,
} from '../../components/core';
import AttendanceStatusBoxComponent from '../../components/AttendanceStatusBoxComponent';
import {StateParams} from '../../store/reducers';
import {useSelector} from 'react-redux';
import moment from 'moment';
import AttendanceTimelineComponent from '../../components/AttendanceTimelineComponent';

const AttendanceScreen = (props: any) => {
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const {shiftID}: any = props.route.params;
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [shift, setShift]: any = useState();
	const [shiftDate, setShiftDate]: any = useState();
	const [shiftTime, setShiftTime]: any = useState();
	const [timeInMinutes, setTimeInMinutes]: any = useState(0);
	const [showCheckInBtn, setShowCheckInBtn] = useState(true);
	const [showCheckOutBtn, setShowCheckOutBtn] = useState(false);
	const [disableCheckInOutBtn, setDisableCheckInOutBtn]: any = useState(false);
	const [dt, setDt]: any = useState();
	const [currentDate, setCurrentDate]: any = useState(0);
	const [showBreakTimeline, setShowBreakTimeline]: any = useState(false);
	const [inState, setInState] = useState([<View />]);
	const [inCheckInState, setCheckInState] = useState([<View />]);
	const [breakInModalVisible, setBreakInModalVisible] = useState(false);
	const [breakOutModalVisible, setBreakOutModalVisible] = useState(false);
	const [checkOutModalVisible, setCheckOutModalVisible] = useState(false);
	const [checkInModalVisible, setCheckInModalVisible] = useState(false);
	const navigation = props.navigation;
	const [sunIcon, setSunIcon]: any = useState(true);
	const [displayAttendance, setDisplayAttendance] = useState<
		'none' | 'flex' | undefined
	>('none');
	const [showBreakInBtn, setShowBreakInBtn] = useState<
		'none' | 'flex' | undefined
	>('flex');
	const [showBreakOutBtn, setShowBreakOutBtn] = useState<
		'none' | 'flex' | undefined
	>('none');
	const [btnLoading, setBtnLoading] = useState<boolean>(false);

	useEffect(() => {
		let secTimer = setInterval(() => {
			let date = new Date();
			let hours = date.getHours();
			let minutes = date.getMinutes();
			let seconds = date.getSeconds();
			const curDate = moment(date).format('YYYY-MM-DD');
			setCurrentDate(curDate);
			setTimeInMinutes(hours * 60 + minutes);
			if (seconds <= 9 && minutes <= 9) {
				var final_minute = '0' + minutes;
				var final_sec = '0' + seconds;
				if (hours > 12) {
					var hr = hours - 12;
					var finalHour = '' + hr;
					setDt(`${finalHour}:${final_minute} PM`);
					// setDt(`${finalHour}:${final_minute}:${final_sec} PM`);
				} else {
					if (hours == 12) {
						setDt(`${hours}:${final_minute} PM`);
						// setDt(`${hours}:${final_minute}:${final_sec} PM`);
					}
					setDt(`${hours}:${final_minute} AM`);
					// setDt(`${hours}:${final_minute}:${final_sec} AM`);
				}
			} else if (seconds <= 9 && minutes > 9) {
				var final_sec = '0' + seconds;
				if (hours > 12) {
					var hr = hours - 12;
					var finalHour = '' + hr;
					setDt(`${finalHour}:${minutes} PM`);
					// setDt(`${finalHour}:${minutes}:${final_sec} PM`);
				} else {
					if (hours == 12) {
						setDt(`${hours}:${minutes} PM`);
						// setDt(`${hours}:${minutes}:${final_sec} PM`);
					}
					setDt(`${hours}:${minutes} AM`);
					// setDt(`${hours}:${minutes}:${final_sec} AM`);
				}
			} else if (seconds > 9 && minutes <= 9) {
				var final_minute = '0' + minutes;
				if (hours > 12) {
					var hr = hours - 12;
					var finalHour = '' + hr;
					setDt(`${finalHour}:${final_minute} PM`);
					// setDt(`${finalHour}:${final_minute}:${seconds} PM`);
				} else {
					if (hours == 12) {
						setDt(`${hours}:${final_minute} PM`);
						// setDt(`${hours}:${final_minute}:${seconds} PM`);
					}
					setDt(`${hours}:${final_minute} AM`);
					// setDt(`${hours}:${final_minute}:${seconds} AM`);
				}
			} else {
				if (hours > 12) {
					var hr = hours - 12;
					var finalHour = '' + hr;
					setDt(`${finalHour}:${minutes} PM`);
					// setDt(`${finalHour}:${minutes}:${seconds} PM`);
				} else {
					if (hours === 12) {
						setDt(`${hours}:${minutes} PM`);
						// setDt(`${hours}:${minutes}:${seconds} PM`);
					} else {
						setDt(`${hours}:${minutes} AM`);
						// setDt(`${hours}:${minutes}:${seconds} AM`);
					}
				}
			}
			if (hours >= 6 && hours <= 17) {
				setSunIcon(true);
			} else {
				setSunIcon(false);
			}
			setIsLoading(false);
			setIsLoaded(true);
		}, 1000);

		return () => clearInterval(secTimer);
	}, []);

	const tConvert = (time: any) => {
		// Check correct time format and split into components
		time = time
			.toString()
			.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

		if (time.length > 1) {
			// If time format correct
			time = time.slice(1); // Remove full string match value
			time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
			time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join(''); // return adjusted time or original string
	};

	const getShiftDetails = useCallback(() => {
		setIsLoading(true);

		ApiFunctions.get(ENV.apiUrl + 'shift/' + shiftID)
			.then(async resp => {
				if (resp) {
					setShift(resp.data);

					if (resp.data.shift_status === 'in_progress') {
						setShowCheckInBtn(false);
						setShowCheckOutBtn(true);
						setDisplayAttendance('flex');

						const checkTime = resp.data.time_breakup
							? tConvert(resp.data.time_breakup.check_in_time.slice(11, 16))
								? tConvert(resp.data.time_breakup.check_in_time.slice(11, 16))
								: ''
							: {};

						setCheckInState([
							...inCheckInState,
							<>
								<AttendanceStatusBoxComponent
									status={'CheckIn'}
									time={checkTime}
								/>
							</>,
						]);

						const breakTimings = resp.data.time_breakup.break_timings;
						if (breakTimings.length > 0) {
							setShowBreakTimeline(true);
							if (resp.data.is_in_break) {
								setShowBreakInBtn('none');
								setShowBreakOutBtn('flex');
								setDisableCheckInOutBtn(true);
							} else {
								setShowBreakInBtn('flex');
								setShowBreakOutBtn('none');
								setDisableCheckInOutBtn(false);
							}
						}
					}

					const shiftOnDate = resp.data.shift_date.substring(0, 10);
					const date = moment(new Date(shiftOnDate))
						.utcOffset(0, false)
						.format('DD MMM, YY');
					setShiftDate(date);

					const shiftStartTime = resp.data.expected
						? tConvert(resp.data.expected.shift_start_time.slice(11, 16))
							? tConvert(resp.data.expected.shift_start_time.slice(11, 16))
							: ''
						: {};
					setShiftTime(shiftStartTime);
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
		getShiftDetails();
	}, [getShiftDetails, shiftID]);
	useEffect(() => {
		const focusListener = navigation.addListener('focus', getShiftDetails);
		return () => {
			focusListener();
		};
	}, [getShiftDetails, navigation, shiftID]);

	const checkInClick = () => {
		const time = dt;

		setCheckInState([
			...inCheckInState,
			<>
				<AttendanceStatusBoxComponent status={'CheckIn'} time={time} />
			</>,
		]);
	};

	const checkOutClick = () => {
		const time = dt;

		setInState([
			...inState,
			<>
				<AttendanceStatusBoxComponent status={'Check-Out'} time={time} />
			</>,
		]);
		gotoNext();
	};

	const breakOutClick = () => {
		const time = dt;
		setInState([
			...inState,
			<>
				<AttendanceStatusBoxComponent status={'Break-Out'} time={time} />
			</>,
		]);
	};

	const breakInClick = () => {
		const time = dt;
		setInState([
			...inState,
			<>
				<AttendanceStatusBoxComponent status={'Break-In'} time={time} />
			</>,
		]);
	};

	const checkInModalClose = () => {
		const payload = {
			hcp_user_id: user._id,
			time: timeInMinutes,
			date: currentDate,
		};
		setBtnLoading(true);
		ApiFunctions.post(ENV.apiUrl + 'shift/' + shiftID + '/checkIn', payload)
			.then(async resp => {
				// setIsLoading(false);
				if (resp) {
					setShowCheckInBtn(false);
					setShowCheckOutBtn(true);
					setDisplayAttendance('flex');
					checkInClick();
					ToastAlert.show('Checked In');
				} else {
					Alert.alert('Error', resp);
				}
				setCheckInModalVisible(!checkInModalVisible);
				setBtnLoading(false);
			})
			.catch((err: any) => {
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
				setCheckInModalVisible(!checkInModalVisible);
				setBtnLoading(false);
			});
	};

	const breakInModalClose = () => {
		setBtnLoading(true);
		setDisableCheckInOutBtn(true);
		const payload = {
			hcp_user_id: user._id,
			time: timeInMinutes,
			date: currentDate,
		};
		ApiFunctions.post(ENV.apiUrl + 'shift/' + shiftID + '/breakIn', payload)
			.then(async resp => {
				if (resp) {
					breakInClick();
					setShowBreakInBtn('none');
					setShowBreakOutBtn('flex');
					ToastAlert.show('break started');
				} else {
					// ToastAlert.show(resp.error || 'failed to update');
					Alert.alert('Error', resp);
				}
				setBreakInModalVisible(!breakInModalVisible);
				setBtnLoading(false);
				setDisableCheckInOutBtn(true);
			})
			.catch((err: any) => {
				console.log(err);
				setBreakInModalVisible(!breakInModalVisible);
				setBtnLoading(false);
				setDisableCheckInOutBtn(false);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	};
	const breakOutModalClose = () => {
		setBtnLoading(true);
		const payload = {
			hcp_user_id: user._id,
			time: timeInMinutes,
			date: currentDate,
		};
		ApiFunctions.post(ENV.apiUrl + 'shift/' + shiftID + '/breakOut', payload)
			.then(async resp => {
				if (resp) {
					breakOutClick();
					setShowBreakOutBtn('none');
					setShowBreakInBtn('flex');
					ToastAlert.show('break ended');
					setDisableCheckInOutBtn(false);
				} else {
					Alert.alert('error');
					// ToastAlert.show(resp.error || 'failed to update');
				}
				setBreakOutModalVisible(!breakOutModalVisible);
				setBtnLoading(false);
			})
			.catch((err: any) => {
				console.log(err);
				setBreakOutModalVisible(!breakOutModalVisible);
				setDisableCheckInOutBtn(true);
				setBtnLoading(false);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	};
	const checkOutModalClose = () => {
		setBtnLoading(true);

		const payload = {
			hcp_user_id: user._id,
			time: timeInMinutes,
			date: currentDate,
		};
		ApiFunctions.post(ENV.apiUrl + 'shift/' + shiftID + '/checkOut', payload)
			.then(async resp => {
				if (resp) {
					setShowCheckInBtn(false);
					setShowCheckOutBtn(true);
					setDisableCheckInOutBtn(true);
					setShowBreakOutBtn('none');
					setShowBreakInBtn('none');
					setDisplayAttendance('flex');
					checkOutClick();
					ToastAlert.show('Check Out Completed');
				} else {
					Alert.alert('error', resp);
					// ToastAlert.show(resp.error || 'failed to update');
				}
				setCheckOutModalVisible(!checkOutModalVisible);
				setBtnLoading(false);
			})
			.catch((err: any) => {
				console.log(err);
				setBtnLoading(false);
				setCheckOutModalVisible(!checkOutModalVisible);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	};
	const gotoNext = () => {
		console.log('instate>>>>>>>>>>>>>>>>>>>>>>', shiftID);

		navigation.replace(NavigateTo.AttendanceChartScreen, {
			shiftID: shiftID,
		});
	};

	const modalCheckIn = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={checkInModalVisible}
					onRequestClose={() => {
						setCheckInModalVisible(!checkInModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View style={styles.modalView}>
							<Text style={styles.modalTextTitle}>Check-In</Text>
							<Text style={styles.modalTextSub}>Do you want to check in</Text>
							<Text style={styles.modalTime}>{dt}</Text>
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
										onPress={() => setCheckInModalVisible(!checkInModalVisible)}
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
										title={'Check-in'}
										onPress={checkInModalClose}
										isLoading={btnLoading}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	const modalBreakIn = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={breakInModalVisible}
					onRequestClose={() => {
						setBreakInModalVisible(!breakInModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View style={styles.modalView}>
							<Text style={styles.modalTextTitle}>Break in!</Text>
							<Text style={styles.modalTextSub}>
								Your break in time has come
							</Text>
							<Text style={styles.modalTextSub}>
								would you like to break in now?
							</Text>
							<Text style={styles.modalTime}>{dt}</Text>
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
										onPress={() => setBreakInModalVisible(!breakInModalVisible)}
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
										title={'Yes'}
										onPress={breakInModalClose}
										isLoading={btnLoading}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	const modalBreakOut = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={breakOutModalVisible}
					onRequestClose={() => {
						setBreakOutModalVisible(!breakOutModalVisible);
					}}>
					<View style={[[styles.centeredView, {backgroundColor: '#000000A0'}]]}>
						<View style={styles.modalView}>
							<Text style={styles.modalTextTitle}>Break out!</Text>
							<Text style={styles.modalTextSub}>
								Your break out time has come
							</Text>
							<Text style={styles.modalTextSub}>
								would you like to break out now?
							</Text>
							<Text style={styles.modalTime}>{dt}</Text>
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
											setBreakOutModalVisible(!breakOutModalVisible)
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
										title={'Yes'}
										onPress={breakOutModalClose}
										isLoading={btnLoading}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	const modalCheckOut = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={checkOutModalVisible}
					onRequestClose={() => {
						setCheckOutModalVisible(!checkOutModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View style={styles.modalView}>
							<Text style={styles.modalTextTitle}>Check-Out</Text>
							<Text style={styles.modalTextSub}>Do you want to check out</Text>
							<Text style={styles.modalTime}>{dt}</Text>
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
											setCheckOutModalVisible(!checkOutModalVisible)
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
										title={'Check-out'}
										onPress={checkOutModalClose}
										isLoading={btnLoading}
									/>
								</View>
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
			{!isLoading && isLoaded && !shift && !dt && <ErrorComponent />}
			{!isLoading && isLoaded && shift && dt && (
				<KeyboardAvoidCommonView>
					<BaseViewComponent backgroundColor={Colors.backgroundShiftColor}>
						<StatusBar
							barStyle={'light-content'}
							animated={true}
							backgroundColor={Colors.backdropColor}
						/>
						<View
							style={[
								styles.topContainer,
								{elevation: 8, shadowColor: Colors.gradientEnd},
							]}>
							{sunIcon ? (
								<ImageConfig.sunIcon width="25" height="25" />
							) : (
								<ImageConfig.moonIcon width="25" height="25" />
							)}
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 24,
									color: Colors.textOnAccent,
								}}>
								hello,{' '}
								{user ? (user.first_name ? user.first_name : 'User') : ''}!
							</Text>
							<Text
								style={{
									fontFamily: FontConfig.primary.regular,
									fontSize: 12,
								}}>
								Your shift begins today at {shiftTime}
							</Text>
							<Text
								style={{
									fontFamily: FontConfig.primary.semiBold,
									fontSize: 16,
								}}>
								{shiftDate}
							</Text>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'flex-start',
								}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 48,
									}}>
									{dt}
								</Text>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 16,
										marginLeft: 5,
										marginTop: 10,
									}}
								/>
							</View>
							<View style={styles.test}>
								{showCheckInBtn && (
									<>
										<CustomButton
											onPress={() => {
												setCheckInModalVisible(true);
											}}
											style={{
												flex: 0,
												borderRadius: 8,
												marginVertical: 0,
												height: 45,
											}}
											title={'Check-in'}
											ImageConfigCheck={true}
											iconPosition={'left'}
											textStyle={{
												textTransform: 'none',
											}}
											disabled={disableCheckInOutBtn}
										/>
									</>
								)}
								{showCheckOutBtn && (
									<>
										<CustomButton
											onPress={() => setCheckOutModalVisible(true)}
											style={{
												flex: 0,
												borderRadius: 8,
												marginVertical: 0,
												height: 45,
											}}
											title={'Check-Out'}
											ImageConfigCheck={true}
											iconPosition={'left'}
											textStyle={{
												textTransform: 'none',
											}}
											disabled={disableCheckInOutBtn}
										/>
									</>
								)}
							</View>
						</View>
						<View style={[styles.mainContainer, {display: displayAttendance}]}>
							<Text style={styles.timeLineText}>Timeline</Text>
							{inCheckInState}

							{showBreakTimeline && (
								<>
									<AttendanceTimelineComponent shiftID={shiftID} />
								</>
							)}

							{inState}

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<ImageConfig.Horizontal_Line />
							</View>
							<AttendanceStatusBoxComponent
								status={'Break-In'}
								backgroundColor={Colors.backdropColor}
								onPress={() => {
									setBreakInModalVisible(true);
								}}
								style={{
									display: showBreakInBtn,
								}}
							/>
							<AttendanceStatusBoxComponent
								status={'Break-Out'}
								backgroundColor={Colors.backdropColor}
								onPress={() => {
									setBreakOutModalVisible(true);
								}}
								style={{
									display: showBreakOutBtn,
								}}
							/>
						</View>
						{modalCheckIn()}
						{modalBreakIn()}
						{modalBreakOut()}
						{modalCheckOut()}
						{/* {disableCheckInOutBtn && (
							<View
								style={{
									marginHorizontal: 20,
									marginVertical: 20,
								}}>
								<CustomButton
									onPress={gotoNext}
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 45,
									}}
									title={'Proceed to upload document'}
									textStyle={{
										textTransform: 'none',
									}}
								/>
							</View>
						)} */}
					</BaseViewComponent>
				</KeyboardAvoidCommonView>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	topContainer: {
		backgroundColor: Colors.backdropColor,
		borderBottomLeftRadius: 50,
		borderBottomRightRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 40,
	},
	test: {
		position: 'absolute',
		bottom: -15,
		width: 150,
	},
	mainContainer: {
		marginTop: 50,
		marginHorizontal: 20,
	},
	timeLineText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
	},
	timeBoxContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
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

export default AttendanceScreen;
