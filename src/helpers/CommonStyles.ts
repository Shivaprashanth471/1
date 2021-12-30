import {StyleSheet} from 'react-native';
import FontConfig from '../constants/FontConfig';
import Colors from '../constants/Colors';

const CommonStyles = StyleSheet.create({
	pageTitle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textDark,
	},
	pageTitleWrapper: {marginVertical: 10},
	bodyText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 16,
	},
	flex: {
		flex: 1,
	},
	flexZero: {
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},

	flexCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexLeftCenter: {flex: 1, alignItems: 'flex-start', justifyContent: 'center'},
	paddingBottom: {
		paddingBottom: 5,
	},
	// paddingVertical: {
	//     paddingVertical: 10,
	// },
	horizontalLine: {
		height: 2,
		backgroundColor: Colors.ShiftBoxHorizontalLine,
	},
});
export default CommonStyles;
