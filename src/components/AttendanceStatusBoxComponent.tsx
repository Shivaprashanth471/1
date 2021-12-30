import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StyleProp,
	ViewStyle,
} from 'react-native';
import {Colors, FontConfig, ImageConfig} from '../constants';
import moment from 'moment';

export interface AttendanceStatusBoxComponentProps {
	status?: string;
	statusBox?: string;
	backgroundColor?: string;
	onPress?: () => void;
	time?: any;
	showStatus?: boolean;
	style?: StyleProp<ViewStyle>;
	showApiTime?: boolean;
}

const AttendanceStatusBoxComponent = (
	props: AttendanceStatusBoxComponentProps,
) => {
	const status = props.status || 'Check-In';
	const backgroundColor = props.backgroundColor || '#E6F2FC';
	const {onPress} = props;
	const time = props.time;
	const style = props.style;
	const showApiTime = props.showApiTime || false;

	const StartTime = new Date(time);
	var startTimeInLocal = StartTime.toLocaleTimeString();
	var shiftStartTimeExtract = moment(startTimeInLocal, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm:ss A');

	const getImageConfig = () => {
		if (status === 'CheckIn' || status === 'check_in_time') {
			return <ImageConfig.IconCheckIn width="20" height="20" />;
		} else if (status === 'Break-In' || status === 'break_in_time') {
			return <ImageConfig.IconBreakin width="20" height="20" />;
		} else if (status === 'Break-Out' || status === 'break_out_time') {
			return <ImageConfig.IconBreakout width="20" height="20" />;
		} else {
			return <ImageConfig.IconCheckIn width="20" height="20" />;
		}
	};

	return (
		<View style={[style, styles.timeBoxContainer]}>
			{showApiTime ? (
				<Text
					style={{
						fontFamily: FontConfig.primary.semiBold,
						fontSize: 14,
						color: Colors.textLight,
					}}>
					{shiftStartTimeExtract}
				</Text>
			) : (
				<Text
					style={{
						fontFamily: FontConfig.primary.semiBold,
						fontSize: 14,
						color: Colors.textLight,
					}}>
					{time}
				</Text>
			)}
			<TouchableOpacity onPress={onPress}>
				<View
					style={[
						styles.timeCheckContainer,
						{backgroundColor: backgroundColor},
					]}>
					<View
						style={{
							backgroundColor:
								status === 'Break-In' ||
								status === 'break_in_time' ||
								status === 'Break-Out' ||
								status === 'break_out_time'
									? Colors.primary
									: Colors.gradientEnd,
							width: 5,
							height: '100%',
							borderTopLeftRadius: 5,
							borderBottomLeftRadius: 5,
							marginRight: 15,
						}}
					/>
					<View style={{flexDirection: 'row'}}>
						<View style={{flexDirection: 'row'}}>
							{(status === 'CheckIn' || status === 'check_in_time') &&
								getImageConfig()}
							{(status === 'Check-Out' || status === 'check_out_time') &&
								getImageConfig()}
							{(status === 'Break-In' || status === 'break_in_time') &&
								getImageConfig()}
							{(status === 'Break-Out' || status === 'break_out_time') &&
								getImageConfig()}
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 14,
									marginHorizontal: 10,
								}}>
								{status}
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	timeCheckContainer: {
		width: 210,
		height: 45,
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 5,
	},
	timeBoxContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
	},
});

export default AttendanceStatusBoxComponent;
