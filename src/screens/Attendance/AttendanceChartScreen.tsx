import React, {useState, useEffect, useCallback} from 'react';
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	Alert,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import {ApiFunctions} from '../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import AttendanceStatusBoxComponent from '../../components/AttendanceStatusBoxComponent';
import {
	BaseViewComponent,
	CustomButton,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import UploadCDHPComponent from '../../components/UploadCDHPComponent';
import AttendanceTimelineComponent from '../../components/AttendanceTimelineComponent';
import {ShiftDocumentsArray} from '../../constants/CommonVariables';
import {AirbnbRating} from 'react-native-ratings';
import WebView from 'react-native-webview';
import {PieChart} from 'react-native-svg-charts';
import PlainCardComponent from '../../components/PlainCardComponent';
import { HeaderBackground } from '@react-navigation/stack';

const AttendanceChartScreen = (props: any) => {
	const navigation = props.navigation;
	const {shiftID} = props.route.params;
	// console.log('>>>', shiftID);

	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [shiftTimings, setShiftTimings]: any = useState<null | {}>({});
	// const [closedButtonLoading, setClosedButtonLoading] = useState(false);
	// const [closedButtonDisabled, setClosedButtonDisabled] = useState(false);
	const [stateBtn, setStateBtn] = useState(true);
	const [checkInTime, setCheckInTime]: any = useState();
	const [checkOutTime, setCheckOutTime]: any = useState();
	const [shiftDurationMinutes,setShiftDurationMinutes]: any = useState('');
	const [shiftDurationHours,setShiftDurationHours]: any = useState('');
	const [breakDurationMinutes,setBreakDurationMinutes]: any = useState('');
	const [breakDurationHours,setBreakDurationHours]: any = useState('');
	// const [shiftCloseModalVisible, setShiftCloseModalVisible] = useState(false);
	const [shift, setShift] = useState<any>();

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
					const checkTime = resp.data.time_breakup
						? tConvert(resp.data.time_breakup.check_in_time.slice(11, 16))
							? tConvert(resp.data.time_breakup.check_in_time.slice(11, 16))
							: ''
						: {};

					setCheckInTime(checkTime);

					const checkOutTime = resp.data.time_breakup
						? tConvert(resp.data.time_breakup.check_out_time.slice(11, 16))
							? tConvert(resp.data.time_breakup.check_out_time.slice(11, 16))
							: ''
						: {};
					setCheckOutTime(checkOutTime);
					const actualTimings = resp.data ? resp.data.actuals ? resp.data.actuals.shift_duration_minutes : {} : {};
					const hourTimings = actualTimings/60;
					const minuteTimings = actualTimings % 60;
					setShiftDurationMinutes(minuteTimings);
					setShiftDurationHours(hourTimings);
					
					const breakTimings = resp.data ? resp.data.actuals ? resp.data.actuals.break_duration_minutes : {} : {};
					const breakHourTimings = breakTimings/60;
					const breakMinuteTimings = breakTimings % 60;
					setBreakDurationMinutes(breakMinuteTimings);
					setBreakDurationHours(breakHourTimings);
					
					setShift(resp.data);
					setShiftTimings(resp.data.time_breakup);
					console.log('>>>', resp.data.actuals.shift_duration_minutes);
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
	}, [shiftID]);

	useEffect(() => {
		console.log('loading get shift main screen');
		getShiftDetails();
	}, [getShiftDetails]);

	// const closeShift = () => {
	// 	setClosedButtonLoading(true);

	// 	ApiFunctions.patch(ENV.apiUrl + 'shift/' + shiftID + '/closed')
	// 		.then(async resp => {
	// 			if (resp) {
	// 				ToastAlert.show('Shift closed');
	// 				setClosedButtonDisabled(true);
	// 				setClosedButtonLoading(false);
	// 				setStateBtn(true);
	// 				setShiftCloseModalVisible(!shiftCloseModalVisible);
	// 			} else {
	// 				console.log('error');
	// 			}
	// 			setClosedButtonDisabled(false);
	// 			setClosedButtonLoading(false);
	// 		})
	// 		.catch((err: any) => {
	// 			console.log('error: ', err);
	// 			ToastAlert.show(err.error);
	// 			setClosedButtonLoading(false);
	// 		});
	// };

	// const modalShiftClose = () => {
	// 	return (
	// 		<View style={styles.ModalContainer}>
	// 			<Modal
	// 				animationType="slide"
	// 				transparent={true}
	// 				visible={shiftCloseModalVisible}
	// 				onRequestClose={() => {
	// 					setShiftCloseModalVisible(!shiftCloseModalVisible);
	// 				}}>
	// 				<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
	// 					<View style={styles.modalView}>
	// 						<Text style={styles.modalTitle}>Shift Complete</Text>
	// 						<Text style={styles.modalTextSub}>
	// 							Thank You!! Your shift has been completed
	// 						</Text>
	// 						<View
	// 							style={{
	// 								marginHorizontal: 10,
	// 								marginTop: 40,
	// 							}}>
	// 							<CustomButton
	// 								style={{
	// 									flex: 0,
	// 									borderRadius: 8,
	// 									marginVertical: 0,
	// 									height: 45,
	// 								}}
	// 								title={'Done'}
	// 								onPress={() => {
	// 									navigation.replace(NavigateTo.UpcomingShiftCountdownScreen);
	// 									setShiftCloseModalVisible(!shiftCloseModalVisible);
	// 								}}
	// 								isLoading={closedButtonLoading}
	// 								disabled={closedButtonDisabled}
	// 							/>
	// 						</View>
	// 					</View>
	// 				</View>
	// 			</Modal>
	// 		</View>
	// 	);
	// };

	const [selectedSlice, setSelectedSlice] = useState({
		label: '',
		value: 0,
	});
	const [labelWidth, setLabelWidth] = useState(0);
	const keys = ['actual', 'break'];
	const colors = ['#3CDCB9', '#0C80E3'];
	const values = [8, 1.5];
	const data = keys.map((key, index) => {
		return {
			key,
			value: values[index],
			svg: {fill: colors[index]},
			arc: {
				// outerRadius: 70 + values[index] + '%',
				// padAngle: selectedSlice.label === key ? 0.1 : 0,
				// outerRadius: 70,
				padAngle: 0.06,
			},
			// onPress: () => this.setState({ selectedSlice: { label: key, value: values[index] } })
			// onpress: () => {
			// 	setSelectedSlice({...selectedSlice, label: key, value: values[index]});
			// 	console.log('here');
			// },
		};
	});
	const deviceWidth = Dimensions.get('window').width;

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !shiftTimings && <ErrorComponent />}
			{!isLoading && isLoaded && shiftTimings && shift && (
				<BaseViewComponent
					style={styles.screen}
					backgroundColor={Colors.backgroundShiftColor}>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View
						style={{
							paddingTop: 10,
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: 'white',
						}}>
						<TouchableOpacity
							style={{
								marginHorizontal: 20,
							}}
							onPress={() => {
								// navigation.goBack();
								navigation.navigate(NavigateTo.UpcomingShiftCountdownScreen);
							}}>
							<ImageConfig.backArrow width="20" height="20" />
						</TouchableOpacity>
						<Text
							style={{
								textTransform: 'capitalize',
								fontFamily: FontConfig.primary.bold,
								color: Colors.navigationHeaderText,
								fontSize: 20,
							}}>
							Attendance
						</Text>
					</View>
					{/* /////////////////////////////////////CHARTS/////////////////////////////////////////// */}
					<View
						style={{
							justifyContent: 'center',
							flex: 1,
							backgroundColor: 'white',
							borderBottomRightRadius: 25,
							borderBottomLeftRadius: 25,
							paddingTop: 20,
						}}>
						<View style={{alignItems: 'center'}}>
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 24,
									color: Colors.textDark,
								}}>
								Great Work!
							</Text>
						</View>
						<PieChart
							style={{height: 250}}
							outerRadius={'60%'}
							innerRadius={'53%'}
							data={data}
						/>
						<View
							style={{
								position: 'absolute',
								// left: deviceWidth / 2 - labelWidth,
								alignItems: 'center',
								width: '100%',
								// backgroundColor: 'red',
							}}>
							<Text
								onLayout={({
									nativeEvent: {
										layout: {width},
									},
								}) => {
									setLabelWidth(width);
								}}
								style={{
									fontFamily: FontConfig.primary.semiBold,
									fontSize: 17,
									color: Colors.textOnInput,
									marginTop: 15,
								}}>
								Total
							</Text>
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 36,
									color: Colors.textOnInput,
								}}>
								10:30
							</Text>
							<Text
								style={{
									fontFamily: FontConfig.primary.semiBold,
									fontSize: 18,
									color: Colors.textOnInput,
								}}>
								hrs
							</Text>
						</View>
						<View
							style={{
								marginHorizontal: 20,
								marginBottom: 20,
							}}>
							<View
								style={{
									flexDirection: 'row',
								}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 14,
										color: Colors.primary,
									}}>
									Wed, May 25, 2021
								</Text>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 14,
										color: Colors.primary,
									}}>
									{' '}
									|{' '}
								</Text>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 14,
										color: Colors.primary,
									}}>
									Morning shift
								</Text>
							</View>
							<View
								style={{
									flexDirection: 'row',
									marginTop: 5,
								}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 14,
										color: Colors.textOnInput,
									}}>
									Check-in - 09:55AM
								</Text>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 14,
										color: Colors.textOnInput,
									}}>
									{' '}
									|{' '}
								</Text>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 14,
										color: Colors.textOnInput,
									}}>
									Check-out - 04:55PM
								</Text>
							</View>
						</View>
					</View>
				
					{/* //////////////////////////////////////////////////////////////////////////////////////// */}
					<View style={{display:'flex',flexDirection:'row',marginTop:25}}>
						<PlainCardComponent style={{borderTopWidth:8,borderTopColor:'#4FE6AF',shadowColor:'#4FE6AF'}}>
							<ImageConfig.SunGreen width="25" height="25" style={{marginBottom:15}} />
							  <Text>Actual shift time</Text>
							  <Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 25,
									color: Colors.textOnInput,
								}}>
									{shiftDurationHours + ':' + shiftDurationMinutes}
									{/* <AttendanceTimelineComponent shiftID={shiftID} /> */}
						{/* <AttendanceStatusBoxComponent
							status={'Actual-Time'}
							time={shiftDurationMinutes}
						/> */}
							</Text>

						</PlainCardComponent>
						<PlainCardComponent style={{borderTopWidth:8,borderTopColor:'#0C80E3',shadowColor:'#0C80E3'}}>
						<ImageConfig.IconBreakin width="20" height="20" style={{marginBottom:15}} />
							<Text>Break time</Text>
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 25,
									color: Colors.textOnInput,
								}}>
								{breakDurationHours + ':' + breakDurationMinutes}
							</Text>
						</PlainCardComponent>
					</View>
					<View style={styles.timeSheetContainer}>
						<Text style={styles.timeLineText}>Timeline</Text>
						<AttendanceStatusBoxComponent
							status={'CheckIn'}
							time={checkInTime}
						/>
						<AttendanceTimelineComponent shiftID={shiftID} />
						<AttendanceStatusBoxComponent
							status={'Check-Out'}
							time={checkOutTime}
						/>
					</View>
					<View>
						{ShiftDocumentsArray.map((item: any) => (
							<>
								<UploadCDHPComponent
									title={item}
									shiftID={shiftID}
									state={setStateBtn}
									showOnlyDocument={false}
								/>
							</>
						))}
						{shift.facility_rating ? (
							<>
								<View
									style={{
										margin: 20,
										marginTop: 100,
										marginHorizontal: 10,
									}}>
									<Text
										style={{
											fontFamily: FontConfig.primary.bold,
											fontSize: 18,
											color: Colors.textDark,
											// marginHorizontal: 10,
										}}>
										Review
									</Text>
									<Text
										style={{
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 15,
											color: Colors.textDark,
											// marginHorizontal: 10,
										}}>
										{shift.facility_rating}/5
									</Text>
									<View
										style={{
											flexDirection: 'row',
											// marginHorizontal: 10,
											paddingVertical: 5,
										}}>
										<AirbnbRating
											reviewSize={16}
											defaultRating={shift.facility_rating}
											size={20}
											count={5}
											showRating={false}
											isDisabled={true}
											// starStyle={{
											// 	margin: 0,
											// }}
										/>
									</View>
									<View
										style={{
											marginVertical: 15,
										}}>
										<Text
											style={{
												fontFamily: FontConfig.primary.italic,
												fontSize: 15,
												color: Colors.textOnInput,
											}}>
											You will be notified after your application has been
											approved by the facility
										</Text>
									</View>
								</View>
							</>
						) : (
							<>
								<View
									style={{
										margin: 20,
										marginTop: 100,
									}}>
									<CustomButton
										style={{
											flex: 0,
											borderRadius: 8,
											marginVertical: 0,
											height: 45,
										}}
										title={'Complete Shift'}
										onPress={() => {
											// closeShift();
											navigation.navigate(NavigateTo.FeedbackScreen, {
												shiftID: shiftID,
											});
										}}
										disabled={stateBtn}
										// isLoading={closedButtonLoading}
									/>
								</View>
							</>
						)}
					</View>
					{/* {modalShiftClose()} */}
				</BaseViewComponent>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	chartContainer: {
		backgroundColor: Colors.backdropColor,
		padding: 20,
		borderBottomLeftRadius: 50,
		borderBottomRightRadius: 50,
	},
	timeSheetContainer: {
		padding: 20,
	},
	timeLineText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
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
		height: '30%',
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
	},
	modalTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textOnAccent,
		marginTop: 15,
		marginBottom: 10,
	},
});

