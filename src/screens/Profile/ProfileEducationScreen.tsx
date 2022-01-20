import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
	Alert,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {ApiFunctions, CommonFunctions} from '../../helpers';
import {Colors, ENV, FontConfig} from '../../constants';
import {
	BaseViewComponent,
	ErrorComponent,
	LoadingComponent,
} from '../../components/core';
import ProfileDetailsContainerComponent from '../../components/ProfileDetailsContainerComponent';
import {StateParams} from '../../store/reducers';
import ProfileAddEducationComponent from '../../components/ProfileAddEducationComponent';

const ProfileEducationScreen = (props: any) => {
	const [inState, setInState] = useState([<View />]);
	const [profile, setProfile] = useState<any[] | null>();
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [showInState, setShowInState] = useState<boolean>(false);
	const [displayAddText, setDisplayAddText] = useState<
		'none' | 'flex' | undefined
	>('flex');

	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;

	const addEducation = () => {
		setShowInState(true);
		setDisplayAddText('none');
		setInState([
			...inState,
			<ProfileAddEducationComponent
				setDisplayAddText={setDisplayAddText}
				onUpdate={() => {
					setShowInState(false);
					setInState(inState => []);
					getEducationDetails();
				}}
			/>,
		]);
	};

	const getEducationDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + HcpUser._id + '/education')
			.then(async resp => {
				if (resp && resp.success) {
					setDisplayAddText('flex');
					setProfile(resp.data || null);
					// Intercom.updateUser(resp.data);
				} else {
					setProfile(null);
					Alert.alert('Error', resp.error);
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
		getEducationDetails();
	}, [getEducationDetails]);

	const sortedEducationData =
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
								<ErrorComponent text={'Education not added '} />
								{showInState && <>{inState}</>}

								<TouchableOpacity
									onPress={addEducation}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
										}}>
										+ Add education
									</Text>
								</TouchableOpacity>
							</BaseViewComponent>
						</>
					)}
					{sortedEducationData.length > 0 && (
						<BaseViewComponent style={{}}>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<View style={styles.screen}>
								{profile.map((item: any, index: any) => (
									<View key={item._id + '_' + index}>
										<ProfileDetailsContainerComponent
											id={item._id}
											title={item.institute_name}
											location={item.location + '  |  '}
											degree={item.degree + '  |  '}
											startDate={item.start_date}
											endDate={item.graduation_date}
											getDate={true}
											status={'education'}
										/>
									</View>
								))}
								{showInState && <>{inState}</>}
								<TouchableOpacity
									onPress={addEducation}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
											paddingVertical: 5,
										}}>
										+ Add more education
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

export default ProfileEducationScreen;
