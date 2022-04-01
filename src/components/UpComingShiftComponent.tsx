import React, {useEffect, useState, useCallback} from 'react';
import {
	FlexStyle,
	StyleSheet,
	Text,
	View,
	StyleProp,
	ViewStyle,
	Alert,
	Image,
} from 'react-native';
import {CommonStyles} from '../helpers';
import {Colors, FontConfig, ImageConfig, ENV} from '../constants';
import moment from 'moment';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../helpers';
import {ErrorComponent} from './core';

export interface ShiftDetailsComponentProps {
	facilityName?: string | '';
	class?: 'primary' | 'secondary' | 'tertiary';
	shiftStartTime?: any;
	shiftEndTime?: any;
	dateOfShift?: any;
	HCPLevel?: string;
	salary?: string | '50';
	icon?: string;
	iconSize?: number;
	isLoadingCompleted?: boolean;
	iconStyle?: FlexStyle;
	daysRemaining?: string;
	style?: StyleProp<ViewStyle>;
	facilityAddress?: string;
	id?: any;
}

const UpComingShiftComponent = (props: ShiftDetailsComponentProps) => {
	// const facilityName = props.facilityName || '';
	// const boxClass = props.class || 'secondary' || 'tertiary';
	const shiftStartTime = props.shiftStartTime;
	const shiftEndTime = props.shiftEndTime;
	var dateOfShift = props.dateOfShift;
	const isLoadingCompleted = props.isLoadingCompleted || false;
	const id = props.id;
	const [isLoading, setIsLoading]: any = useState(true);
	const [facility, setFacilty]: any = useState();

	//-----------------Shift date ISO to string calculation---------------------------
	var dateOfShiftExtract = dateOfShift.substring(0, 10);

	const shiftDate = new Date(dateOfShift);
	const StartTime = new Date(shiftStartTime);
	const EndTime = new Date(shiftEndTime);
	// var dateInLocal = shiftDate.toLocaleDateString().replace('/', '-');
	var startTimeInLocal = StartTime.toLocaleTimeString();
	var endTimeInLocal = EndTime.toLocaleTimeString();
	// var repDateInLocal = dateInLocal.replace('/', '-');

	var mydate = new Date(shiftDate);
	var date = moment(mydate).utcOffset(0, false).format('DD MMM, YYYY');

	var shiftStartTimeExtract = moment(StartTime, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');
	var shiftEndTimeExtract = moment(endTimeInLocal, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');
	//---------------------------------------------------------------------------------

	// -----------------Shift date difference calculation---------------------------
	var startDate = moment(dateOfShiftExtract, 'YYYY-MM-DD').utcOffset(0, false);
	var today = moment().utcOffset(0, false);
	var dateDiff = today.diff(startDate, 'days') * -1;
	//---------------------------------------------------------------------------------

	// -----------------Shift time difference calculation---------------------------
	let startShiftTime = moment(StartTime, ['YYYY-MM-DD h:mm:ss A']).utcOffset(
		0,
		false,
	);

	let endShiftTime = moment(EndTime, ['YYYY-MM-DD h:mm:ss A']).utcOffset(
		0,
		false,
	);

	var TotalSeconds = endShiftTime.diff(startShiftTime, 'seconds') - 1800;

	var hours = Math.floor(TotalSeconds / 3600);
	var minutes = Math.floor((TotalSeconds / 60) % 60);

	const shiftDiffHours = hours < 0 ? hours * -1 : hours;
	const shiftDiffMinute = minutes < 0 ? minutes * -1 : minutes;
	//---------------------------------------------------------------------------------

	// api call
	const getFacilityDetails = useCallback(() => {
		setIsLoading(true);
		// setIsLoaded(false);
		ApiFunctions.get(ENV.apiUrl + 'facility/' + id)
			.then(async resp => {
				if (resp) {
					setFacilty(resp.data);
				} else {
					Alert.alert('Error', resp);
				}
				isLoadingCompleted ? setIsLoading(false) : setIsLoading(true);
				// setIsLoaded(true);
			})
			.catch((err: any) => {
				isLoadingCompleted ? setIsLoading(false) : setIsLoading(true);
				// setIsLoaded(true);
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [id, isLoadingCompleted]);

	useEffect(() => {
		getFacilityDetails();
	}, [getFacilityDetails]);

	return (
		<>
			{!isLoading && !facility && <ErrorComponent />}
			{!isLoading && facility && (
				<>
					<>
						<View
							key={facility.facilityName + '_' + facility.facility_id}
							style={[
								styles.container,
								{
									marginBottom: 15,
									borderColor: Colors.backgroundShiftBoxColor,
									borderWidth: 1,
									flexGrow: 1,
									backgroundColor: Colors.backgroundColor,
									marginHorizontal: 10,
								},
							]}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}>
								<View style={{width: '75%'}}>
									<View>
										<Text
											style={[
												styles.facilityNameTitle,
												CommonStyles.paddingBottom,
											]}>
											{facility.facility_name}
										</Text>
									</View>
									<View>
										<Text
											style={[
												styles.shiftDateText,
												CommonStyles.paddingBottom,
											]}>
											{date}
											{'   '}|{'   '}
											{dateDiff} days
										</Text>
									</View>
									<View
										style={[
											styles.shiftTimeContainer,
											CommonStyles.paddingBottom,
										]}>
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
										<Text style={[styles.shiftTimeText]}>
											{shiftEndTimeExtract}
										</Text>
									</View>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'flex-start',
											marginTop: 5,
										}}>
										<ImageConfig.LocationIconBlue
											width={15}
											height={15}
											style={{marginTop: 2}}
											color={Colors.primary}
										/>
										<Text
											style={{
												// borderWidth: 1,
												width: 200,
												fontFamily: FontConfig.primary.regular,
												fontSize: 11,
												marginLeft: 5,
											}}>
											{facility.address.city}, {facility.address.state},{' '}
											{facility.address.country}
										</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', alignItems: 'center'}}>
									{/* <ImageConfig.Logo
										width={70}
										height={50}
										color={Colors.primary}
									/> */}
									<Image
										resizeMethod={'auto'}
										resizeMode={facility.image_url ? 'cover' : 'contain'}
										style={{width: 70, height: 70}}
										source={
											facility.image_url
												? {uri: facility.image_url}
												: ImageConfig.placeholder
										}
									/>
									<Text />
									<Text />
								</View>
							</View>
						</View>
					</>
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
	},
	facilityNameTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 16,
		width: 200,
		// backgroundColor: 'red',
		textTransform: 'capitalize',
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
		marginHorizontal: 7,
	},
	horizontalRule: {
		width: 10,
		height: 1,
		backgroundColor: Colors.textLight,
	},
});

export default UpComingShiftComponent;
