import React from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import {Colors, FontConfig, ImageConfig} from '../../constants';
import {BaseViewComponent} from '../../components/core';

import ReviewBoxComponent from '../../components/ReviewBoxComponent';

const FacilityReviewScreen = (props: any) => {
	const {facilityReviewDetails} = props.route.params;
	const {facilityDetails} = props.route.params;
	const navigation = props.navigation;

	return (
		<BaseViewComponent
			style={styles.screen}
			backgroundColor={Colors.backgroundShiftColor}>
			<StatusBar
				barStyle={'light-content'}
				animated={true}
				backgroundColor={Colors.backgroundShiftColor}
			/>
			<View
				style={{
					paddingTop: 10,
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: Colors.backgroundShiftColor,
				}}>
				<TouchableOpacity
					style={{
						marginHorizontal: 20,
					}}
					onPress={() => {
						navigation.goBack();
					}}>
					<ImageConfig.backArrow width="20" height="20" />
				</TouchableOpacity>
				<Text
					style={{
						textTransform: 'capitalize',
						fontFamily: FontConfig.primary.bold,
						color: Colors.navigationHeaderText,
						fontSize: 20,
					}}>
					{facilityDetails.facility_name}
				</Text>
			</View>
			<View
				style={{
					flex: 1,
					marginHorizontal: 10,
					marginTop: 20,
				}}>
				{facilityReviewDetails.map((item: any, index: any) => (
					<View key={item.id + '-' + index}>
						<ReviewBoxComponent
							reviewText={item.experience ? item.experience : ''}
							rating={item.facility_rating ? item.facility_rating + ' ☆' : ''}
						/>
					</View>
				))}
			</View>
		</BaseViewComponent>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
});

export default FacilityReviewScreen;
