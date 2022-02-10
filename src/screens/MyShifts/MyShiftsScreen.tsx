import React, {useState, useCallback, useEffect} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
	FlatList,
} from 'react-native';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import MyShiftsStatusContainerComponent from '../../components/MyShiftsStatusContainerComponent';
import {ApiFunctions, ToastAlert, CommonStyles} from '../../helpers';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import {useNavigation} from '@react-navigation/native';
import {ErrorComponent, LoadingComponent} from '../../components/core';
import MyShiftComponent from './MyShiftComponent';
import {
	PaginationType,
	TSAPIResponseType,
	PaginationResponseType,
} from '../../helpers/ApiFunctions';
import {hcpShiftsList} from '../../constants/CommonTypes';
import moment from 'moment';
import analytics from '@segment/analytics-react-native';

const MyShiftsScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [shift, setShift] = useState<hcpShiftsList[] | null>(null);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	// const navigation = useNavigation();
	const [totalCount, setTotalCount] = useState<any>();
	const [appliedCount, setAppliedCount] = useState<any>();
	const [shiftCount, setShiftCount] = useState<any>();
	const [showComplete, setShowComplete] = useState<boolean>(false);
	const [showPending, setShowPending] = useState<boolean>(false);
	const [showApplied, setShowApplied] = useState<boolean>(true);
	const [showClosed, setShowClosed] = useState<boolean>(false);
	const [pagination, setPagination] = useState<PaginationType | null>(null);

	const [isShiftLoading, setIsShiftLoading]: any = useState(false);
	const [isShiftLoaded, setIsShiftLoaded]: any = useState(false);

	const [showAppliedShifts, setShowAppliedShifts]: any = useState(true);
	const [appliedShifts, setAppliedShifts]: any = useState(false);

	const getHCPShiftDetails = useCallback(
		(
			page = 1,
			limit = 20,
			mode: 'pending' | 'complete' | 'closed' | 'in_progress' = 'complete',
		) => {
			setIsShiftLoading(true);

			let date = new Date();
			const curDate = moment(date).format('YYYY-MM-DD');

			if (user) {
				const payload = {
					status: [mode],
					page,
					limit,
					new_shifts: mode === 'pending' ? curDate : null,
				};

				ApiFunctions.post(
					ENV.apiUrl + 'shift/hcp/' + user._id + '/shift',
					payload,
				)
					.then(
						async (resp: TSAPIResponseType<PaginationResponseType<any>>) => {
							setIsLoading(false);
							setIsLoaded(true);
							setIsShiftLoading(false);
							setIsShiftLoaded(true);
							if (resp) {
								if (resp.success) {
									const docs = resp.data.docs || [];
									const paginationObj = resp.data;
									setTotalCount(resp.data.total);

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
							}
						},
					)
					.catch((err: any) => {
						setIsLoading(false);
						setIsLoaded(true);
						setIsShiftLoading(false);
						setIsShiftLoaded(true);
						console.log(err);
						// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
					});
			}
		},
		[user],
	);

	const getHcpApplicationList = useCallback(() => {
		setIsLoading(true);
		if (user) {
			ApiFunctions.get(
				ENV.apiUrl + 'shift/hcp/' + user._id + '/application?status=pending',
			)
				.then(async resp => {
					if (resp) {
						setAppliedShifts(resp.data);
						setAppliedCount(resp.data.length);
					} else {
						console.log('error', resp);
						// ToastAlert.show(resp.errors || '');
					}
					setIsLoading(false);
					setIsLoaded(true);
				})
				.catch((err: any) => {
					setIsLoading(false);
					setIsLoaded(true);
					console.log(err);
				});
		}
	}, [user]);

	const getHcpStatusCount = useCallback(() => {
		setIsLoading(true);
		if (user) {
			const payload = {
				hcp_user_id: user._id,
			};
			ApiFunctions.get(ENV.apiUrl + 'shift/stats', payload)
				.then(async resp => {
					if (resp) {
						setShiftCount(resp.data);
					} else {
						console.log('error');
					}
					setIsLoading(false);
					setIsLoaded(true);
				})
				.catch((err: any) => {
					setIsLoading(false);
					setIsLoaded(true);
					console.log(err);
				});
		}
	}, [user]);

	useEffect(() => {
		console.log('loading shift count');
		setIsLoading(true);
		setIsLoading(true);
		getHcpStatusCount();
	}, [getHcpStatusCount, user]);

	useEffect(() => {
		console.log('loading get hcp application list');
		setIsLoading(true);
		setIsLoading(true);
		getHcpApplicationList();
	}, [getHcpApplicationList, user]);
	useEffect(() => {
		console.log('loading get shift main screen');
		setIsLoading(true);
		setIsLoading(true);
		getHCPShiftDetails();
	}, [getHCPShiftDetails, user]);

	const selectComplete = () => {
		if (!showClosed && !showPending && !showApplied) {
			return;
		} else {
			analytics.track('History Filter Complete');
			setIsLoading(true);
			setIsLoading(true);
			setShowComplete(true);
			setShowClosed(false);
			setShowPending(false);
			setShowApplied(false);
			setShowAppliedShifts(false);
			getHCPShiftDetails(1, 20, 'complete');
		}
	};
	const selectPending = () => {
		if (!showClosed && !showComplete && !showApplied) {
			return;
		} else {
			analytics.track('History Filter Upcoming');
			setIsLoading(true);
			setIsLoading(true);
			setShowComplete(false);
			setShowClosed(false);
			setShowPending(true);
			setShowApplied(false);
			setShowAppliedShifts(false);
			getHCPShiftDetails(1, 20, 'pending');
		}
	};
	const selectApplied = () => {
		if (!showClosed && !showPending && !showComplete) {
			return;
		} else {
			analytics.track('History Filter Applied');
			setIsLoading(true);
			setIsLoading(true);
			setShowComplete(false);
			setShowClosed(false);
			setShowPending(false);
			setShowApplied(true);
			setShowAppliedShifts(true);
			getHcpApplicationList();
		}
	};
	const selectClosed = () => {
		if (!showComplete && !showPending && !showApplied) {
			return;
		} else {
			analytics.track('History Filter Closed');
			setIsLoading(true);
			setIsLoading(true);
			setShowComplete(false);
			setShowClosed(true);
			setShowPending(false);
			setShowApplied(false);
			setShowAppliedShifts(false);
			getHCPShiftDetails(1, 20, 'closed');
		}
	};
	const resetInitialState = useCallback(() => {
		setIsLoading(true);
		setIsLoading(true);
		setShowComplete(false);
		setShowPending(false);
		setShowApplied(true);
		setShowClosed(false);
		setShowAppliedShifts(true);
		getHCPShiftDetails(1, 20, 'complete');
		getHcpApplicationList();
		getHcpStatusCount();
	}, [getHCPShiftDetails, getHcpApplicationList, getHcpStatusCount]);

	useEffect(() => {
		const focusListener = navigation.addListener('focus', resetInitialState);
		return () => {
			focusListener();
		};
	}, [resetInitialState, navigation]);

	const loadNextPage = useCallback(() => {
		console.log('next page ....', pagination);
		let page = 1;
		if (pagination) {
			page = pagination.page || 1;
			page++;
			const pages = Math.ceil(pagination.total / pagination.limit);
			if (pages >= page) {
				console.log('loading page ....', page);
				getHCPShiftDetails(page);
			}
		}
	}, [pagination, getHCPShiftDetails]);

	return (
		<>
			{(isLoading || (isShiftLoading && !isShiftLoaded && !appliedShifts)) && (
				<LoadingComponent />
			)}
			{!isLoading && isLoaded && !shift && !appliedShifts && !shiftCount && (
				<ErrorComponent />
			)}
			{!isLoading && isLoaded && isShiftLoaded && appliedShifts && shiftCount && (
				<>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View style={{flexGrow: 1}}>
						<FlatList
							data={showAppliedShifts ? appliedShifts : shift}
							onRefresh={showAppliedShifts ? null : getHCPShiftDetails}
							refreshing={showAppliedShifts ? null : isShiftLoading}
							onEndReached={showAppliedShifts ? null : loadNextPage}
							ListHeaderComponent={
								<>
									<View style={{flexDirection: 'row'}}>
										{appliedCount > 0 ? (
											<TouchableOpacity
												style={CommonStyles.flex}
												onPress={selectApplied}>
												<MyShiftsStatusContainerComponent
													title={'Pending Shifts'}
													count={
														showApplied ? appliedCount : appliedCount || '0'
													}
													selected={showApplied}
												/>
											</TouchableOpacity>
										) : (
											<View style={CommonStyles.flex}>
												<MyShiftsStatusContainerComponent
													title={'Pending Shifts'}
													count={
														showApplied ? appliedCount : appliedCount || '0'
													}
													selected={showApplied}
												/>
											</View>
										)}

										{shiftCount.pending > 0 ? (
											<TouchableOpacity
												style={CommonStyles.flex}
												onPress={selectPending}>
												<MyShiftsStatusContainerComponent
													title={'Upcoming Shifts'}
													count={shiftCount.pending || '0'}
													selected={showPending}
												/>
											</TouchableOpacity>
										) : (
											<View style={CommonStyles.flex}>
												<MyShiftsStatusContainerComponent
													title={'Upcoming Shifts'}
													count={shiftCount.pending || '0'}
													selected={showPending}
												/>
											</View>
										)}
									</View>
									<View style={{flexDirection: 'row'}}>
										{shiftCount.complete > 0 ? (
											<TouchableOpacity
												style={CommonStyles.flex}
												onPress={selectComplete}>
												<MyShiftsStatusContainerComponent
													title={'Completed Shifts'}
													count={shiftCount.complete || '0'}
													selected={showComplete}
												/>
											</TouchableOpacity>
										) : (
											<View style={CommonStyles.flex}>
												<MyShiftsStatusContainerComponent
													title={'Completed Shifts'}
													count={shiftCount.complete || '0'}
													selected={showComplete}
												/>
											</View>
										)}
										{shiftCount.closed > 0 ? (
											<TouchableOpacity
												style={CommonStyles.flex}
												onPress={selectClosed}>
												<MyShiftsStatusContainerComponent
													title={'Closed Shifts'}
													count={shiftCount.closed || '0'}
													selected={showClosed}
												/>
											</TouchableOpacity>
										) : (
											<View style={CommonStyles.flex}>
												<MyShiftsStatusContainerComponent
													title={'Closed Shifts'}
													count={shiftCount.closed || '0'}
													selected={showClosed}
												/>
											</View>
										)}
									</View>
									<View style={{marginHorizontal: 10, marginVertical: 20}}>
										<Text style={styles.shiftsFoundText}>
											{showAppliedShifts ? appliedCount : totalCount || '0'}{' '}
											shifts found
										</Text>
									</View>
								</>
							}
							ListEmptyComponent={
								<ErrorComponent
									icon={ImageConfig.EmptyIconSVG}
									width={200}
									height={200}
									text="List is empty!"
								/>
							}
							onEndReachedThreshold={showAppliedShifts ? null : 0.7}
							keyExtractor={(item, index) => item._id + '_' + index}
							renderItem={({item}) => {
								return (
									<>
										<View
											style={{
												marginHorizontal: 10,
											}}>
											<MyShiftComponent
												id={
													showAppliedShifts
														? item.requirement_details.facility_id
														: item.facility_id
												}
												dateOfShift={
													showAppliedShifts ? item.shift_date : item.shift_date
												}
												shiftStartTime={
													showAppliedShifts
														? item.requirement_details.expected.shift_start_time
														: item.expected.shift_start_time
												}
												shiftEndTime={
													showAppliedShifts
														? item.requirement_details.expected.shift_end_time
														: item.expected.shift_end_time
												}
												HCPLevel={
													showAppliedShifts
														? item.hcp_data.hcp_type
														: item.hcp_user.hcp_type
												}
												requirementID={
													showAppliedShifts
														? item.requirement_id
														: item.requirement_id
												}
												warningType={
													showAppliedShifts
														? item.requirement_details.warning_type
														: item.warning_type
												}
												shiftType={
													showAppliedShifts
														? item.requirement_details.shift_type
														: item.shift_type
												}
												shiftStatus={
													showAppliedShifts ? item.status : item.shift_status
												}
												appliedPending={showAppliedShifts ? true : false}
												onNext={() => {
													if (item.shift_status === 'complete') {
														navigation.navigate(NavigateTo.Attendance, {
															screen: NavigateTo.AttendanceChartScreen,
															params: {shiftID: item._id},
														});
													}
													//  else if (item.shift_status === 'closed') {
													// 	navigation.navigate(NavigateTo.Attendance, {
													// 		screen: NavigateTo.FeedbackScreen,
													// 		params: {shiftID: item._id},
													// 	});
													// }
													else {
														return;
													}
												}}
											/>
										</View>
									</>
								);
							}}
						/>
					</View>
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	shiftsFoundText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 14,
		color: Colors.textOnTextLight,
	},
	calendar: {
		marginBottom: 10,
	},
	text: {
		textAlign: 'center',
		padding: 10,
		backgroundColor: 'lightgrey',
		fontSize: 16,
	},
	switchContainer: {
		flexDirection: 'row',
		margin: 10,
		alignItems: 'center',
	},
	switchText: {
		margin: 10,
		fontSize: 16,
	},
});

export default MyShiftsScreen;

// import React, {useState, useEffect} from 'react';
// import {
// 	StyleSheet,
// 	Text,
// 	View,
// 	TouchableOpacity,
// 	StatusBar,
// 	FlatList,
// 	ActivityIndicator,
// 	Image,
// } from 'react-native';

// const MyShiftsScreen = () => {
// 	const [data, setData] = useState([]);
// 	const [isLoading, setIsoading] = useState(false);
// 	const [pageCurrent, setPageCurrent] = useState(1);

// 	useEffect(() => {
// 		console.log('useEffect', pageCurrent);

// 		setIsoading(true);
// 		getData();
// 		return () => {};
// 	}, [pageCurrent]);

// 	const getData = async () => {
// 		const apiUrl =
// 			'https://jsonplaceholder.typicode.com/photos?_limit=10&_page=' +
// 			pageCurrent;
// 		fetch(apiUrl)
// 			.then(res => res.json())
// 			.then(resJson => {
// 				setData(data.concat(resJson));
// 				setIsoading(false);
// 			});
// 	};
// 	// @ts-ignore
// 	const itemView = ({item, index}) => {
// 		return (
// 			<>
// 				<View style={styles.itemRow}>
// 					<Image source={{uri: item.url}} style={styles.itemImage} />
// 					<Text style={styles.itemText}>{item.title}</Text>
// 					<Text style={styles.itemText}>{item.id}</Text>
// 				</View>
// 			</>
// 		);
// 	};

// 	const handleLoadMore = () => {
// 		setPageCurrent(pageCurrent + 1);
// 		setIsoading(true);
// 	};

// 	return (
// 		<>
// 			<FlatList
// 				style={styles.container}
// 				data={data}
// 				renderItem={itemView}
// 				keyExtractor={(item: any, index: any) => index.toString()}
// 				ListFooterComponent={
// 					isLoading ? (
// 						<>
// 							<View
// 								style={{
// 									height: 60,
// 									marginVertical: 20,
// 								}}>
// 								<ActivityIndicator size={20} />
// 							</View>
// 						</>
// 					) : null
// 				}
// 				onEndReached={handleLoadMore}
// 				onEndReachedThreshold={0.7}
// 			/>
// 		</>
// 	);
// };
// const styles = StyleSheet.create({
// 	container: {
// 		marginTop: 20,
// 		backgroundColor: '#f5fcff',
// 	},
// 	itemRow: {
// 		borderBottomColor: '#ccc',
// 		marginBottom: 10,
// 		borderWidth: 1,
// 	},
// 	itemImage: {
// 		width: '100%',
// 		height: 200,
// 		resizeMode: 'cover',
// 	},
// 	itemText: {
// 		fontSize: 16,
// 		padding: 5,
// 	},
// });

// export default MyShiftsScreen;
