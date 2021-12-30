import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, FontConfig, ImageConfig} from '../constants';
import LinearGradient from 'react-native-linear-gradient';
export interface MyShiftsStatusContainerComponentProps {
	title?: string;
	count?: number;
	selected?: boolean;
}

const MyShiftsStatusContainerComponent = (
	props: MyShiftsStatusContainerComponentProps,
) => {
	const title = props.title;
	const count = props.count;
	const selected = props.selected;
	const color =
		title === 'Pending Shifts'
			? Colors.gradientShiftStatus[1]
			: title === 'Upcoming Shifts'
			? Colors.gradientShiftStatus[3]
			: title === 'Completed Shifts'
			? Colors.gradientShiftStatus[0]
			: Colors.gradientShiftStatus[2];
	return (
		<LinearGradient
			start={{x: 0.0, y: 0.25}}
			end={{x: 0.5, y: 1.0}}
			colors={color}
			style={[
				styles.screen,
				{
					height: 100,
					marginHorizontal: 10,
					borderRadius: 10,
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'row',
					marginTop: 10,
					opacity: selected ? 1 : 0.5,
				},
			]}>
			<View style={{flexDirection: 'row'}}>
				{title === 'Completed Shifts' ? (
					<ImageConfig.IconCheckCircle
						width={20}
						height={20}
						style={{marginRight: 10}}
					/>
				) : title === 'Pending Shifts' ? (
					<ImageConfig.IconAlert
						width={20}
						height={20}
						style={{marginRight: 10}}
					/>
				) : title === 'Closed Shifts' ? (
					<ImageConfig.IconDoubleCheck
						width={20}
						height={20}
						style={{marginRight: 10}}
					/>
				) : (
					<ImageConfig.IconReloadCircle
						width={21}
						height={21}
						style={{marginRight: 10}}
					/>
				)}
				<View>
					<Text
						style={{
							fontFamily: FontConfig.primary.bold,
							fontSize: 12,
							color: Colors.textOnPrimary,
						}}>
						{title}
					</Text>
					<Text
						style={{
							fontFamily: FontConfig.primary.bold,
							fontSize: 20,
							color: Colors.textOnPrimary,
						}}>
						{count}
					</Text>
				</View>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
});

export default MyShiftsStatusContainerComponent;
