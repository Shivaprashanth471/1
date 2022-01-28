import React, {useCallback, useEffect, useState} from 'react';
import {
	Modal,
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import {Colors, FontConfig, ImageConfig} from '../../constants';
import {CommonFunctions} from '../../helpers';
import CustomButton from './CustomButton';
import LabelComponent from './LabelComponent';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

export interface DatePickerComponentProps {
	date?: string;
	minDate?: string;
	maxDate?: string;
	onChange?: (date: string) => void;
	labelText?: string;
	placeHolder?: string;
	style?: StyleProp<ViewStyle>;
}

const currentDate = Moment();

const DatePickerComponent = (props: DatePickerComponentProps) => {
	const {date, maxDate, minDate, onChange, labelText, placeHolder, style} =
		props;
	const [datepickerShow, setDatepickerShow] = useState(false);
	const [changedDate, setChangedDate] = useState<string | null>(null);

	const [dateConstraints, setDateConstraints] = useState({});

	// maximumDate:{(mode === 'max' ? maxDate.toDate() : pickerMaxDate.toDate())}
	// minimumDate:{(mode === 'max' ? pickerMinDate.toDate() : minDate.toDate())}
	const calcDateConstraints = useCallback(() => {
		const constraints: any = {};

		if (maxDate) {
			constraints.maximumDate = Moment(maxDate).toDate();
		}
		if (minDate) {
			constraints.minimumDate = Moment(minDate).toDate();
		}
		setDateConstraints(constraints);
	}, [maxDate, minDate]);
	useEffect(() => {
		calcDateConstraints();
	}, [minDate, maxDate, calcDateConstraints]);

	useEffect(() => {
		setChangedDate(date || '');
		// if (date) {
		// }
		console.log('date changed', date);
	}, [date]);

	// const changedDate = getDate();

	const getDatePicker = (
		display:
			| 'default'
			| 'compact'
			| 'inline'
			| 'spinner'
			| 'clock'
			| 'calendar' = 'default',
	) => {
		return (
			<RNDateTimePicker
				themeVariant="light"
				value={changedDate ? new Date(changedDate) : currentDate.toDate()}
				{...dateConstraints}
				textColor={
					CommonFunctions.isAndroid() ? Colors.textOnPrimary : Colors.textDark
				}
				mode={'date'}
				display={display}
				style={{
					flex: 1,
					width: '100%',
					backgroundColor: Colors.backgroundColor,
				}}
				onChange={(e: any, value: Moment.MomentInput) => {
					// console.log(e);
					setDatepickerShow(CommonFunctions.isIOS());
					if (value) {
						const curDate = Moment(value).format('YYYY-MM-DD');
						setChangedDate(curDate);
						if (onChange) {
							onChange(curDate);
						}
					}
				}}
			/>
		);
	};

	const openDatePicker = () => {
		console.log('opening date picker');
		setDatepickerShow(true);
	};

	return (
		<>
			{datepickerShow && (
				<>
					{CommonFunctions.isAndroid() && getDatePicker()}
					{CommonFunctions.isIOS() && (
						<Modal
							animationType="none"
							transparent
							visible={datepickerShow}
							presentationStyle="overFullScreen">
							<View
								style={{
									flex: 1,
									backgroundColor: 'white',
									justifyContent: 'flex-end',
									flexDirection: 'column',
								}}>
								<View
									style={{
										backgroundColor: 'white',
										padding: 15,
										paddingBottom: 40,
										flex: 1,
									}}>
									{getDatePicker('spinner')}
									<View style={{alignItems: 'center'}}>
										<CustomButton
											class={'primary'}
											autoWidth={true}
											style={{paddingHorizontal: 20}}
											title={'Done'}
											onPress={() => {
												setDatepickerShow(false);
											}}
										/>
									</View>
								</View>
							</View>
						</Modal>
					)}
				</>
			)}
			<View style={{width: '100%'}}>
				{!!labelText && <LabelComponent title={labelText} />}
				<TouchableOpacity onPress={() => openDatePicker()}>
					<View style={[styles.date, style]}>
						<View style={{flex: 1}}>
							{!!changedDate && (
								<Text style={[styles.dateText]}>
									{Moment(changedDate).format('YYYY-MM-DD')}
								</Text>
							)}
							{!changedDate && (
								<Text style={[styles.dateText, {color: '#8B8E9080'}]}>
									{placeHolder || 'Select Date'}
								</Text>
							)}
						</View>
						<ImageConfig.calendarIcon
							style={{marginRight: 15}}
							width={24}
							color={Colors.textLight}
						/>
					</View>
				</TouchableOpacity>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	date: {
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1.5,
		borderColor: Colors.borderColor,
		borderRadius: 5,
		width: '100%',
		justifyContent: 'center',
		// height: 50,
	},

	dateText: {
		fontFamily: FontConfig.primary.regular,
		paddingHorizontal: 10,
		color: Colors.textDark,
		fontSize: 15,
	},
});

export default DatePickerComponent;
