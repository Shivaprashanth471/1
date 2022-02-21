import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, StatusBar, Modal, Alert} from 'react-native';
import {ApiFunctions, ToastAlert} from '../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import {
	BaseViewComponent,
	CustomButton,
	KeyboardAvoidCommonView,
} from '../../components/core';

const ThankYouScreen = (props: any) => {
	const navigation = props.navigation;
	return (
		<>
			<StatusBar
				barStyle={'light-content'}
				animated={true}
				backgroundColor={Colors.backdropColor}
			/>
			<View
				style={{
					backgroundColor: Colors.backgroundShiftColor,
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<ImageConfig.ThumpsUp height={'120'} width={'120'} />
				<Text
					style={{
						fontFamily: FontConfig.primary.bold,
						fontSize: 24,
						color: Colors.primary,
						marginVertical: 20,
					}}>
					Thanks for your feedback
				</Text>
				<Text
					style={{
						fontFamily: FontConfig.primary.semiBold,
						fontSize: 16,
						color: Colors.textLight,
					}}>
					Keep rocking!
				</Text>
				<Text
					style={{
						fontFamily: FontConfig.primary.semiBold,
						fontSize: 16,
						color: Colors.textLight,
					}}>
					apply for your next shift
				</Text>
				<CustomButton
					title={'Go!'}
					onPress={() => {
						navigation.popToTop(NavigateTo.AttendanceScreen);
					}}
					style={{
						width: '50%',
						height: 50,
						marginVertical: 50,
					}}
					textStyle={{
						textTransform: 'capitalize',
					}}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({});

export default ThankYouScreen;
