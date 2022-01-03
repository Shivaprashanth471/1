import React from 'react';
import {
	createStackNavigator,
	StackNavigationOptions,
} from '@react-navigation/stack';
import {Colors, FontConfig, NavigateTo} from '../constants';
import LoginScreen from '../screens/Auth/LoginScreen';
import ForgotPassword_Password_Screen from '../screens/Auth/ForgotPassword_Password_Screen';
import StartupScreen from '../screens/Startup/StartupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import {VitaTabNavigator} from './TabNavigator';
import ForgotPassword_Email_Screen from '../screens/Auth/ForgotPassword_Email_Screen';
const defaultNavigationOptions: StackNavigationOptions = {
	headerStyle: {
		backgroundColor: Colors.backdropColor, //CommonFunctions.isAndroid() ? Colors.primary : 'white',
		shadowColor: 'white',
		elevation: 0,
	},
	headerTitleStyle: {
		textTransform: 'capitalize',
		fontFamily: FontConfig.primary.regular,
		fontSize: 18,
	},
	headerTitleAlign: 'left',
	headerBackTitleVisible: false,
	headerBackTitleStyle: {
		fontFamily: FontConfig.secondary.regular,
		fontSize: 18,
	},
	headerBackAllowFontScaling: true,
	headerTintColor: Colors.textDark, //CommonFunctions.isAndroid() ? Colors.textOnPrimary : Colors.primary,
};

const AuthStack = createStackNavigator();
const AuthNavigator = () => {
	return (
		<AuthStack.Navigator
			key={'Auth-Nav'}
			initialRouteName={NavigateTo.Signin}
			headerMode="none"
			screenOptions={defaultNavigationOptions}>
			<AuthStack.Screen
				key={NavigateTo.Signin + '-Screen'}
				name={NavigateTo.Signin}
				options={{headerTitle: ''}}
				listeners={listeners}
				component={LoginScreen}
			/>
			<AuthStack.Screen
				key={NavigateTo.ForgotPassword_Password_Screen + '-Screen'}
				name={NavigateTo.ForgotPassword_Password_Screen}
				options={{headerTitle: ''}}
				listeners={listeners}
				component={ForgotPassword_Password_Screen}
			/>
			<AuthStack.Screen
				key={NavigateTo.ForgotPassword_Email_Screen + '-Screen'}
				name={NavigateTo.ForgotPassword_Email_Screen}
				options={{headerTitle: ''}}
				listeners={listeners}
				component={ForgotPassword_Email_Screen}
			/>
		</AuthStack.Navigator>
	);
};

const WelcomeStack = createStackNavigator();
const WelcomeNavigator = (props: any) => {
	return (
		<WelcomeStack.Navigator
			key={NavigateTo.Dashboard + '-Nav'}
			initialRouteName={NavigateTo.Dashboard}
			screenOptions={defaultNavigationOptions}>
			<WelcomeStack.Screen
				key={NavigateTo.Dashboard + '-Screen'}
				name={NavigateTo.Dashboard}
				options={{headerTitle: ''}}
				listeners={listeners}
				component={WelcomeScreen}
			/>
		</WelcomeStack.Navigator>
	);
};

// const iconSize = 24;
// const bottomTabDefaultStyle: any = { // StyleProp<ViewStyle> to update values assign type
//
// }
// const bottomTabBarOptions: BottomTabBarOptions = {
//     style: bottomTabDefaultStyle,
//     safeAreaInsets: {bottom: 3, top: 5},
//     activeTintColor: Colors.primary,
//     inactiveTintColor: Colors.tabsInactiveColor,
//     tabStyle: {
//         paddingTop: 7,
//         paddingBottom: 20,
//         justifyContent: "center",
//         alignItems: "center",
//         height: 65,
//         backgroundColor: Colors.backgroundColor
//     },
//     labelStyle: {
//         fontSize: 13,
//         fontFamily: FontConfig.primary.regular,
//         paddingTop: 5,
//     },
//     // keyboardHidesTabBar: true
// };
//
// const Tab = createBottomTabNavigator();
// const hideTabBarIn: string[] = [];
// const TabNavigator = () => {
//     return (
//             <Tab.Navigator
//                     // tabBar={CustomTabBarComponent}
//                     backBehavior={'history'}
//                     initialRouteName={NavigateTo.Dashboard}
//                     key={'Tab-Nav'}
//                     tabBarOptions={bottomTabBarOptions}>
//                 <Tab.Screen
//                         key={NavigateTo.Dashboard + '-Tab'}
//                         name={NavigateTo.Dashboard}
//                         component={DashboardNavigator}
//                         options={(props: any) => {
//                             // const badgeCount = getBadgeCount(props);
//                             return {
//                                 tabBarIcon: (props: any) => (
//                                         props.focused ?
//                                                 <DashBoardFill width={24} height={24} fill={props.color}/>:
//                                                 <DashBoardOutline width={24} height={24} fill={props.color}/>
//                                 ),
//                             };
//                         }}
//                 />
//             </Tab.Navigator>
//     );
// };
// const getTabBarVisibility = (route: any, hideIn: string[] = []) => {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? NavigateTo.Start;
//   const show = hideIn.indexOf(routeName)== -1;
//   if (show) {
//     bottomTabBarOptions.style = bottomTabDefaultStyle
//   } else {
//     bottomTabBarOptions.style = {};
//   }
//   return show;
// }

// const getBadgeCount = (props: any) => {
//     return props.route.params && props.route.params.badgeCount
//             ? props.route.params.badgeCount
//             :0;
// };

const MainStack = createStackNavigator();
const MainNavigator = () => {
	return (
		<MainStack.Navigator
			screenOptions={defaultNavigationOptions}
			key={'Main-App-Stack'}
			headerMode={'none'}
			initialRouteName={NavigateTo.Start}>
			<MainStack.Screen
				key={NavigateTo.Start + '-Screen'}
				name={NavigateTo.Start}
				listeners={listeners}
				component={StartupScreen}
			/>

			<MainStack.Screen
				key={NavigateTo.Dashboard + '-Screen'}
				name={NavigateTo.Dashboard}
				listeners={listeners}
				component={WelcomeNavigator}
			/>

			<MainStack.Screen
				key={NavigateTo.Auth + '-Nav-Stack'}
				name={NavigateTo.Auth}
				listeners={listeners}
				component={AuthNavigator}
			/>
			<MainStack.Screen
				key={NavigateTo.Main + '-Nav-Stack'}
				name={NavigateTo.Main}
				listeners={listeners}
				component={VitaTabNavigator}
			/>
			{/* <MainStack.Screen
				key={NavigateTo.FindShiftsMapScreen + '-Screen'}
				name={NavigateTo.FindShiftsMapScreen}
				options={{
					headerTitle: 'Find Shifts',
					headerStyle: {backgroundColor: '#F2F9FE'},
					headerBackTitleVisible: true,
				}}
				listeners={listeners}
				component={FindShiftsMapScreen}
			/> */}
		</MainStack.Navigator>
	);
};

const listeners = (props: any) => {
	return {
		transitionStart: (e: any) => {
			// console.log(e, 'transitionStart');
		},
		transitionEnd: (e: any) => {
			// console.log(e, 'transitionEnd');
		},
	};
};

export default MainNavigator;
