import {Alert} from 'react-native';

const confirm = (
	title: string,
	message = '',
	yesText = 'Confirm',
	noText = 'Cancel',
) => {
	return new Promise((resolve, reject) => {
		Alert.alert(title, message, [
			{
				text: yesText,
				style: 'destructive',
				onPress: resolve,
			},
			{
				text: noText,
				onPress: reject,
				style: 'cancel',
			},
		]);
	});
};
export {confirm};
