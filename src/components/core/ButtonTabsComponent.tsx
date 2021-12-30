import React, {useCallback, useEffect, useState} from 'react';
import {
	FlexStyle,
	ScrollView,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import {Colors, FontConfig} from '../../constants';
import {SvgProps} from 'react-native-svg';

export interface TabButtonType {
	title: string;
	id: string;
	disabled?: boolean;
	badge?: number;
	icon?: React.FC<SvgProps>;
}

export interface ButtonTabsComponentProps {
	style?: FlexStyle;
	buttons: TabButtonType[];
	selected?: string;
	onChange?: (selected: string) => void;
	canScroll?: boolean;
	height?: number;
}

const ButtonTabsComponent = (props: ButtonTabsComponentProps) => {
	const {buttons, selected, onChange, style, canScroll} = props;
	const height = props.height || 45;
	const [tab, setTab] = useState(selected);
	const switchTab = useCallback(
		(select: string) => {
			setTab(select);
			if (onChange) {
				onChange(select);
			}
		},
		[onChange],
	);
	const scrollAvailable =
		canScroll === undefined ? buttons.length > 3 : canScroll;
	useEffect(() => {
		switchTab(selected || '');
	}, [selected, switchTab]);
	const getButtons = () => {
		return (
			<View style={[styles.buttonsHolder, style]}>
				{buttons &&
					buttons.map((button, index) => {
						return (
							<TouchableWithoutFeedback
								key={'ButtonTabsComponent-Button-' + button.id + index}
								onPress={() => {
									if (!button.disabled) {
										switchTab(button.id);
									}
								}}
								disabled={button.disabled}>
								<View
									style={[
										styles.tab,
										{height},
										scrollAvailable ? {minWidth: 100} : {},
										tab === button.id ? styles.activeTab : styles.inActiveTab,
										button.disabled ? styles.disabled : {},
										index !== 0 ? {borderLeftWidth: 0} : {},
									]}>
									{/*<Icon width={iconSize} color={color} height={iconSize} />*/}
									<Text
										numberOfLines={1}
										style={[
											styles.tabText,
											tab === button.id
												? styles.activeTabText
												: styles.inActiveTabText,
										]}>
										{button.title}
									</Text>
									{!!button.badge && (
										<View
											style={[
												styles.badgeHolder,
												{
													backgroundColor:
														tab === button.id
															? Colors.primary
															: Colors.textLight,
												},
											]}>
											<Text style={styles.badgeText}>{button.badge || 0}</Text>
										</View>
									)}
								</View>
							</TouchableWithoutFeedback>
						);
					})}
			</View>
		);
	};
	return (
		<>
			{scrollAvailable && (
				<ScrollView horizontal={true}>{getButtons()}</ScrollView>
			)}
			{!scrollAvailable && getButtons()}
		</>
	);
};

const styles = StyleSheet.create({
	buttonsHolder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	disabled: {
		opacity: 0.7,
	},
	tab: {
		height: 45,
		flex: 1,
		position: 'relative',
		paddingBottom: 4,
		paddingTop: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 2,
		borderLeftColor: Colors.textLight,
		borderRadius: 1,
	},
	activeTab: {
		borderBottomColor: Colors.primary,
	},
	inActiveTab: {
		borderBottomWidth: 0,
		paddingBottom: 6,
		borderBottomColor: Colors.borderColor,
	},
	tabText: {
		// textTransform: 'uppercase',
		fontFamily: FontConfig.primary.bold,
		fontSize: 15,
	},
	activeTabText: {
		color: Colors.primary,
	},
	inActiveTabText: {
		color: Colors.textLight,
	},
	badgeHolder: {
		width: 14,
		height: 14,
		marginLeft: 5,
		backgroundColor: Colors.textLight,
		borderRadius: 7,
		justifyContent: 'center',
		alignItems: 'center',
	},
	badgeText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 8,
		color: Colors.textOnTextDark,
	},
});

export default ButtonTabsComponent;
