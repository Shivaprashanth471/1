import Toast from 'react-native-simple-toast';

const TOAST_SHORT = Toast.SHORT;
const TOAST_LONG = Toast.LONG;
const TOAST_TOP = Toast.TOP;
const TOAST_CENTER = Toast.CENTER;

const TOAST_BOTTOM = Toast.BOTTOM;
const show = (
	title: string,
	duration: any = TOAST_SHORT,
	position: any = TOAST_BOTTOM,
	gravity = false,
) => {
	if (gravity) {
		// if(__DEV__){
		Toast.showWithGravity(title, duration, position, ['UIAlertController']);
		// }
	} else {
		// if(__DEV__){
		Toast.show(title, duration);
		// }
	}
};

export {show, TOAST_BOTTOM, TOAST_LONG, TOAST_TOP, TOAST_CENTER, TOAST_SHORT};
