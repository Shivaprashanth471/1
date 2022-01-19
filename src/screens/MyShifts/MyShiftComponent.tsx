import React, {useEffect, useState, useCallback} from 'react';
import {
	FlexStyle,
	Image,
	StyleSheet,
	Text,
	View,
	StyleProp,
	ViewStyle,
	Alert,
	StatusBar,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import {CommonStyles} from '../../helpers';
import {
	Colors,
	FontConfig,
	ImageConfig,
	ENV,
	NavigateTo,
} from '../../constants';
import moment from 'moment';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../helpers';
import {
	BaseViewComponent,
	CustomButton,
	KeyboardAvoidCommonView,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import LinearGradient from 'react-native-linear-gradient';

export interface MyShiftComponentProps {
	facilityName?: string | '';
	class?: 'primary' | 'secondary' | 'tertiary';
	shiftStartTime?: any;
	shiftEndTime?: any;
	dateOfShift?: any;
	HCPLevel?: string;
	salary?: string | '50';
	icon?: string;
	iconSize?: number;
	iconStyle?: FlexStyle;
	daysRemaining?: string;
	style?: StyleProp<ViewStyle>;
	facilityAddress?: string;
	id?: any;
	requirementID?: any;
	warningType?: string;
	shiftType?: string;
	navigation?: any;
	shiftStatus?: any;
	onNext?: () => void;
	appliedPending?: boolean;
}

const MyShiftComponent = (props: MyShiftComponentProps) => {
	const shiftStartTime = props.shiftStartTime;
	const shiftEndTime = props.shiftEndTime;
	const dateOfShift = props.dateOfShift;
	const HCPLevel = props.HCPLevel;
	const style = props.style;
	const id = props.id;
	const requirementID = props.requirementID;
	const warningType = props.warningType;
	const shiftType = props.shiftType;
	const navigation = props.navigation;
	const shiftStatus = props.shiftStatus;
	const appliedPending = props.appliedPending;
	const {onNext} = props;
	const [shiftName, setShiftName]: any = useState(shiftStatus);

	if (!appliedPending) {
		if (shiftName === 'pending') {
			console.log('shift name from pending to upcoming');
			setShiftName('upcoming');
		}
	}

	var color =
		shiftName === 'pending'
			? appliedPending
				? Colors.gradientShiftStatus[1]
				: Colors.gradientShiftStatus[3]
			: shiftName === 'complete'
			? Colors.gradientShiftStatus[0]
			: shiftName === 'closed'
			? Colors.gradientShiftStatus[2]
			: shiftName === 'upcoming'
			? Colors.gradientShiftStatus[3]
			: shiftName === 'approved'
			? Colors.gradientShiftStatus[2]
			: shiftName === 'cancelled'
			? Colors.gradientShiftStatus[3]
			: shiftName === 'rejected'
			? Colors.gradientShiftStatus[3]
			: Colors.gradientShiftStatus[1];
	// shiftName === 'pending'
	// 	? Colors.gradientShiftStatus[3]
	// 	: shiftName === 'complete'
	// 	? Colors.gradientShiftStatus[0]
	// 	: shiftName === 'closed'
	// 	? Colors.gradientShiftStatus[2]
	// 	: Colors.gradientShiftStatus[1];

	const shiftDate = new Date(dateOfShift);
	const StartTime = new Date(shiftStartTime);
	const EndTime = new Date(shiftEndTime);
	// var dateInLocal = shiftDate.toLocaleDateString().replace('/', '-');
	var startTimeInLocal = StartTime.toLocaleTimeString();
	var endTimeInLocal = EndTime.toLocaleTimeString();
	// var repDateInLocal = dateInLocal.replace('/', '-');
	var mydate = new Date(shiftDate);
	var date = moment(mydate).utcOffset(0, false).format('DD MMM, YYYY');
	var shiftStartTimeExtract = moment(startTimeInLocal, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');
	var shiftEndTimeExtract = moment(endTimeInLocal, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');
	const [isLoading, setIsLoading]: any = useState(true);
	const [facility, setFacilty]: any = useState();
	const [isLoaded, setIsLoaded]: any = useState(false);

	//
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;

	// -----------------Shift time difference calculation---------------------------
	let startShiftTime = moment(StartTime, ['YYYY-MM-DD h:mm:ss A']).utcOffset(
		0,
		false,
	);

	let endShiftTime = moment(EndTime, ['YYYY-MM-DD h:mm:ss A']).utcOffset(
		0,
		false,
	);

	var TotalSeconds = endShiftTime.diff(startShiftTime, 'seconds');

	var hours = Math.floor(TotalSeconds / 3600);
	var minutes = Math.floor((TotalSeconds / 60) % 60);

	const shiftDiffHours = hours < 0 ? hours * -1 : hours;
	const shiftDiffMinute = minutes < 0 ? minutes * -1 : minutes;

	// api call

	const getFacilityDetails = useCallback(() => {
		setIsLoading(true);

		ApiFunctions.get(ENV.apiUrl + 'facility/' + id)
			.then(async resp => {
				if (resp) {
					setFacilty(resp.data);
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
		getFacilityDetails();
	}, [getFacilityDetails]);

	return (
		<>
			{/*{isLoading && <LoadingComponent />}*/}
			{!isLoading && isLoaded && !facility && <ErrorComponent />}
			{!isLoading && isLoaded && facility && (
				<>
					{/* <TouchableOpacity
						// underlayColor={'#F2F9FE'}
						activeOpacity={0.8}
						onPress={() => {
							console.log('click');
						}}> */}
					<View
						style={[
							styles.container,
							style,
							{
								// elevation: 6,
								borderWidth: 1.5,
								borderColor: Colors.backgroundShiftBoxColor,
								// display: shiftStatus === 'complete' ? 'none' : 'flex',
							},
						]}>
						<View>
							<Text
								style={[styles.facilityNameTitle, CommonStyles.paddingBottom]}
								numberOfLines={1}>
								{facility.facility_name}
							</Text>
						</View>

						<View>
							<Text
								style={[
									styles.shiftDateText,
									CommonStyles.paddingBottom,
									{
										// textTransform: 'uppercase',
									},
								]}>
								{date}
								{'   '}|{'   '}
								{HCPLevel}
							</Text>
						</View>
						<View
							style={[styles.shiftTimeContainer, CommonStyles.paddingBottom]}>
							<Text style={[styles.shiftTimeText]}>
								{shiftStartTimeExtract}
							</Text>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginHorizontal: 5,
								}}>
								<View style={styles.horizontalRule} />
								<View>
									<Text style={[styles.shiftTimeDifferenceText]}>
										{shiftDiffHours}h {shiftDiffMinute}m
									</Text>
								</View>
								<View style={styles.horizontalRule} />
							</View>
							<Text style={[styles.shiftTimeText]}>{shiftEndTimeExtract}</Text>
						</View>

						<View
							style={{
								// flexDirection: 'row',
								// justifyContent: 'space-between',
								// alignItems: 'center',
								marginVertical: 10,
							}}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-start',
									paddingVertical: 2,
									width: '100%',
								}}>
								<View>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'center',
											alignItems: 'center',
											marginRight: 10,
										}}>
										{shiftType === 'PM' && (
											<ImageConfig.MoonLight width="22" height="22" />
										)}
										{shiftType === 'PM-12' && (
											<ImageConfig.MoonLight width="22" height="22" />
										)}
										{shiftType === 'AM' && (
											<ImageConfig.SunIconLight width="22" height="22" />
										)}
										{shiftType === 'AM-12' && (
											<ImageConfig.SunIconLight width="22" height="22" />
										)}
										{shiftType === 'NOC' && (
											<ImageConfig.MoonLight width="22" height="22" />
										)}
										<View
											style={{
												marginLeft: 5,
												width: 30,
												alignItems: 'center',
											}}>
											<Text
												style={{
													fontFamily: FontConfig.primary.regular,
													fontSize: 11,
													color: Colors.textOnTextLight,
													// shiftType === 'AM'
													// 	? '#FC8600'
													// 	: shiftType === 'AM-12'
													// 	? '#FC8600'
													// 	: shiftType === 'PM'
													// 	? '#667B8B'
													// 	: shiftType === 'PM-12'
													// 	? '#667B8B'
													// 	: '#667B8B',
												}}>
												{shiftType} {'Shifts'}
											</Text>
										</View>
									</View>
								</View>
								<View>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'center',
											alignItems: 'center',
											marginRight: 10,
										}}>
										<ImageConfig.warningType width="22" height="22" />
										{/* {warningType === 'red' && (
											<ImageConfig.warningZoneRed width="20" height="20" />
										)}
										{warningType === 'yellow' && (
											<ImageConfig.warningZoneYellow width="20" height="20" />
										)}
										{warningType === 'green' && (
											<ImageConfig.warningZoneGreen width="20" height="20" />
										)} */}
										<View
											style={{
												marginLeft: 5,
												width: 30,
												alignItems: 'center',
											}}>
											<Text
												style={{
													textTransform: 'capitalize',
													fontFamily: FontConfig.primary.regular,
													fontSize: 11,
													color: Colors.textOnTextLight,
													// warningType === 'red'
													// 	? '#FF1329'
													// 	: warningType === 'yellow'
													// 	? '#E8EF1D'
													// 	: '#4FCE5D',
												}}>
												{warningType} {'zone'}
											</Text>
										</View>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'flex-start',
										marginRight: 10,
									}}>
									<ImageConfig.LocationIconLightGray width="28" height="28" />
									<View
										style={{
											marginLeft: 5,
											width: 100,
											alignItems: 'center',
										}}>
										<Text
											numberOfLines={2}
											style={{
												textTransform: 'capitalize',
												fontFamily: FontConfig.primary.regular,
												fontSize: 11,
												color: Colors.textOnTextLight,
											}}>
											{facility?.address.street +
												' ' +
												facility?.address.city +
												' ' +
												facility?.address.region_name +
												' ' +
												facility?.address.state +
												' ' +
												facility?.address.country +
												' ' +
												facility?.address.zip_code}
										</Text>
									</View>
								</View>
							</View>
						</View>
						<View style={[CommonStyles.horizontalLine, {marginVertical: 8}]} />
						<View style={{alignItems: 'flex-end'}}>
							{shiftStatus === 'complete' ? (
								<>
									<TouchableOpacity
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											width: '37%',
											marginTop: 5,
										}}
										onPress={onNext}>
										<View
											style={{
												width: '100%',
											}}>
											<LinearGradient
												start={{x: 0.0, y: 0.25}}
												end={{x: 0.5, y: 1.0}}
												colors={color}
												style={{
													justifyContent: 'center',
													alignItems: 'center',
													alignContent: 'center',
													height: 30,
													borderRadius: 5,
												}}>
												<Text
													style={{color: '#FFF', textTransform: 'capitalize'}}>
													{shiftName}
												</Text>
											</LinearGradient>
										</View>
									</TouchableOpacity>
								</>
							) : (
								<>
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											width: '37%',
											marginTop: 5,
										}}>
										<View
											style={{
												width: '100%',
											}}>
											<LinearGradient
												start={{x: 0.0, y: 0.25}}
												end={{x: 0.5, y: 1.0}}
												colors={color}
												style={{
													justifyContent: 'center',
													alignItems: 'center',
													alignContent: 'center',
													height: 30,
													borderRadius: 5,
												}}>
												<Text
													style={{color: '#FFF', textTransform: 'capitalize'}}>
													{shiftName}
												</Text>
											</LinearGradient>
										</View>
									</View>
								</>
							)}
						</View>
					</View>
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: Colors.backgroundColor,
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginVertical: 5,
	},
	facilityNameTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 14,
		width: 200,
	},
	shiftDateText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 16,
		color: Colors.textOnAccent,
	},
	shiftTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	shiftTimeText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 14,
	},
	shiftTimeDifferenceText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 12,
		color: Colors.textLight,
		marginHorizontal: 5,
	},
	horizontalRule: {
		width: 10,
		height: 1,
		backgroundColor: Colors.textLight,
	},
});

export default MyShiftComponent;
