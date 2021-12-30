/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/santhoshbanda/react-native-typescript-template.git
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {Provider} from 'react-redux';
import store from './store';
import {NetworkChangeSubject} from './helpers/Communications';
import {Colors} from './constants';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import ErrorComponent from './components/core/ErrorComponent';
import {CommonFunctions} from './helpers';
import OneSignalComponent from './components/core/OneSignalComponent';

NetInfo.addEventListener(info => {
	NetworkChangeSubject.next(info.isConnected);
});

const CustomTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: Colors.primary,
		background: Colors.backgroundColor,
		border: Colors.borderColor,
	},
};

const App = () => {
	const [isConnected, setIsConnected] = useState(true);
	const NetworkChangeSubscription = NetworkChangeSubject.subscribe(
		connected => {
			setIsConnected(connected);
		},
	);
	useEffect(() => {
		return () => {
			NetworkChangeSubscription.unsubscribe();
		};
	}, [NetworkChangeSubscription]);

	return (
		<>
			<OneSignalComponent />
			<StatusBar
				barStyle="dark-content"
				backgroundColor={Colors.backgroundColor}
			/>
			{isConnected && (
				<NavigationContainer theme={CustomTheme}>
					<Provider store={store}>
						<MainNavigator />
					</Provider>
				</NavigationContainer>
			)}
			{!isConnected && (
				<ErrorComponent
					text={"We can't reach our servers\nCheck your internet connection"}
				/>
			)}
		</>
	);
};

export default App;
