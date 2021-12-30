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
import {ApiFunctions} from '../../helpers';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';

const ProfileReferenceScreen = (props: any) => {
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
	const getReferenceDetails = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + HcpUser._id + '/reference/')
			.then(async resp => {
				// console.log('resp>>>', resp);
				if (resp) {
					setProfile(resp.data);
					// Intercom.updateUser(resp.data);
					// console.log('resp profile reference screen>>>>>>>>>>>', profile);
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
						<ErrorComponent text={'Reference not added '} />
					)}
					{profile.length > 0 && (
						<BaseViewComponent>
							<StatusBar
								barStyle={'light-content'}
								animated={true}
								backgroundColor={Colors.backdropColor}
							/>
							<View style={styles.screen}>
								{profile.map(
									(item: any) => (
										console.log('item', item),
										(
											<>
												<EditableTextInput
													title={item.reference_name}
													// subTitle={item.job_title + '  |  ' + item.phone}
													location={item.job_title + '  |  ' + item.phone}
													// degree={item.degree}
													// startDate={item.start_date}
													// endDate={item.graduation_date}
													description={item.email}
													getDate={false}
												/>
											</>
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
