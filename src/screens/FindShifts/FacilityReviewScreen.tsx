import React, {useCallback, useEffect, useState} from 'react';
import {
	Alert,
	FlatList,
	ImageBackground,
	StatusBar,
	StyleSheet,
	Text,
	View,
	Modal,
} from 'react-native';
import {Colors, ENV, FontConfig, ImageConfig} from '../../constants';
import {
	ApiFunctions,
	CommonFunctions,
	CommonStyles,
	ToastAlert,
} from '../../helpers';
import {
	ErrorComponent,
	LoadingComponent,
	CustomButton,
	BaseViewComponent,
} from '../../components/core';

import ReviewBoxComponent from '../../components/ReviewBoxComponent';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import {
	PaginationResponseType,
	PaginationType,
	TSAPIResponseType,
} from '../../helpers/ApiFunctions';
import moment from 'moment';

const FacilityReviewScreen = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const navigation = props.navigation;

	// const getFacilityDetails = useCallback(() => {
	// 	setIsLoading(true);
	// 	ApiFunctions.get(ENV.apiUrl + 'facility/' + facilityID)
	// 		.then(resp => {
	// 			if (resp && resp.success) {
	// 				setFacility(resp.data);
	// 			} else {
	// 				Alert.alert('Error', resp.error);
	// 			}
	// 			setIsLoading(false);
	// 			setIsLoaded(true);
	// 		})
	// 		.catch((err: any) => {
	// 			setIsLoading(false);
	// 			setIsLoaded(true);
	// 			Alert.alert('Error', err.error || 'Oops... Something went wrong!');
	// 		});
	// }, [facilityID]);

	// useEffect(() => {
	// 	const focusListener = navigation.addListener('focus', getFacilityDetails);
	// 	return () => {
	// 		focusListener();
	// 	};
	// }, [getFacilityDetails, navigation]);

	// useEffect(() => {
	// 	console.log('loading facility.....');
	// 	getFacilityDetails();
	// }, [getFacilityDetails]);

	return (
		<>
			{/* {isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !facility && (
				<ErrorComponent text={'Facility details not available'} />
			)}
			{!isLoading && isLoaded && facility && ( */}
			<>
				<BaseViewComponent style={styles.screen}>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View
						style={{
							flex: 1,
							marginHorizontal: 10,
						}}>
						<ReviewBoxComponent />
						<ReviewBoxComponent />
					</View>
				</BaseViewComponent>
			</>
			{/* )} */}
		</>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
});

export default FacilityReviewScreen;
