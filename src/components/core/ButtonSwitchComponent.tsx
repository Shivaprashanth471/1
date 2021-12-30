import React, {useEffect, useState} from 'react';
import {
	FlexStyle,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import {Colors, FontConfig} from '../../constants';

export interface SwitchButtonType {
	title: string;
	id: string;
	subtitle?: string;
}

export interface ButtonSwitchComponentProps {
	style?: FlexStyle;
	buttons: SwitchButtonType[];
	selected: string;
	onChange?: (selected: string) => void;
	type?: 'outline' | 'filled';
	height?: number;
}

const ButtonSwitchComponent = (props: ButtonSwitchComponentProps) => {
	const {buttons, selected, onChange, style} = props;
	const height = props.height || 50;
	const [tab, setTab] = useState(selected);
	const type = props.type || 'outline';

	const switchTab = (select: string) => {
		setTab(select);
	};
	useEffect(() => {
		if (onChange && tab) {
			onChange(tab);
		}
	}, [onChange, tab]);
	useEffect(() => {
		setTab(selected);
	}, [selected]);

	const getText = (button: SwitchButtonType) => {
		return (
			<>
				<Text
					style={[
						styles.tabText,
						tab === button.id ? styles.activeTabText : styles.inActiveTabText,
						type === 'filled' && tab === button.id
							? {color: Colors.textOnPrimary}
							: {},
					]}>
					{button.title}
				</Text>
				{!!button.subtitle && (
					<Text
						style={[
							styles.tabSubText,
							tab === button.id ? styles.activeTabText : styles.inActiveTabText,
							type === 'filled' && tab === button.id
								? {color: Colors.textOnPrimary}
								: {},
						]}>
						{button.subtitle}
					</Text>
				)}
			</>
		);
	};
	const getButtonContent = (button: any) => {
		return (
			<View style={{flex: 1}}>
				{tab !== button.id && (
					<View style={[styles.tab, {height}, styles.inActiveTab]}>
						{getText(button)}
					</View>
				)}

				{tab === button.id && (
					<View style={{flex: 1}}>
						{type === 'filled' && (
							<View style={[styles.tab, styles.activeTab]}>
								{getText(button)}
							</View>
						)}
						{type === 'outline' && (
							<View style={[styles.tab, {height}, styles.activeTab]}>
								{getText(button)}
							</View>
						)}
					</View>
				)}
			</View>
		);
	};
	return (
		<View style={[styles.buttonsHolder, style]}>
			{buttons &&
				buttons.map((button, index) => {
					return (
						<TouchableWithoutFeedback
							key={'ButtonSwitchComponent-Button-' + button.id + index}
							onPress={() => {
								switchTab(button.id);
							}}>
							{getButtonContent(button)}
						</TouchableWithoutFeedback>
					);
				})}
		</View>
	);
};

const styles = StyleSheet.create({
	buttonsHolder: {
		flex: 1,
		justifyContent: 'center',
		padding: 2,
		alignItems: 'center',
		flexDirection: 'row',
		// marginVertical: 20,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.textLight,
		borderRadius: 4,
	},
	tab: {
		height: 45,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
	},
	activeTab: {
		borderWidth: 1,
		borderColor: Colors.primary,
	},
	inActiveTab: {
		borderColor: Colors.textOnPrimary,
	},

	tabText: {
		textTransform: 'uppercase',
		fontFamily: FontConfig.primary.regular,
		fontSize: 17,
	},
	tabSubText: {
		textTransform: 'uppercase',
		fontFamily: FontConfig.primary.regular,
		fontSize: 12,
	},
	activeTabText: {
		color: Colors.primary,
	},
	inActiveTabText: {
		color: Colors.textDark,
	},
});

export default ButtonSwitchComponent;
