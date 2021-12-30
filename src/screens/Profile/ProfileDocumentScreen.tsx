import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {Colors, FontConfig} from '../../constants';
import {
	BaseViewComponent,
	KeyboardAvoidCommonView,
} from '../../components/core';

import AddDocumentComponent from '../../components/AddDocumentComponent';
import {ProfileDocumentsArray} from '../../constants/CommonVariables';

const ProfileDocumentScreen = () => {
	return (
		<>
			<KeyboardAvoidCommonView>
				<BaseViewComponent>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View style={styles.container}>
						{ProfileDocumentsArray.map((item: any) => (
							<>
								<AddDocumentComponent title={item} />
							</>
						))}
					</View>
				</BaseViewComponent>
			</KeyboardAvoidCommonView>
		</>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 0,
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginTop: 10,
		marginHorizontal: 20,
	},
	header: {
		flex: 0,
		marginBottom: 20,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
		width: '70%',
	},
	headerText: {
		textAlign: 'left',
		fontSize: 24,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
	},
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'left',
		fontSize: 14,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
});

export default ProfileDocumentScreen;
