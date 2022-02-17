import {
	createStackNavigator,
	StackNavigationOptions,
} from '@react-navigation/stack';
import {Colors, FontConfig, ImageConfig, NavigateTo} from '../constants';
import React from 'react';
import {Platform} from 'react-native';
import {CommonFunctions} from '../helpers';
import {
	BottomTabBarOptions,
	createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import CircularSearchButtonComponent from '../components/CircularSearchButtonComponent';
import AttendanceScreen from '../screens/Attendance/AttendanceScreen';
import FindShiftsScreen from '../screens/FindShifts/FindShiftsScreen';
import MyShiftsScreen from '../screens/MyShifts/MyShiftsScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ShiftDetailsScreen from '../screens/FindShifts/ShiftDetailsScreen';
import FacilityShiftPreviewScreen from '../screens/FindShifts/FacilityShiftPreviewScreen';
import FacilityReviewScreen from '../screens/FindShifts/FacilityReviewScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ProfileEditScreen from '../screens/Profile/ProfileEditScreen';
import ProfileChangePasswordScreen from '../screens/Profile/ProfileChangePasswordScreen';
import MyProfileScreen from '../screens/Profile/MyProfileScreen';
import ProfileExperienceScreen from '../screens/Profile/ProfileExperienceScreen';
import ProfileEducationScreen from '../screens/Profile/ProfileEducationScreen';
import ProfileVolunteerScreen from '../screens/Profile/ProfileVolunteerScreen';
import ProfileReferenceScreen from '../screens/Profile/ProfileReferenceScreen';
import ProfileDocumentScreen from '../screens/Profile/ProfileDocumentScreen';
import UpcomingShiftCountdownScreen from '../screens/Attendance/UpcomingShiftCountdownScreen';
import AttendanceChartScreen from '../screens/Attendance/AttendanceChartScreen';
import FeedbackScreen from '../screens/Attendance/FeedbackScreen';
import ThankYouScreen from '../screens/Attendance/ThankYouScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const defaultNavigationOptions: StackNavigationOptions = {
	headerStyle: {
		backgroundColor: Colors.backgroundColor,
		// shadowColor: 'white',
		// elevation: 0, //CommonFunctions.isAndroid() ? Colors.primary : 'white',
	},
	headerTitleStyle: {
		textTransform: 'capitalize',
		fontFamily: FontConfig.primary.bold,
		color: Colors.navigationHeaderText,
		fontSize: 20,
	},
	headerTitleAlign: 'left',
	headerBackTitleVisible: false,
	headerBackTitleStyle: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 17,
		color: Colors.primary,
	},
	headerTintColor: Colors.primary, //CommonFunctions.isAndroid() ? Colors.textOnPrimary : Colors.primary,
};

const HomeStack = createStackNavigator();
const HomeNavigator = () => {
	return (
		<HomeStack.Navigator
			key={NavigateTo.Home + '-Nav'}
			initialRouteName={NavigateTo.Home}
			screenOptions={defaultNavigationOptions}>
			<HomeStack.Screen
				key={NavigateTo.Home + '-Screen'}
				name={NavigateTo.Home}
				options={{headerTitle: '', headerShown: false}}
				listeners={listeners}
				component={HomeScreen}
			/>
			<HomeStack.Screen
				key={NavigateTo.ShiftDetailsScreen + '-Screen'}
				name={NavigateTo.ShiftDetailsScreen}
				options={{headerTitle: '', headerShown: false}}
				listeners={listeners}
				component={ShiftDetailsScreen}
			/>
		</HomeStack.Navigator>
	);
};

const AttendanceStack = createStackNavigator();
const AttendanceNavigator = () => {
	return (
		<AttendanceStack.Navigator
			key={NavigateTo.UpcomingShiftCountdownScreen + '-Nav'}
			initialRouteName={NavigateTo.UpcomingShiftCountdownScreen}
			screenOptions={defaultNavigationOptions}>
			<AttendanceStack.Screen
				key={NavigateTo.AttendanceScreen + '-Screen'}
				name={NavigateTo.AttendanceScreen}
				options={{headerTitle: 'Attendance'}}
				listeners={listeners}
				component={AttendanceScreen}
			/>
			<AttendanceStack.Screen
				key={NavigateTo.ShiftDetailsScreen + '-Screen'}
				name={NavigateTo.ShiftDetailsScreen}
				options={{headerTitle: '', headerShown: false}}
				listeners={listeners}
				component={ShiftDetailsScreen}
			/>
			<AttendanceStack.Screen
				key={NavigateTo.UpcomingShiftCountdownScreen + '-Screen'}
				name={NavigateTo.UpcomingShiftCountdownScreen}
				options={{
					headerTitle: '',
					headerStyle: {backgroundColor: '#00243F'},
					headerShown: false,
				}}
				listeners={listeners}
				component={UpcomingShiftCountdownScreen}
			/>
			<AttendanceStack.Screen
				key={NavigateTo.AttendanceChartScreen + '-Screen'}
				name={NavigateTo.AttendanceChartScreen}
				options={{
					headerTitle: '',
					headerStyle: {backgroundColor: '#00243F'},
					headerShown: false,
				}}
				listeners={listeners}
				component={AttendanceChartScreen}
			/>
			<AttendanceStack.Screen
				key={NavigateTo.FeedbackScreen + '-Screen'}
				name={NavigateTo.FeedbackScreen}
				options={{headerTitle: 'Feedback'}}
				listeners={listeners}
				component={FeedbackScreen}
			/>
			<AttendanceStack.Screen
				key={NavigateTo.ThankYouScreen + '-Screen'}
				name={NavigateTo.ThankYouScreen}
				options={{
					headerTitle: '',
					headerStyle: {backgroundColor: '#00243F'},
					headerShown: false,
				}}
				listeners={listeners}
				component={ThankYouScreen}
			/>
		</AttendanceStack.Navigator>
	);
};

