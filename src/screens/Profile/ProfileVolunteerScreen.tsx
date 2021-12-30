import React, {useState, useCallback, useEffect} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
	Alert,
} from 'react-native';
import {CommonStyles} from '../../helpers';
import {Colors, ENV, FontConfig} from '../../constants';
import {
	BaseViewComponent,
	EditableTextInput,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import {ApiFunctions, CommonFunctions} from '../../helpers';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';

const ProfileVolunteerScreen = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile]: any = useState();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);

	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;

	const addVolunteer = () => {
		setInState([
			...inState,
			<EditableTextInput
				title="Title"
				subTitle="Subtext"
				description="description"
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
						<ErrorComponent text={'Volunteer not added '} />
					)}
					{sortedVolunteerData.length > 0 && (
						<BaseViewComponent style={{}}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<View style={styles.screen}>
								{profile.map(
									(item: any, index: any) => (
										console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', item.end_date),
										(
											<View key={item.facility_id + '_' + index}>
												<EditableTextInput
													title={item.facility_name}
													location={item.location + '  |  '}
													endDate={item.end_date}
													startDate={item.start_date}
													description={item.position_title}
													getDate={true}
												/>
											</View>
										)
									),
								)}
								{inState}
								<TouchableOpacity
									// onPress={addVolunteer}
									style={{marginTop: 50}}>
									<Text
										style={{
											color: Colors.textOnPrimary,
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
