import React, {useState, useCallback} from 'react';
import {Text, View, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import {Colors, FontConfig, ImageConfig} from '../constants';

export interface DistanceCheckComponent {
	distanceText?: string | '';
	selectedValue?: any;
	onUpdate?: (value: any) => void;
}

const DistanceCheckComponent = (props: DistanceCheckComponent) => {
	const distanceText = props.distanceText;
	var selectedValue = props.selectedValue;
	const {onUpdate} = props;
	const [selected, setSelected] = useState<boolean>(false);
	// console.log(selectedValue);

	const getselectedValue = () => {
		setSelected(!selected);
		if (!selected) {
			selectedValue.push(distanceText);
			if (onUpdate) {
				onUpdate(selectedValue);
			}
		} else {
			const index = selectedValue.indexOf(distanceText);
			if (index > -1) {
				selectedValue.splice(index, 1);
				if (onUpdate) {
					onUpdate(selectedValue);
				}
			}
		}
	};

	return (
		<>
			<TouchableOpacity
				onPress={() => {
					getselectedValue();
				}}
				style={[
					{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						height: 40,
						marginVertical: 15,
						paddingHorizontal: 20,
						borderWidth: 2,
						borderColor: Colors.borderColor,
						borderRadius: 5,
					},
				]}>
				<Text
					style={{
						fontFamily: FontConfig.primary.bold,
						fontSize: 14,
						color: Colors.textDark,
						textTransform: 'capitalize',
					}}>
					{distanceText} miles
				</Text>
				{selected && (
					<ImageConfig.IconCheckGradient
						color={Colors.backgroundColor}
						height={'22'}
						width={'22'}
					/>
				)}
			</TouchableOpacity>
		</>
	);
};

export default DistanceCheckComponent;
