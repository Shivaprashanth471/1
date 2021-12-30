import React, {useEffect, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import ToggleSwitchComponent from './ToggleSwitchComponent';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import {updateMockEnabled} from '../../store/actions/auth.action';

export interface EnableMockComponentProps {
	style?: StyleProp<ViewStyle>;
}

const EnableMockComponent = (props: EnableMockComponentProps) => {
	// const style = props.style || {};
	const dispatch = useDispatch();
	const {isMock} = useSelector((state: StateParams) => state.auth);
	const [isMocking, setMocking] = useState(!!isMock);
	useEffect(() => {
		setMocking(!!isMock);
	}, [isMock]);

	return (
		<>
			<View style={styles.wrapper}>
				<ToggleSwitchComponent
					size={'small'}
					isOn={isMocking}
					onToggle={(isOn) => {
						setMocking(isOn);
						dispatch(updateMockEnabled(isOn));
					}}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		bottom: 10,
		right: 10,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10000,
	},
});

export default EnableMockComponent;
