import React, {useState, useCallback, useEffect} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
	Alert,
} from 'react-native';
import {Colors, ENV, FontConfig} from '../../constants';
import {
	BaseViewComponent,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import ProfileDetailsContainerComponent from '../../components/ProfileDetailsContainerComponent';
import ProfileAddVolunteerComponent from '../../components/ProfileAddVolunteerComponent';
import {ApiFunctions, CommonFunctions} from '../../helpers';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';

const ProfileVolunteerScreen = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile]: any = useState();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [showInState, setShowInState] = useState<boolean>(false);
	const [displayAddText, setDisplayAddText] = useState<
		'none' | 'flex' | undefined
	>('flex');

	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;

	const addVolunteer = () => {
		setShowInState(true);
		setDisplayAddText('none');
		setInState([
			...inState,
			<ProfileAddVolunteerComponent
				setDisplayAddText={setDisplayAddText}
				onUpdate={() => {
					setShowInState(false);
					setInState(inState => []);
					getVolunteerExperienceDetails();
				}}
			/>,
		]);
	};
	const getVolunteerExperienceDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(
			ENV.apiUrl + 'hcp/' + HcpUser._id + '/experience?exp_type=volunteer',
		)
			.then(async resp => {
				if (resp) {
					setDisplayAddText('flex');
					setProfile(resp.data);
					// Intercom.updateUser(resp.data);
				} else {
					Alert.alert('Error', resp);
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				setIsLoading(false);
				setIsLoaded(true);
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, [HcpUser._id]);
	useEffect(() => {
		console.log('loading get profile');
		getVolunteerExperienceDetails();
	}, [getVolunteerExperienceDetails]);

	const sortedVolunteerData =
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
								<ErrorComponent text={'Volunteer experience not added '} />
								{showInState && <>{inState}</>}

								<TouchableOpacity
									onPress={addVolunteer}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
										}}>
										+ Add volunteer experience
									</Text>
								</TouchableOpacity>
							</BaseViewComponent>
						</>
					)}
					{sortedVolunteerData.length > 0 && (
						<BaseViewComponent style={{}}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<View style={styles.screen}>
								{profile.map((item: any, index: any) => (
									<View key={item.facility_id + '_' + index}>
										<ProfileDetailsContainerComponent
											id={item._id}
											title={item.facility_name}
											location={item.location + '  |  '}
											endDate={item.end_date}
											startDate={item.start_date}
											getDate={true}
											status="volunteer"
											email={item.email ? item.email : ''}
										/>
									</View>
								))}
								{showInState && <>{inState}</>}
								<TouchableOpacity
									onPress={addVolunteer}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
										}}>
										+ Add more volunteer
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
		padding: 10,
		flex: 1,
	},
});

export default ProfileVolunteerScreen;
