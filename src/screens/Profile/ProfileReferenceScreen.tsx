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
import {ApiFunctions} from '../../helpers';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import ProfileAddReferenceComponent from '../../components/ProfileAddReferenceComponent';

const ProfileReferenceScreen = (props: any) => {
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

	const addReference = () => {
		setShowInState(true);
		setDisplayAddText('none');
		setInState([
			...inState,
			<ProfileAddReferenceComponent
				setDisplayAddText={setDisplayAddText}
				onUpdate={() => {
					setShowInState(false);
					setInState(inState => []);
					getReferenceDetails();
				}}
			/>,
		]);
	};
	const getReferenceDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + HcpUser._id + '/reference/')
			.then(async resp => {
				if (resp) {
					setDisplayAddText('flex');
					setProfile(resp.data);
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
			});
	}, [HcpUser._id]);
	useEffect(() => {
		console.log('loading get profile');
		getReferenceDetails();
	}, [getReferenceDetails]);
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
								<ErrorComponent text={'Reference not added '} />
								{showInState && <>{inState}</>}

								<TouchableOpacity
									onPress={addReference}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
										}}>
										+ Add reference
									</Text>
								</TouchableOpacity>
							</BaseViewComponent>
						</>
					)}
					{profile.length > 0 && (
						<BaseViewComponent>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<View style={styles.screen}>
								{profile.map((item: any) => (
									<>
										<ProfileDetailsContainerComponent
											id={item._id}
											status="reference"
											title={item.reference_name}
											location={item.job_title + '  |  ' + item.phone}
											email={item.email}
											getDate={false}
										/>
									</>
								))}
								{showInState && <>{inState}</>}
								<TouchableOpacity
									onPress={addReference}
									style={{marginTop: 50, display: displayAddText}}>
									<Text
										style={{
											color: Colors.textOnAccent,
											fontFamily: FontConfig.primary.semiBold,
											fontSize: 14,
										}}>
										+ Add more references
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

export default ProfileReferenceScreen;
