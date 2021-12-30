import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import {Colors} from '../../constants';

export interface BaseViewComponentProps {
	style?: StyleProp<ViewStyle>;
	backgroundColor?: string;
	isLoading?: boolean;
	loadingPercent?: number;
	noScroll?: boolean;
	normal?: boolean;
	contentContainerStyle?: StyleProp<ViewStyle>;
}

const BaseViewComponent = (
	props: PropsWithChildren<BaseViewComponentProps>,
) => {
	const style = props.style || {};
	const contentContainerStyle = props.contentContainerStyle || {};
	const backgroundColor = props.backgroundColor || Colors.backdropColor;
	const isLoading = props.isLoading || false;
	const loadingPercent = props.loadingPercent || 0;
	const noScroll = props.noScroll || false;
	const normal = props.normal || false;

	const [isPageLoading, setIsPageLoading] = useState(false);
	const [pageLoadingPercent, setPageLoadingPercent] = useState(0);

	useEffect(() => {
		setIsPageLoading(isLoading);
		setPageLoadingPercent(loadingPercent);
	}, [isLoading, loadingPercent]);

	const getLoadingBar = () => {
		return (
			<View style={[styles.progressBarHolder, {}]}>
				<View style={[styles.progressBar, {width: pageLoadingPercent + '%'}]} />
			</View>
		);
	};

	const getStatusBarAndLoader = () => {
		return (
			<>
				<StatusBar
					barStyle={'light-content'}
					backgroundColor={Colors.primary}
				/>
				{isPageLoading && getLoadingBar()}
			</>
		);
	};
	const getSafeArea = () => {
		return (
			<>
				<SafeAreaView style={[styles.screen, style, {backgroundColor}]}>
					{/*<View style={{width: '100%'}}>*/}
					{props.children}
					{/*</View>*/}
				</SafeAreaView>
			</>
		);
	};
	const getScrollView = (children: any) => {
		return (
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[contentContainerStyle]}
				style={[styles.scroll, {backgroundColor}]}
				keyboardShouldPersistTaps={'handled'}>
				{children}
			</ScrollView>
		);
	};

	return (
		<>
			{/*{!normal && ENV.mode !== 'production' && <EnableMockComponent />}*/}
			{getStatusBarAndLoader()}
			{noScroll && (normal ? props.children : getSafeArea())}
			{!noScroll &&
				(normal ? getScrollView(props.children) : getScrollView(getSafeArea()))}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingBottom: 20,
		// backgroundColor:
		// justifyContent: 'center',
		// alignItems: 'center'
	},
	scroll: {flex: 1},
	progressBarHolder: {
		backgroundColor: Colors.backgroundColor,
		// borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.borderColor,
		width: '100%',
		position: 'absolute',
		top: 0,
		height: 4,
		borderRadius: 8,
	},

	progressBar: {
		// color: '#0dd2b9',
		backgroundColor: Colors.textDark,
		width: '0%',
		height: 4,
		borderRadius: 8,
	},
	loader: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default BaseViewComponent;
