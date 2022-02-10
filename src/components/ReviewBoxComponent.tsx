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
import {Colors, ENV, FontConfig, ImageConfig} from '../constants';
import {
	ApiFunctions,
	CommonFunctions,
	CommonStyles,
	ToastAlert,
} from '../helpers';
import {
	ErrorComponent,
	LoadingComponent,
	CustomButton,
	BaseViewComponent,
} from '../components/core';

import moment from 'moment';

const ReviewBoxComponent = (props: any) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const navigation = props.navigation;

	return (
		<>
			{/* {isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && !facility && (
				<ErrorComponent text={'Facility details not available'} />
			)}
			{!isLoading && isLoaded && facility && ( */}
			<>
				<View style={styles.screen}>
					<Text>hi</Text>
				</View>
			</>
			{/* )} */}
		</>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		marginBottom: 20,
		backgroundColor: 'red',
	},
});

export default ReviewBoxComponent;
