import React, {useCallback, useEffect, useState} from 'react';
import {
	Alert,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
} from 'react-native';
import {ApiFunctions, CommonFunctions} from '../../helpers';
import {Colors, ENV, FontConfig} from '../../constants';
import {
	BaseViewComponent,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import Moment from 'moment';
import ProfileDetailsContainerComponent from '../../components/ProfileDetailsContainerComponent';
import ProfileAddExperienceComponent from '../../components/ProfileAddExperienceComponent';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
// import MonthPicker from 'react-native-month-year-picker';

const ProfileExperienceScreen = (props: any) => {
	const [profile, setProfile] = useState<any | null>(null);
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);

	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;
	const [inState, setInState] = useState([<View />]);
	const [showInState, setShowInState] = useState<boolean>(false);
	const [displayAddText, setDisplayAddText] = useState<
		'none' | 'flex' | undefined
	>('flex');

	const addExperience = () => {
		setShowInState(true);
		setDisplayAddText('none');
		setInState([
			...inState,
			<ProfileAddExperienceComponent
				setDisplayAddText={setDisplayAddText}
				onUpdate={() => {
					setShowInState(false);
					setInState(inState => []);
					getExperienceDetails();
				}}
			/>,
		]);
	};

	const getExperienceDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(
			ENV.apiUrl + 'hcp/' + HcpUser._id + '/experience?exp_type=fulltime',
		)
			.then(async resp => {
				if (resp && resp.success) {
					setDisplayAddText('flex');
					setProfile(resp.data || null);
				} else {
					Alert.alert('Error', resp.error);
					setProfile(null);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				setProfile(null);
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [HcpUser._id]);
	useEffect(() => {
		console.log('loading get profile');
		getExperienceDetails();
	}, [getExperienceDetails]);

	// const [date, setDate] = useState(new Date());
	// const [show, setShow] = useState(false);

	// const showPicker = useCallback(value => setShow(value), []);

	// const onValueChange = useCallback(
	// 	(event, newDate) => {
	// 		const selectedDate = newDate || date;

	// 		showPicker(false);
	// 		setDate(selectedDate);
	// 		console.log(Moment(selectedDate).format('YYYY-MM'));
	// 	},
	// 	[date, showPicker],
	// );

	const sortedExperienceData =
		(profile && CommonFunctions.sortDatesByLatest(profile, 'start_date')) || [];
	return (
		<>
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !profile && <ErrorComponent />}
			{!isLoading && isLoaded && profile && (
				<>
					{profile.length === 0 && (
						<>
							<BaseViewComponent style={{marginHorizontal: 10}}>
								<StatusBar
									barStyle={'light-content'}
									animated={true}
									backgroundColor={Colors.backdropColor}
								/>
								<ErrorComponent text={'Experience not added '} />
								{showInState && <>{inState}</>}

								<TouchableOpacity
									onPress={addExperience}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
										}}>
										+ Add experience
									</Text>
								</TouchableOpacity>
							</BaseViewComponent>
						</>
					)}
					{profile.length > 0 && (
						<BaseViewComponent style={{}}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							{/* <View>
								<Text>Month Year Picker Example</Text>
								<TouchableOpacity onPress={() => showPicker(true)}>
									<Text>OPEN</Text>
								</TouchableOpacity>
								{show && (
									<MonthPicker
										onChange={onValueChange}
										value={date}
										minimumDate={new Date()}
										maximumDate={new Date(2025, 5)}
										locale="En"
									/>
								)}
							</View> */}
							<View style={styles.screen}>
								{sortedExperienceData.map((item: any, index: any) => (
									<View key={item.id + '-' + index}>
										<ProfileDetailsContainerComponent
											id={item._id}
											title={item.facility_name}
											location={item.location + '  |  '}
											startDate={item.start_date}
											endDate={item.end_date}
											description={item.position_title}
											getDate={true}
											status={'experience'}
										/>
									</View>
								))}
								{showInState && <>{inState}</>}

								<TouchableOpacity
									onPress={addExperience}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
										}}>
										+ Add more experience
									</Text>
								</TouchableOpacity>
							</View>
						</BaseViewComponent>
					)}
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		marginHorizontal: 10,
		marginVertical: 10,
		flex: 1,
	},
});

export default ProfileExperienceScreen;