const FindShiftStack = createStackNavigator();
const FindShiftStackNavigator = () => {
	return (
		<FindShiftStack.Navigator
			key={NavigateTo.FindShifts + '-Nav'}
			initialRouteName={NavigateTo.FindShifts}
			screenOptions={defaultNavigationOptions}>
			<FindShiftStack.Screen
				key={NavigateTo.FindShifts + '-Screen'}
				name={NavigateTo.FindShifts}
				options={{
					headerTitle: 'Find Shifts',
					headerStyle: {backgroundColor: '#F2F9FE'},
				}}
				listeners={listeners}
				component={FindShiftsScreen}
			/>
			<FindShiftStack.Screen
				key={NavigateTo.ShiftDetailsScreen + '-Screen'}
				name={NavigateTo.ShiftDetailsScreen}
				options={{headerTitle: '', headerShown: false}}
				listeners={listeners}
				component={ShiftDetailsScreen}
			/>
			<FindShiftStack.Screen
				key={NavigateTo.FacilityShiftPreviewScreen + '-Screen'}
				name={NavigateTo.FacilityShiftPreviewScreen}
				options={{headerTitle: 'Available Shifts'}}
				listeners={listeners}
				component={FacilityShiftPreviewScreen}
			/>
			<FindShiftStack.Screen
				key={NavigateTo.FacilityReviewScreen + '-Screen'}
				name={NavigateTo.FacilityReviewScreen}
				options={{
					headerShown: false,
				}}
				listeners={listeners}
				component={FacilityReviewScreen}
			/>
		</FindShiftStack.Navigator>
	);
};

const MyShiftStack = createStackNavigator();
const MyShiftStackNavigator = () => {
	return (
		<MyShiftStack.Navigator
			key={NavigateTo.MyShifts + '-Nav'}
			initialRouteName={NavigateTo.MyShifts}
			screenOptions={defaultNavigationOptions}>
			<MyShiftStack.Screen
				key={NavigateTo.MyShifts + '-Screen'}
				name={'History'}
				options={{headerTitle: 'Shift History'}}
				listeners={listeners}
				component={MyShiftsScreen}
			/>
		</MyShiftStack.Navigator>
	);
};
const ProfileStack = createStackNavigator();
const ProfileStackNavigator = () => {
	return (
		<ProfileStack.Navigator
			key={NavigateTo.Profile + '-Nav'}
			initialRouteName={NavigateTo.Profile}
			screenOptions={{...defaultNavigationOptions}}>
			<ProfileStack.Screen
				key={NavigateTo.Profile + '-Screen'}
				name={NavigateTo.Profile}
				options={{headerTitle: 'Profile'}}
				listeners={listeners}
				component={ProfileScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.ProfileEditScreen + '-Screen'}
				name={NavigateTo.ProfileEditScreen}
				options={{headerTitle: 'Basic Details'}}
				listeners={listeners}
				component={ProfileEditScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.ProfileChangePasswordScreen + '-Screen'}
				name={NavigateTo.ProfileChangePasswordScreen}
				options={{headerTitle: 'Change Password'}}
				listeners={listeners}
				component={ProfileChangePasswordScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.MyProfileScreen + '-Screen'}
				name={NavigateTo.MyProfileScreen}
				options={{headerTitle: 'My Profile'}}
				listeners={listeners}
				component={MyProfileScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.ProfileExperienceScreen + '-Screen'}
				name={NavigateTo.ProfileExperienceScreen}
				options={{headerTitle: 'Work Experience'}}
				listeners={listeners}
				component={ProfileExperienceScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.ProfileEducationScreen + '-Screen'}
				name={NavigateTo.ProfileEducationScreen}
				options={{headerTitle: 'Education details'}}
				listeners={listeners}
				component={ProfileEducationScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.ProfileVolunteerScreen + '-Screen'}
				name={NavigateTo.ProfileVolunteerScreen}
				options={{headerTitle: 'Volunteer details'}}
				listeners={listeners}
				component={ProfileVolunteerScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.ProfileReferenceScreen + '-Screen'}
				name={NavigateTo.ProfileReferenceScreen}
				options={{headerTitle: 'Reference details'}}
				listeners={listeners}
				component={ProfileReferenceScreen}
			/>
			<ProfileStack.Screen
				key={NavigateTo.ProfileDocumentScreen + '-Screen'}
				name={NavigateTo.ProfileDocumentScreen}
				options={{headerTitle: 'My Documents'}}
				listeners={listeners}
				component={ProfileDocumentScreen}
			/>
		</ProfileStack.Navigator>
	);
};