export default AttendanceChartScreen;

// import React, {useState} from 'react';
// import {
// 	View,
// 	Text,
// 	TouchableOpacity,
// 	ScrollView,
// 	StyleSheet,
// 	Dimensions,
// } from 'react-native';
// import WebView from 'react-native-webview';
// import {PieChart} from 'react-native-svg-charts';

// const HTML_PieChart = `
// <!DOCTYPE html>\n
// <html>
//   <head>
//     <!--Load the AJAX API-->
//     <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
//     <script type="text/javascript">

//       // Load the Visualization API and the corechart package.
//       google.charts.load('current', {'packages':['corechart']});

//       // Set a callback to run when the Google Visualization API is loaded.
//       google.charts.setOnLoadCallback(drawChart);

//       function drawChart() {
//         var data = new google.visualization.DataTable();
//         data.addColumn('string', 'Shift Break');
//         data.addColumn('number', 'hours');
//         data.addRows([
//           ['actual', 3],
//           ['break', 6],
//         ]);

//         var optionsPie = {
// 						'title':'Great Work',
//                        'width': 500,
//                        'height':400,
//                     //    is3D: true,
//                        pieHole: 0.5,
//                     // pieStartAngle: 180,
//                     // backgroundColor: 'silver',
//                        colors: ['#3CDCB9','#0C80E3']};
//         var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
//         chart.draw(data, optionsPie);
//       }
//     </script>
//   </head>

