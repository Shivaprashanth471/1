import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {CommonFunctions} from '../../helpers';
//@ts-ignore
import Slider from '@react-native-community/slider';
import {Colors, FontConfig, ImageConfig} from '../../constants';

export interface SliderComponentProps {
	minValue: number;
	maxValue: number;
	step?: number;
	value?: number;
	headerStyle?: StyleProp<ViewStyle>;
	wrapperStyle?: StyleProp<ViewStyle>;
	valueExtractor?: (num: number) => string;
	onChange?: (val: number) => void;
}

const SliderComponent = (props: SliderComponentProps) => {
	const {onChange, value, minValue, maxValue, headerStyle, wrapperStyle} =
		props;
	// console.log(minValue, maxValue, value);
	const step = props.step === undefined ? 0 : props.step;
	const [sliderValue, setSliderValue] = useState<number>(0);
	const onSlidingComplete = useCallback(
		(val: number) => {
			const tmpValue = Math.floor(val);
			// console.log(tmpValue);
			setSliderValue(tmpValue);
			if (onChange) {
				onChange(tmpValue);
			}
		},
		[onChange],
	);
	const defaultValueExtractor = useCallback((val: number): string => {
		return val + ' mile';
	}, []);
	const valueExtractor = props.valueExtractor || defaultValueExtractor;
	useEffect(() => {
		setSliderValue(value || 0);
	}, [value]);
	return (
		<View style={[styles.wrapper, wrapperStyle]}>
			<View style={styles.sliderWrapper}>
				<View style={[styles.infoWrapper, headerStyle]}>
					<Text style={styles.infoBoldText}>
						Distance: 0 - {sliderValue}mile
					</Text>
				</View>

				<Slider
					style={{height: 40}}
					minimumValue={minValue}
					maximumValue={maxValue}
					step={step}
					value={sliderValue}
					onSlidingComplete={onSlidingComplete}
					thumbTintColor={Colors.primary}
					minimumTrackTintColor={Colors.primary}
					maximumTrackTintColor={Colors.textLight}
					// thumbImage={require('../../assets/images/IconSlider.png')}
				/>
				<View style={styles.valuesWrapper}>
					<Text style={styles.infoText}>{valueExtractor(minValue)}</Text>
					{/* <Text style={[styles.infoBoldText, {color: Colors.textDark}]}>
						To
					</Text> */}
					<Text style={styles.infoText}>{valueExtractor(maxValue)}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 0,
		padding: 0,
		borderRadius: 10,
		overflow: 'hidden',
	},
	infoWrapper: {
		flex: 1,
		// paddingHorizontal: 10,
		paddingVertical: 5,
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	infoBoldText: {
		fontSize: 18,
		color: Colors.textOnInput,
		fontFamily: FontConfig.primary.bold,
	},
	infoText: {
		fontSize: 14,
		color: Colors.textOnInput,
		fontFamily: FontConfig.primary.regular,
	},
	sliderWrapper: {flex: 0},
	valuesWrapper: {
		flex: 0,
		// paddingHorizontal: 13,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	valueItem: {flex: 0, alignItems: 'center'},
	valueItemText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 16,
		color: Colors.textDark,
	},
});

export default SliderComponent;
