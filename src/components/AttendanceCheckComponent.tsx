import React, {useState} from 'react';
import {
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../helpers';
import {Colors, ENV, FontConfig, ImageConfig, NavigateTo} from '../constants';
import * as yup from 'yup';

export interface AttendanceCheckComponentProps {
	newPassword: string;
	confirmPassword: string;
}

// end login api

const AttendanceCheckComponent = (props: any) => {
	const [eyeIcon, setEyeIcon] = useState(false);
	const [isPassword, setIsPassword] = useState(true);
	const dispatch = useDispatch();
	const navigation = props.navigation;

	const getForgotPassword = () => {
		navigation.replace(NavigateTo.Main);
	};
	return (
		<View>
			<View style={[styles.timeCheckContainer]}>
				<View
					style={{
						backgroundColor: Colors.gradientEnd,
						// backgroundColor: 'red',
						width: 5,
						height: '100%',
						borderTopLeftRadius: 5,
						borderBottomLeftRadius: 5,
						marginRight: 15,
					}}></View>
				<View style={{flexDirection: 'row'}}>
					<ImageConfig.IconCheckIn width="20" height="20" />
					<Text
						style={{
							fontFamily: FontConfig.primary.bold,
							fontSize: 14,
							marginLeft: 15,
						}}>
						Check-In
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 20,
	},
	timeCheckContainer: {
		// backgroundColor: Colors.backgroundShiftBoxColor,
		backgroundColor: '#E6F2FC',
		// paddingVertical: 20,
		width: 200,
		height: 40,
		// justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 5,
	},
});

export default AttendanceCheckComponent;