//   <body>
//     <div id="chart_div"></div>
//   </body>
// </html>
// `;

// const AttendanceChartScreen = (props: any) => {
// 	const [barShow, setBarShow] = useState<'none' | 'flex' | undefined>('none');

// 	const [selectedSlice, setSelectedSlice] = useState({
// 		label: '',
// 		value: 0,
// 	});
// 	const [labelWidth, setLabelWidth] = useState(0);
// 	const keys = ['google', 'facebook'];
// 	const values = [8, 1.5];
// 	const colors = ['#3CDCB9', '#0C80E3'];
// 	const data = keys.map((key, index) => {
// 		return {
// 			key,
// 			value: values[index],
// 			svg: {fill: colors[index]},
// 			arc: {
// 				// outerRadius: 70 + values[index] + '%',
// 				// padAngle: selectedSlice.label === key ? 0.1 : 0,
// 				// outerRadius: 70,
// 				padAngle: 0.06,
// 			},
// 			// onPress: () => this.setState({ selectedSlice: { label: key, value: values[index] } })
// 			// onpress: () => {
// 			// 	setSelectedSlice({...selectedSlice, label: key, value: values[index]});
// 			// 	console.log('here');
// 			// },
// 		};
// 	});

// 	const deviceWidth = Dimensions.get('window').width;
// 	return (
// 		// <ScrollView>
// 		// 	<View
// 		// 		style={{
// 		// 			height: 500,
// 		// 			width: 800,
// 		// 		}}>
// 		// 		<WebView source={{html: HTML_PieChart}} />
// 		// 	</View>
// 		// </ScrollView>
// <View style={{justifyContent: 'center', flex: 1}}>
// 	<PieChart
// 		style={{height: 200}}
// 		outerRadius={'50%'}
// 		innerRadius={'60%'}
// 		data={data}
// 	/>
// 	<Text
// 		onLayout={({
// 			nativeEvent: {
// 				layout: {width},
// 			},
// 		}) => {
// 			setLabelWidth(width);
// 		}}
// 		style={{
// 			position: 'absolute',
// 			left: deviceWidth / 2 - labelWidth / 2,
// 			textAlign: 'center',
// 		}}>
// 		{`${selectedSlice.label} \n ${selectedSlice.value}`}
// 	</Text>
// </View>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// });

// export default AttendanceChartScreen;
