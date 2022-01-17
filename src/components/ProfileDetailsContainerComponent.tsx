import React, {useState, useCallback} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StyleProp,
	ViewStyle,
	ActivityIndicator,
} from 'react-native';
import {Colors, ENV, FontConfig, ImageConfig} from '../constants';
import moment from 'moment';
import {ApiFunctions, ToastAlert} from '../helpers';
import {useSelector} from 'react-redux';
import {StateParams} from '../store/reducers';

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
}

const ProfileDetailsContainerComponent = (
	props: ProfileDetailsContainerComponentProps,
) => {
	let end_date;
	const title = props.title;
	const location = props.location;
	const degree = props.degree;
	const startDate = props.startDate;
	const endDate = props.endDate;
	const id = props.id;
	const status = props.status;
	const getDate = props.getDate;
	const email = props.email;
	// getDate should be true if you want to display start date & end date

	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;
	const [display, setDisplay] = useState<'none' | 'flex' | undefined>('flex');
	const [titleName, setTitleName]: any = useState(title);
	const [isLoading, setIsloading] = useState<Boolean>(false);

	if (endDate != '') {
		end_date = moment(endDate).format('MMM, YYYY');
	} else {
		end_date = 'Current';
	}
	const start_date = moment(startDate).format('MMM, YYYY');

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
	return (
		<>
			<View style={[styles.screen]}>
				<View style={{display: display, flexDirection: 'row'}}>
					<View style={{width: '70%'}}>
						<Text style={styles.titleText}>{titleName}</Text>
						<View style={{flexDirection: 'row'}}>
							<Text style={styles.subText}>{location}</Text>

							{degree && <Text style={styles.subText}>{degree}</Text>}
							{getDate && (
								<Text style={styles.subText}>
									{start_date} - {end_date ? end_date : 'Current'}
								</Text>
							)}
						</View>
						{email != '' && (
							<Text style={[styles.subText]} numberOfLines={1}>
								{email}
							</Text>
						)}
					</View>

					<View style={styles.editButtons}>
						{isLoading ? (
							<ActivityIndicator size={'small'} color={Colors.primary} />
						) : (
							<TouchableOpacity
								onPress={() => {
									if (status === 'experience' || status === 'volunteer') {
										removeExperience();
									} else if (status === 'education') {
										removeEducation();
									} else if (status === 'reference') {
										removeReference();
									}
								}}>
								<ImageConfig.CloseIcon
									style={{
										borderRadius: 100,
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
		color: Colors.textDark,
		marginBottom: 5,
	},
	subText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 12,
		color: Colors.textOnTextLight,
		marginVertical: 3,
	},
});

export default ProfileDetailsContainerComponent;
