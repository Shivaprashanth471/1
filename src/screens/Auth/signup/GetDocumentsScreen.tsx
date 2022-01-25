import React, {useState} from 'react';
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	TouchableOpacity,
} from 'react-native';
import {Colors, FontConfig, ImageConfig, NavigateTo} from '../../../constants';
import {
	BaseViewComponent,
	KeyboardAvoidCommonView,
	CustomButton,
} from '../../../components/core';

import UploadSignupDocument from '../../../components/UploadSignupDocument';
import {SignupDocumentsArray} from '../../../constants/CommonVariables';

const GetDocumentsScreen = (props: any) => {
	const {GetHcpBasicDetailsPayload}: any = props.route.params;
	const navigation = props.navigation;
	const [loadingPercent, setLoadingPercent]: any = useState(57.14);

	return (
		<>
			<KeyboardAvoidCommonView>
				<BaseViewComponent>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View
						style={{
							flex: 1,
							marginTop: 20,
							marginHorizontal: 20,
						}}>
						<View style={[styles.header]}>
							<TouchableOpacity
								onPress={() => {
									navigation.goBack();
								}}>
								<ImageConfig.backArrow
									width="20"
									height="20"
									style={{marginBottom: 10}}
								/>
							</TouchableOpacity>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									width: '100%',
								}}>
								<Text
									style={{
										fontFamily: FontConfig.primary.semiBold,
										color: Colors.textDark,
										fontSize: 16,
									}}>
									Profile
								</Text>
								<TouchableOpacity
									onPress={() => {
										navigation.navigate(NavigateTo.GetVaccineForCovidScreen, {
											GetHcpBasicDetailsPayload: GetHcpBasicDetailsPayload,
										});
									}}>
									<Text
										style={{
											color: Colors.approved,
											fontFamily: FontConfig.primary.bold,
											fontSize: 14,
											padding: 5,
										}}>
										Skip{' >'}
									</Text>
								</TouchableOpacity>
							</View>
							<View
								style={{
									width: loadingPercent + '%',
									backgroundColor: Colors.approved,
									height: 4,
									borderRadius: 8,
									marginBottom: 20,
								}}
							/>
							<View style={{}}>
								<Text style={styles.headerText}>Add Documents</Text>
							</View>
							<View style={styles.subHeadingHolder}>
								<Text style={styles.subHeading}>
									Please add the required documents
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							marginHorizontal: 20,
						}}>
						{SignupDocumentsArray.map((item: any) => (
							<>
								<UploadSignupDocument
									title={item}
									HcpUser={GetHcpBasicDetailsPayload}
								/>
							</>
						))}
					</View>
				</BaseViewComponent>
				<View
					style={{
						height: 80,
						justifyContent: 'center',
						alignItems: 'center',
						marginHorizontal: 20,
					}}>
					<CustomButton
						title={'Continue'}
						onPress={() => {
							navigation.navigate(NavigateTo.GetVaccineForCovidScreen, {
								GetHcpBasicDetailsPayload: GetHcpBasicDetailsPayload,
							});
						}}
						style={{
							backgroundColor: Colors.primary,
							width: '100%',
						}}
					/>
				</View>
			</KeyboardAvoidCommonView>
		</>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginTop: 10,
		marginHorizontal: 20,
	},
	header: {
		flex: 0,
		marginBottom: 20,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
		// width: '100%',
	},
	headerText: {
		textAlign: 'left',
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
	},
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'left',
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
});

export default GetDocumentsScreen;
