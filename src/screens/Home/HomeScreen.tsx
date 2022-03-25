import React, {useCallback, useEffect, useState} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
	Alert,
	RefreshControl,
	FlatList,
} from 'react-native';
import {CommonStyles, ToastAlert} from '../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import UpComingShiftComponent from '../../components/UpComingShiftComponent';
import {
	BaseViewComponent,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import {StateParams} from '../../store/reducers';
import {useDispatch, useSelector} from 'react-redux';
import {ApiFunctions} from '../../helpers';
import moment from 'moment';
import {
	PaginationType,
	TSAPIResponseType,
	PaginationResponseType,
} from '../../helpers/ApiFunctions';
import {hcpShiftsList} from '../../constants/CommonTypes';
import analytics from '@segment/analytics-react-native';

const HomeScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const navigation = props.navigation;
	const [shift, setShift] = useState<hcpShiftsList[] | null>(null);
	const [pagination, setPagination] = useState<PaginationType | null>(null);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;

	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;

	const getShiftDetails = useCallback(
		(page = 1, limit = 30) => {
			let date = new Date();
			const curDate = moment(date).format('YYYY-MM-DD');
			setIsLoading(true);
			if (user) {
				const payload = {
					page,
					limit,
					new_shifts: curDate,
					status: ['pending'],
				};
				ApiFunctions.post(ENV.apiUrl + 'shift/hcp', payload)
					.then(
						async (resp: TSAPIResponseType<PaginationResponseType<any>>) => {
							setIsLoading(false);
							setIsLoaded(true);
							if (resp) {
								if (resp.success) {
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
								setIsLoading(false);
								setIsLoaded(true);
							}
						},
					)
					.catch((err: any) => {
						setIsLoading(false);
						setIsLoaded(true);
						console.log(err);
						// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
					});
			}
		},
		[user],
	);

	useEffect(() => {
		const focusListener = navigation.addListener('focus', getShiftDetails);
		return () => {
			focusListener();
		};
	}, [getShiftDetails, navigation]);

	useEffect(() => {
		analytics.screen('Home Screen Opened');
		return () => {
			analytics.screen('Home Screen Exited');
		};
	}, []);

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

	//@ts-ignore
	const ItemView = ({item}) => {
		return (
			<>
				<View key={item._id + '--'}>
					<View>
						{/*
						----pass these params if navigating to shift details screen----
						facilityID: item.facility_id,
						requirementID: item.requirement_id, */}
						<UpComingShiftComponent
							isLoadingCompleted={!isLoading && isLoaded}
							id={item.facility_id}
							dateOfShift={item.shift_date}
							shiftStartTime={item.expected.shift_start_time}
							shiftEndTime={item.expected.shift_end_time}
						/>
					</View>
				</View>
			</>
		);
	};

	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !shift && <ErrorComponent />}
			{!isLoading && isLoaded && shift && (
				<>
					{shift.length === 0 && <ErrorComponent text={'No upcoming shifts'} />}
					{shift.length > 0 && (
						<BaseViewComponent
							noScroll={true}
							contentContainerStyle={{
								flexGrow: 1,
								paddingBottom: 20,
							}}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backgroundColor}
							/>
							<View style={{flexGrow: 1}}>
								<FlatList
									data={shift}
									onRefresh={getShiftDetails}
									refreshing={isLoading}
									onEndReached={loadNextPage}
									ListHeaderComponent={
										<>
											<View style={styles.screen}>
												<View
													style={{
														flexDirection: 'row',
														alignItems: 'center',
													}}>
													<ImageConfig.LocationIconBlue height="50" />
													<Text
														style={{
															fontSize: 14,
															fontFamily: FontConfig.primary.bold,
															color: Colors.textDark,
															marginLeft: 10,
														}}>
														{HcpUser.address.region}
													</Text>
												</View>
												<View
													style={{
														flexDirection: 'row',
														justifyContent: 'space-between',
														marginVertical: 20,
														alignItems: 'center',
													}}>
													<Text
														style={{
															fontFamily: FontConfig.primary.bold,
															fontSize: 18,
														}}>
														Upcoming Shifts
													</Text>
													<Text
														style={{
															fontFamily: FontConfig.primary.semiBold,
															fontSize: 12,
															color: Colors.textOnAccent,
														}}
													/>
												</View>
											</View>
										</>
									}
									ListEmptyComponent={
										<ErrorComponent
											text={'List is empty!'}
											style={{minHeight: 250}}
										/>
									}
									onEndReachedThreshold={0.7}
									keyExtractor={(item, index) => item._id + '_' + index}
									renderItem={ItemView}
								/>
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
		padding: 10,
		flex: 1,
	},
});

export default HomeScreen;