const iconSize = 24;
const bottomTabDefaultStyle: any = {
	...CommonFunctions.getElevationStyle(8),
};
//   const bottomTabBarOptions: BottomTabBarOptions = {
const bottomTabBarOptions: BottomTabBarOptions = {
	style: bottomTabDefaultStyle,
	safeAreaInsets: {bottom: Platform.OS === 'android' ? 25 : 35, top: 15},
	activeTintColor: Colors.primary,
	inactiveTintColor: Colors.textDark,
	tabStyle: {
		paddingTop: Platform.OS === 'android' ? 5 : 15,
		paddingBottom: Platform.OS === 'android' ? 55 : 95,
		justifyContent: 'center',
		alignItems: 'center',
		height: Platform.OS === 'android' ? 105 : 155,
		backgroundColor: Colors.backgroundColor,
	},
	labelStyle: {
		fontSize: 13,
		fontFamily: FontConfig.primary.regular,
		paddingTop: Platform.OS === 'android' ? 5 : 10,
	},
	keyboardHidesTabBar: true,
};

const VitaTab = createBottomTabNavigator();
const hideTabBarIn: string[] = [NavigateTo.FindShifts];
const VitaTabNavigator = () => {
	return (
		<VitaTab.Navigator
			backBehavior={'history'}
			initialRouteName={NavigateTo.FindShifts}
			key={'Tab-Nav'}
			tabBarOptions={bottomTabBarOptions}>
			<VitaTab.Screen
				key={NavigateTo.Home + '-Tab'}
				name={NavigateTo.Home}
				// options={{headerTitle: 'sf'}}
				component={HomeNavigator}
				options={() => {
					// const badgeCount = getBadgeCount(props);
					return {
						tabBarIcon: (props: any) =>
							props.focused ? (
								<ImageConfig.HomeIconOn
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							) : (
								<ImageConfig.HomeIconOff
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							),
					};
				}}
			/>
			<VitaTab.Screen
				key={NavigateTo.Attendance + '-Tab'}
				name={NavigateTo.Attendance}
				component={AttendanceNavigator}
				options={() => {
					// const badgeCount = getBadgeCount(props);
					return {
						tabBarIcon: (props: any) =>
							props.focused ? (
								<ImageConfig.AttendanceIconOn
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							) : (
								<ImageConfig.AttendanceIconOff
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							),
					};
				}}
			/>
			<VitaTab.Screen
				key={NavigateTo.FindShifts + '-Tab'}
				name={NavigateTo.FindShifts}
				component={FindShiftStackNavigator}
				options={props => {
					return {
						title: '',
						tabBarIcon: props => {
							return (
								<CircularSearchButtonComponent
									iconColor={props.color}
									textColor={props.color}
									text={'Find Shifts'}
									backgroundColor={'white'}
									// style={{
									// 	paddingBottom: Platform.OS === 'android' ? 0 : 15,
									// }}
								/>
							);
						},
					};
				}}
			/>

			<VitaTab.Screen
				key={NavigateTo.MyShifts + '-Tab'}
				name={'History'}
				component={MyShiftStackNavigator}
				options={() => {
					// const badgeCount = getBadgeCount(props);
					return {
						tabBarIcon: (props: any) =>
							props.focused ? (
								<ImageConfig.MyShiftIconOn
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							) : (
								<ImageConfig.MyShiftIconOff
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							),
					};
				}}
			/>
			<VitaTab.Screen
				key={NavigateTo.Profile + '-Tab'}
				name={NavigateTo.Profile}
				component={ProfileStackNavigator}
				options={() => {
					// const badgeCount = getBadgeCount(props);
					return {
						tabBarIcon: (props: any) =>
							props.focused ? (
								<ImageConfig.ProfileIconOn
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							) : (
								<ImageConfig.ProfileIconOff
									width={iconSize}
									height={iconSize}
									color={props.color}
								/>
							),
					};
				}}
			/>
		</VitaTab.Navigator>
	);
};
const getTabBarVisibility = (route: any, hideIn: string[] = []) => {
	const routeName = getFocusedRouteNameFromRoute(route) ?? NavigateTo.Start;
	const show = hideIn.indexOf(routeName) === -1;
	console.log({routeName, show});
	if (show) {
		bottomTabBarOptions.style = bottomTabDefaultStyle;
	} else {
		bottomTabBarOptions.style = {position: 'absolute', bottom: 10};
	}
	return show;
};
export {VitaTabNavigator};
const listeners = () => {
	return {
		transitionStart: () => {
			// console.log(e, 'transitionStart');
		},
		transitionEnd: () => {
			// console.log(e, 'transitionEnd');
		},
	};
};
