import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, StyleProp, ViewStyle} from 'react-native';
import {CommonStyles} from '../helpers';
import {Colors, FontConfig, ImageConfig} from '../constants';
import moment from 'moment';
import {CustomButton} from './core';

export interface ShiftDetailsComponentProps {
	shiftStartTime?: any;
	shiftEndTime?: any;
	dateOfShift?: any;
	HCPLevel?: string;
	style?: StyleProp<ViewStyle>;
	facilityAddress?: any;
	facilityName?: string;
	onNext?: () => void;
	onAttendanceStart?: () => void;
	statusInProgress?: boolean;
	shiftDuration?: any;
}

const UpComingShiftCountdownComponent = (props: ShiftDetailsComponentProps) => {
	const shiftStartTime = props.shiftStartTime;
	const shiftEndTime = props.shiftEndTime;
	const dateOfShift = props.dateOfShift;
	const HCPLevel = props.HCPLevel;
	const facilityAddress = props.facilityAddress;
	const facilityName = props.facilityName;
	const statusInProgress = props.statusInProgress;
	const shiftDuration = props.shiftDuration;
	const {onNext, onAttendanceStart} = props;

	const StartTime = new Date(shiftStartTime);
	const EndTime = new Date(shiftEndTime);
	const [dateTime, setDateTime] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	const date = moment(dateOfShift).utcOffset(0, false).format('ddd, MMM DD');

	const shiftStartTimeExtract = moment(StartTime, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');

	const shiftEndTimeExtract = moment(EndTime, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');

	// -------------------------countdown time---------------------------------------
	useEffect(() => {
		const interval = setInterval(() => {
			let curTime = moment()
				.utcOffset(0, false)
				.format('DD-MM-YYYY hh:mm:ss A');

			let startShiftTime = moment(StartTime, ['DD-MM-YYYY h:mm:ss A'])
				.utcOffset(0, false)
				.format('DD-MM-YYYY hh:mm:ss A');

			const CountDownSeconds = moment(startShiftTime, 'DD-MM-YYYY hh:mm:ss A')
				.utcOffset(0, false)
				.diff(
					moment(curTime, 'DD-MM-YYYY hh:mm:ss A').utcOffset(0, false),
					'seconds',
				);

			const hours = Math.floor(CountDownSeconds / 3600);
			const minutes = Math.floor((CountDownSeconds / 60) % 60);
			const seconds = CountDownSeconds % 60;
			if (hours >= 0 && minutes >= 0 && seconds >= 0) {
				setDateTime({hours: hours, minutes: minutes, seconds: seconds});
			} else {
				setDateTime({hours: 0, minutes: 0, seconds: 0});
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [StartTime]);

	//  -----------------Shift time difference calculation---------------------------
	let startShiftTime = moment(StartTime, ['YYYY-MM-DD h:mm:ss A']);
	let endShiftTime = moment(EndTime, ['YYYY-MM-DD h:mm:ss A']);

	const TotalSeconds = endShiftTime.diff(startShiftTime, 'seconds');
	const hours = Math.floor(TotalSeconds / 3600);
	const minutes = Math.floor((TotalSeconds / 60) % 60);

	const shiftDiffHours = hours < 0 ? hours * -1 : hours;
	const shiftDiffMinute = minutes < 0 ? minutes * -1 : minutes;

	return (
		<>
			<View style={styles.shiftDetailsContainer}>
				<View
					style={{
						backgroundColor: 'white',
						borderRadius: 5,
					}}>
					{statusInProgress ? (
						<View
							style={{
								alignItems: 'center',
								backgroundColor: '#4FE6AF',
								borderTopLeftRadius: 5,
								borderTopRightRadius: 5,
								paddingVertical: 10,
							}}>
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 24,
									color: Colors.textOnPrimary,
									marginVertical: 5,
								}}>
								Your shift inprogress
							</Text>
							<Text
								style={{
									fontFamily: FontConfig.primary.semiBold,
									fontSize: 14,
									color: Colors.textOnPrimary,
									marginTop: 5,
								}}>
								{date}
							</Text>
							<View style={[styles.shiftTimeContainer]}>
								<Text style={[styles.shiftTimeText]}>
									{shiftStartTimeExtract}
								</Text>
							</View>
						</View>
					) : (
						<>
							<View style={{backgroundColor: '#0C80E3'}}>
								<View style={{alignItems: 'center', marginVertical: 15}}>
									<Text
										style={{
											fontFamily: FontConfig.primary.bold,
											fontSize: 24,
											color: Colors.backgroundColor,
										}}>
										{'Your next shift on'}
									</Text>
									<Text
										style={{
											fontFamily: FontConfig.primary.bold,
											fontSize: 48,
											color: Colors.backgroundColor,
										}}>
										{(dateTime.hours > 9
											? dateTime.hours
											: '0' + dateTime.hours) +
											':' +
											(dateTime.minutes > 9
												? dateTime.minutes
												: '0' + dateTime.minutes) +
											':' +
											(dateTime.seconds > 9
												? dateTime.seconds
												: '0' + dateTime.seconds)}
									</Text>
								</View>
							</View>
							<View style={{marginVertical: 15, marginLeft: 20}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										fontSize: 14,
										color: Colors.textOnAccent,
										textTransform: 'uppercase',
									}}>
									{date} | {HCPLevel}
								</Text>
							</View>
							<View
								style={[
									styles.shiftTimeContainer,
									CommonStyles.paddingBottom,
									{marginVertical: 5, marginLeft: 20},
								]}>
								<View style={{flexDirection: 'row'}}>
									<ImageConfig.upcomingShiftTimeIcon
										width={'20'}
										height={'20'}
									/>
									<Text
										style={[
											{
												marginLeft: 5,
												fontFamily: FontConfig.primary.bold,
												fontSize: 18,
												color: Colors.textDark,
											},
										]}>
										{shiftStartTimeExtract}
									</Text>
								</View>
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
								<View style={{flexDirection: 'row'}}>
									<ImageConfig.upcomingShiftTimeIcon
										width={'20'}
										height={'20'}
									/>
									<Text
										style={[
											{
												marginLeft: 5,
												fontFamily: FontConfig.primary.bold,
												fontSize: 18,
												color: Colors.textDark,
											},
										]}>
										{shiftEndTimeExtract}
									</Text>
								</View>
							</View>
						</>
					)}

					<View style={CommonStyles.horizontalLine} />
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginVertical: 15,
							paddingHorizontal: 20,
						}}>
						<View>
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 14,
									color: Colors.textDark,
									marginVertical: 3,
								}}>
								{facilityName}
							</Text>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<ImageConfig.LocationIconBlue width={'15'} height={'15'} />
								<Text
									style={{
										fontFamily: FontConfig.primary.regular,
										fontSize: 10,
										color: Colors.textOnTextLight,
										marginVertical: 3,
										width: '70%',
										marginLeft: 4,
									}}>
									{facilityAddress.street}, {facilityAddress.city},{' '}
									{facilityAddress.region_name}, {facilityAddress.state},
									{facilityAddress.country}, {facilityAddress.zip_code},
								</Text>
							</View>
						</View>
						<View>
							<CustomButton
								autoWidth={true}
								style={{
									flex: 0,
									borderRadius: 8,
									marginVertical: 0,
									height: 40,
									backgroundColor: Colors.backgroundShiftColor,
								}}
								title={'View'}
								class={'secondary'}
								textStyle={{
									color: Colors.primary,
									textTransform: 'none',
									fontFamily: FontConfig.primary.bold,
									fontSize: 14,
								}}
								onPress={onNext}
							/>
						</View>
					</View>
				</View>
				<View
					style={{
						alignItems: 'center',
						marginTop: -15,
					}}>
					<CustomButton
						title={statusInProgress ? 'Resume' : 'Begin Now'}
						onPress={onAttendanceStart}
						style={styles.button}
						textStyle={{
							color: Colors.textOnPrimary,
							textTransform: 'none',
							fontFamily: FontConfig.primary.bold,
							fontSize: 14,
						}}
					/>
				</View>
			</View>
			{/* )} */}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: Colors.backgroundColor,
		borderRadius: 5,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	shiftDetailsContainer: {
		marginHorizontal: 10,
		marginVertical: 20,
		width: '100%',
	},
	facilityNameTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 14,
		width: 200,
	},
	shiftDateText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 10,
		color: Colors.textOnAccent,
	},
	shiftTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	shiftTimeText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 48,
		color: Colors.textOnPrimary,
	},
	shiftTimeDifferenceText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 10,
		color: Colors.textLight,
		marginHorizontal: 5,
	},
	horizontalRule: {
		width: 10,
		height: 1,
		backgroundColor: Colors.textLight,
	},
	button: {
		borderRadius: 8,
		height: 40,
		width: '50%',
		backgroundColor: Colors.backgroundShiftColor,
		justifyContent: 'center',
	},
});

export default UpComingShiftCountdownComponent;
