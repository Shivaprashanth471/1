import React, {useCallback, useState} from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import Moment from 'moment';
import {Colors, FontConfig, ImageConfig} from '../../constants';
import LabelComponent from './LabelComponent';
import RNMonthPicker from 'react-native-month-year-picker';

export interface DatePickerComponentProps {
	date?: string;
	minDate?: string;
	maxDate?: string;
	onChange?: (date: string) => void;
	labelText?: string;
	placeHolder?: string;
	style?: StyleProp<ViewStyle>;
}

const MonthYearPickerComponent = (props: DatePickerComponentProps) => {
	const {labelText, style, onChange, placeHolder} = props;
	const [datepickerShow, setDatepickerShow] = useState<boolean>(false);
	const [text, setText] = useState<any>(placeHolder);
	const [placeholderStyle, setPlaceHolderStyle] = useState<boolean>(true);
	const [changedDate, setChangedDate] = useState<any>(new Date());

	const showPicker = useCallback(value => setDatepickerShow(value), []);

	const onValueChange = useCallback(
		(event, newDate) => {
			const selectedDate = newDate || changedDate;

			showPicker(false);
			setChangedDate(selectedDate);
			const curDate = Moment(selectedDate).format('MM-YYYY');
			const curDateSendApi = Moment(selectedDate).format('YYYY-MM');
			if (onChange) {
				onChange(curDateSendApi);
				setText(curDate);
				console.log(curDate);
				setPlaceHolderStyle(false);
			}
		},
		[changedDate, onChange, showPicker],
	);

	return (
		<>
			<View style={{width: '100%'}}>
				{!!labelText && <LabelComponent title={labelText} />}
				<TouchableOpacity activeOpacity={1} onPress={() => showPicker(true)}>
					<View style={[styles.date, style]}>
						<View style={{flex: 1}}>
							{!!changedDate && (
								<Text
									style={[
										styles.dateText,
										{
											color: placeholderStyle ? '#8B8E9080' : Colors.textDark,
										},
									]}>
									{text}
								</Text>
							)}
						</View>
						{datepickerShow && (
							<RNMonthPicker
								onChange={onValueChange}
								value={changedDate}
								minimumDate={new Date(1900, 5)}
								maximumDate={new Date(2300, 5)}
								locale="En"
							/>
						)}
						<ImageConfig.IconDatePicker
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
	},

	dateText: {
		fontFamily: FontConfig.primary.regular,
		paddingHorizontal: 10,
		fontSize: 15,
	},
});

export default MonthYearPickerComponent;
