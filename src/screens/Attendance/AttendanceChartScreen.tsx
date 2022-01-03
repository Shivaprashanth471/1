import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, StatusBar, Alert, Modal} from 'react-native';
import {ApiFunctions, ToastAlert} from '../../helpers';
import {Colors, ENV, FontConfig, NavigateTo} from '../../constants';
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

const AttendanceChartScreen = (props: any) => {
	const navigation = props.navigation;
	const {shiftID} = props.route.params;
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [shift, setShift]: any = useState<null | {}>({});
	const [closedButtonLoading, setClosedButtonLoading] = useState(false);
	const [closedButtonDisabled, setClosedButtonDisabled] = useState(false);
	const [stateBtn, setStateBtn] = useState(true);
	const [checkInTime, setCheckInTime]: any = useState();
	const [checkOutTime, setCheckOutTime]: any = useState();
	const [shiftCloseModalVisible, setShiftCloseModalVisible] = useState(false);

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
					setShift(resp.data.time_breakup);
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

	const completeShift = () => {
		setClosedButtonLoading(true);

		ApiFunctions.patch(ENV.apiUrl + 'shift/' + shiftID + '/closed')
			.then(async resp => {
				if (resp) {
					ToastAlert.show('Shift closed');
					setClosedButtonDisabled(true);
					setClosedButtonLoading(false);
					setStateBtn(true);
					setShiftCloseModalVisible(!shiftCloseModalVisible);
				} else {
					console.log('error');
				}
				setClosedButtonDisabled(false);
				setClosedButtonLoading(false);
			})
			.catch((err: any) => {
				console.log('error: ', err);
				ToastAlert.show(err.error);
				setClosedButtonLoading(false);
			});
	};

	const modalShiftClose = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={shiftCloseModalVisible}
					onRequestClose={() => {
						setShiftCloseModalVisible(!shiftCloseModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View style={styles.modalView}>
							<Text style={styles.modalTitle}>Shift Complete</Text>
							<Text style={styles.modalTextSub}>
								Thank You!! Your shift has been completed
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
										navigation.replace(NavigateTo.UpcomingShiftCountdownScreen);
										setShiftCloseModalVisible(!shiftCloseModalVisible);
									}}
									isLoading={closedButtonLoading}
									disabled={closedButtonDisabled}
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
			{!isLoading && isLoaded && !shift && <ErrorComponent />}
			{!isLoading && isLoaded && shift && (
				<BaseViewComponent
					style={styles.screen}
					backgroundColor={Colors.backgroundShiftColor}>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
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
								/>
							</>
						))}

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
									completeShift();
								}}
								disabled={stateBtn}
								isLoading={closedButtonLoading}
							/>
						</View>
					</View>
					{modalShiftClose()}
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
// } from 'react-native';
// import WebView from 'react-native-webview';

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
//           ['overtime', 4],
//         ]);

//         var optionsPie = {
// 						'title':'Great Work',
//                        'width': 500,
//                        'height':400,
//                     //    is3D: true,
//                        pieHole: 0.5,
//                     // pieStartAngle: 180,
//                     // backgroundColor: 'silver',
//                        colors: ['#3CDCB9','#0C80E3', '#FFA200']};
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
// 	return (
// 		<ScrollView>
// 			<View
// 				style={{
// 					height: 500,
// 					width: 800,
// 				}}>
// 				<WebView source={{html: HTML_PieChart}} />
// 			</View>
// 		</ScrollView>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// });

// export default AttendanceChartScreen;
