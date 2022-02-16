import React, {useEffect, useState, useCallback} from 'react';
import {
	FlexStyle,
	StyleSheet,
	Text,
	View,
	StyleProp,
	ViewStyle,
	Alert,
} from 'react-native';
import {CommonStyles} from '../helpers';
import {Colors, FontConfig, ImageConfig, ENV} from '../constants';
import moment from 'moment';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../helpers';
import {ErrorComponent, LoadingComponent} from './core';
import AttendanceStatusBoxComponent from './AttendanceStatusBoxComponent';

export interface AttendanceTimelineComponentProps {
	shiftID?: any;
}

const AttendanceTimelineComponent = (
	props: AttendanceTimelineComponentProps,
) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [shift, setShift]: any = useState();
	const [isLoaded, setIsLoaded]: any = useState(false);
	const shiftID = props.shiftID;

	const getShiftDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'shift/' + shiftID)
			.then(async resp => {
				if (resp) {
					setShift(resp.data.time_breakup.break_timings);
					
				} else {
					Alert.alert('Error', resp);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(true);
				setIsLoaded(true);
				console.log(err);
			});
	}, []);
	useEffect(() => {
		console.log('loading get shift main screen');
		getShiftDetails();
	}, [getShiftDetails]);

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

	return (
		<>
			{isLoading && (
				<LoadingComponent backgroundColor={Colors.backgroundShiftColor} />
			)}
			{!isLoading && !shift && <ErrorComponent />}
			{!isLoading && shift && (
				<>
					{shift.map((item: any, index: any) => (
						<>
							<View key={item.id + '__' + index}>
								<AttendanceStatusBoxComponent
									status={'Break-In'}
									time={
										item.break_in_time
											? tConvert(item.break_in_time.slice(11, 16))
											: '--'
									}
								/>
								{item.break_out_time && (
									<AttendanceStatusBoxComponent
										status={'Break-Out'}
										time={
											item.break_out_time
												? tConvert(item.break_out_time.slice(11, 16))
												: '--'
										}
									/>
								)}
							</View>
						</>
					))}
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({});

export default AttendanceTimelineComponent;
