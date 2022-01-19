import React, {useState, useCallback} from 'react';
import {
	FlexStyle,
	StyleSheet,
	Text,
	View,
	StyleProp,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';
import {CommonStyles} from '../helpers';
import {Colors, FontConfig, ImageConfig, ENV, NavigateTo} from '../constants';
import moment from 'moment';
import {ApiFunctions, ToastAlert} from '../helpers';
import {CustomButton} from './core';
import {useSelector} from 'react-redux';
import {StateParams} from '../store/reducers';
import analytics from '@segment/analytics-react-native';

export interface ShiftDetailsComponentProps {
	facilityName?: string | '';
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
	facility?: any;
	item?: any;
	facilityAddress?: string;
	id?: any;
	requirementID?: any;
	warningType?: string;
	shiftType?: string;
	navigation?: any;
	removeApplyViewSection?: boolean;
	showModal?: () => void;
}

const TotalShiftComponent = (props: ShiftDetailsComponentProps) => {
	const [disableBtn, setDisableBtn] = useState<boolean>(false);
	const [disableBtnLoading, setDisableBtnLoading] = useState<boolean>(false);
	const [disableApplyBtnOnNextScreen, setDisableApplyBtnOnNextScreen] =
		useState<boolean>(false);

	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const {showModal} = props;

	const {facility} = props;
	const item = props.item;
	const shiftStartTime = props.shiftStartTime;
	const shiftEndTime = props.shiftEndTime;
	const dateOfShift = props.dateOfShift;
	const HCPLevel = props.HCPLevel;
	const style = props.style;
	const id = props.id;
	const requirementID = props.requirementID;
	const warningType = props.warningType;
	const shiftType = props.shiftType;
	const removeApplyViewSection = props.removeApplyViewSection || false;
	const navigation = props.navigation;

	const shiftDate = new Date(dateOfShift);
	const StartTime = new Date(shiftStartTime);
	const EndTime = new Date(shiftEndTime);
	var startTimeInLocal = StartTime.toLocaleTimeString();
	var endTimeInLocal = EndTime.toLocaleTimeString();

	var mydate = new Date(shiftDate);
	var date = moment(mydate).utcOffset(0, false).format('DD MMM, YY');

	var shiftStartTimeExtract = moment(startTimeInLocal, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');
	var shiftEndTimeExtract = moment(endTimeInLocal, ['h:mm:ss A'])
		.utcOffset(0, false)
		.format('hh:mm A');

	// -----------------Shift time difference calculation---------------------------

	let startShiftTime = moment(StartTime, ['YYYY-MM-DD h:mm:ss A']);

	let endShiftTime = moment(EndTime, ['YYYY-MM-DD h:mm:ss A']);

	var TotalSeconds = endShiftTime.diff(startShiftTime, 'seconds');

	var hours = Math.floor(TotalSeconds / 3600);
	var minutes = Math.floor((TotalSeconds / 60) % 60);

	const shiftDiffHours = hours < 0 ? hours * -1 : hours;
	const shiftDiffMinute = minutes < 0 ? minutes * -1 : minutes;

	const onApply = useCallback(() => {
		setDisableBtnLoading(true);
		if (user) {
			const payload = {hcp_user_id: user._id, applied_by: user._id};
			ApiFunctions.post(
				ENV.apiUrl + 'shift/requirement/' + requirementID + '/application',
				payload,
			)
				.then(async resp => {
					if (resp.msg) {
						if (showModal) {
							showModal();
						}
						setDisableBtn(true);
						setDisableApplyBtnOnNextScreen(true);
						analytics.track('Applied For A Shift');
					} else {
						ToastAlert.show(resp.error || 'failed to update');
					}
					setDisableBtnLoading(false);
				})
				.catch((err: any) => {
					ToastAlert.show(err.error || 'Error encountered');
					setDisableBtnLoading(false);
				});
		}
	}, [requirementID, user._id]);

	const onNext = () => {
		navigation.navigate(NavigateTo.ShiftDetailsScreen, {
			facilityID: id,
			dateOfShift: item.shift_date,
			shiftStartTime: item.shift_timings.start_time,
			shiftEndTime: item.shift_timings.end_time,
			HCPLevel: item.hcp_type,
			requirementID: item._id,
			warningType: item.warning_type,
			shiftType: item.shift_type,
			shiftDetails: item.shift_details,
			phoneNumber: item.facility.phone_number,
			disable: disableApplyBtnOnNextScreen,
		});
	};

	return (
		<>
			{facility && (
				<>
					<View
						style={[
							styles.container,
							style,
							{borderWidth: 1.5, borderColor: Colors.backgroundShiftBoxColor},
						]}>
						<View>
							<Text style={[styles.shiftDateText, CommonStyles.paddingBottom]}>
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
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
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
											marginRight: 30,
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
												marginRight: 0,
												width: 30,
												alignItems: 'center',
											}}>
											<Text
												style={{
													fontFamily: FontConfig.primary.regular,
													fontSize: 11,
													color: Colors.textOnTextLight,
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
										}}>
										<ImageConfig.warningType width="22" height="22" />
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
												}}>
												{warningType} {'zone'}
											</Text>
										</View>
									</View>
								</View>
							</View>
						</View>

						{removeApplyViewSection ? (
							<></>
						) : (
							<>
								<View
									style={[CommonStyles.horizontalLine, {marginVertical: 8}]}
								/>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
									<TouchableOpacity onPress={onNext}>
										<Text
											style={{
												color: Colors.textOnAccent,
												fontSize: 14,
											}}>
											View Details
										</Text>
									</TouchableOpacity>
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											width: '35%',
											marginTop: 5,
										}}>
										<CustomButton
											autoWidth={true}
											style={{
												flex: 0,
												borderRadius: 8,
												marginVertical: 0,
												height: 30,
												backgroundColor: Colors.backgroundShiftColor,
												width: '100%',
												zIndex: 10,
											}}
											title={'Apply'}
											class={'secondary'}
											textStyle={{
												color: Colors.primary,
												textTransform: 'uppercase',
												fontFamily: FontConfig.primary.bold,
												fontSize: 16,
											}}
											onPress={onApply}
											disabled={disableBtn}
											isLoading={disableBtnLoading}
										/>
									</View>
								</View>
							</>
						)}
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
		marginHorizontal: 10,
		marginVertical: 5,
		marginBottom: 10,
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
		marginHorizontal: 7,
	},
	horizontalRule: {
		width: 10,
		height: 1,
		backgroundColor: Colors.textLight,
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

export default TotalShiftComponent;
