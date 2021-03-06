import React, {useState, useCallback} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StyleProp,
	ViewStyle,
	ActivityIndicator,
	Modal,
} from 'react-native';
import {Colors, ENV, FontConfig, ImageConfig} from '../constants';
import moment from 'moment';
import {ApiFunctions, ToastAlert} from '../helpers';
import {useSelector} from 'react-redux';
import {StateParams} from '../store/reducers';
import {CustomButton} from './core';

export interface ProfileDetailsContainerComponentProps {
	style?: StyleProp<ViewStyle>;
	title?: string;
	location?: string;
	degree?: string;
	email?: string;
	startDate?: string;
	endDate?: any;
	getDate?: boolean;
	id: any;
	status: string;
	phoneNum?: any;
}

const ProfileDetailsContainerComponent = (
	props: ProfileDetailsContainerComponentProps,
) => {
	const title = props.title;
	const location = props.location;
	const degree = props.degree;
	const startDate = props.startDate;
	const endDate = props.endDate;
	const id = props.id;
	const status = props.status;
	const getDate = props.getDate;
	const email = props.email;
	const phoneNum = props.phoneNum;
	// getDate should be true if you want to display start date & end date

	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;
	const [display, setDisplay] = useState<'none' | 'flex' | undefined>('flex');
	const [titleName, setTitleName]: any = useState(title);
	const [isLoading, setIsloading] = useState<Boolean>(false);
	const [selectDeleteModalVisible, setDeleteModalVisible] =
		useState<boolean>(false);

	let start_date =
		startDate === '' || startDate === null
			? 'NA'
			: moment(startDate).format('MMM, YYYY');
	let end_date =
		endDate === '' || endDate === null
			? 'NA'
			: moment(endDate).format('MMM, YYYY');

	const removeExperience = useCallback(() => {
		setIsloading(true);
		ApiFunctions.delete(ENV.apiUrl + 'hcp/' + HcpUser._id + '/experience/' + id)
			.then(async resp => {
				if (resp && resp.success) {
					setDisplay('none');
					setIsloading(false);
					ToastAlert.show('Experience removed');
				} else {
					console.log('error');
				}
			})
			.catch((err: any) => {
				setIsloading(false);
				console.log(err);
				ToastAlert.show('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [HcpUser._id, id]);

	const removeEducation = useCallback(() => {
		setIsloading(true);
		ApiFunctions.delete(ENV.apiUrl + 'hcp/' + HcpUser._id + '/education/' + id)
			.then(async resp => {
				if (resp && resp.success) {
					setDisplay('none');
					setIsloading(false);
					ToastAlert.show('Education removed');
				} else {
					console.log('error');
				}
			})
			.catch((err: any) => {
				setIsloading(false);
				console.log(err);
				ToastAlert.show('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [HcpUser._id, id]);
	const removeReference = useCallback(() => {
		setIsloading(true);
		ApiFunctions.delete(ENV.apiUrl + 'hcp/' + HcpUser._id + '/reference/' + id)
			.then(async resp => {
				if (resp && resp.success) {
					setDisplay('none');
					setIsloading(false);
					ToastAlert.show('Reference removed');
				} else {
					console.log('error');
				}
			})
			.catch((err: any) => {
				setIsloading(false);
				console.log(err);
				ToastAlert.show('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [HcpUser._id, id]);

	const selectDeleteModal = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={selectDeleteModalVisible}
					onRequestClose={() => {
						setDeleteModalVisible(!selectDeleteModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View
							style={[
								styles.modalView,
								{
									height: '30%',
								},
							]}>
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 22,
									color: Colors.primary,
								}}>
								Delete!
							</Text>
							<Text style={styles.modalTextSub}>
								Do you want to delete {status} information
							</Text>
							<View
								style={{
									flexDirection: 'row',
									marginHorizontal: 10,
									marginTop: 30,
								}}>
								<View
									style={{
										width: '45%',
										marginRight: '10%',
									}}>
									<CustomButton
										onPress={() =>
											setDeleteModalVisible(!selectDeleteModalVisible)
										}
										style={{
											flex: 0,
											borderRadius: 8,
											marginVertical: 0,
											height: 45,
											backgroundColor: Colors.backgroundShiftColor,
										}}
										title={'Cancel'}
										class={'secondary'}
										textStyle={{color: Colors.primary}}
									/>
								</View>
								<View
									style={{
										width: '45%',
									}}>
									<CustomButton
										style={{
											flex: 0,
											borderRadius: 8,
											marginVertical: 0,
											height: 45,
										}}
										title={'Delete'}
										onPress={() => {
											if (status === 'experience' || status === 'volunteer') {
												removeExperience();
											} else if (status === 'education') {
												removeEducation();
											} else if (status === 'reference') {
												removeReference();
											}
											setDeleteModalVisible(!selectDeleteModalVisible);
										}}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};
	return (
		<>
			<View style={[styles.screen]}>
				<View
					style={{
						display: display,
						flexDirection: 'row',
						alignItems: 'center',
						// backgroundColor: 'red',
						justifyContent: 'center',
					}}>
					<View style={{width: '70%'}}>
						<Text numberOfLines={2} style={[styles.titleText, {}]}>
							{titleName}
						</Text>
						<View
							style={{
								flexDirection: 'row',
								alignContent: 'center',
								alignItems: 'center',
							}}>
							<Text
								style={[
									styles.subText,
									{maxWidth: phoneNum != '' ? '40%' : '25%'},
								]}
								numberOfLines={5}>
								{location}
							</Text>
							<Text style={styles.subText}>{'  |  '}</Text>
							{phoneNum && (
								<>
									<Text
										style={[styles.subText, {maxWidth: '50%'}]}
										numberOfLines={2}>
										{phoneNum}
									</Text>
								</>
							)}
							{degree && (
								<>
									<Text
										style={[styles.subText, {maxWidth: '25%'}]}
										numberOfLines={2}>
										{degree}
									</Text>
									<Text style={styles.subText}>{'  |  '}</Text>
								</>
							)}
							{getDate && (
								<>
									<Text
										style={[
											// styles.subText,
											{
												fontFamily: FontConfig.primary.regular,
												fontSize: 14,
												color: Colors.textOnTextLight,
											},
										]}>
										{start_date} - {end_date}
									</Text>
								</>
							)}
						</View>
						{email != '' && (
							<Text style={[styles.subText]} numberOfLines={2}>
								{email}
							</Text>
						)}
					</View>
					{selectDeleteModal()}
					<View style={styles.editButtons}>
						{isLoading ? (
							<ActivityIndicator size={'small'} color={Colors.primary} />
						) : (
							<TouchableOpacity
								onPress={() => {
									setDeleteModalVisible(!selectDeleteModalVisible);
								}}>
								<ImageConfig.CloseIcon
									style={{
										borderRadius: 100,
										marginRight: 20,
									}}
									height={'20'}
									width={'20'}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
			<View
				style={{
					display: display,
					borderBottomWidth: 1.5,
					borderBottomColor: Colors.backgroundShiftBoxColor,
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		marginVertical: 5,
	},
	editButtons: {
		flexDirection: 'row',
		width: '30%',
		justifyContent: 'flex-end',
		height: '100%',
	},
	titleText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
		textTransform: 'capitalize',
		color: Colors.textDark,
		marginBottom: 5,
	},
	subText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 14,
		textTransform: 'capitalize',
		color: Colors.textOnTextLight,
	},

	// modal
	ModalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
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
		height: '40%',
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
		marginVertical: 14,
		fontSize: 14,
	},
});

export default ProfileDetailsContainerComponent;
