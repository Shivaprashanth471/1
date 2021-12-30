import React, {useCallback, useEffect, useState} from 'react';
import {
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	StatusBar,
} from 'react-native';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../../constants';
import {
	ApiFunctions,
	CommonFunctions,
	CommonStyles,
	ToastAlert,
} from '../../../helpers';
import {
	BaseViewComponent,
	CustomButton,
	KeyboardAvoidCommonView,
} from '../../../components/core';
// import Logo from '../../assets/images/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {StateParams} from '../../../store/reducers';
// import {KeyboardAvoidCommonView} from '../../components';
// import analytics from '@segment/analytics-react-native';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {checkLogin, logoutUser} from '../../../store/actions/auth.action';
import {logoutSubject} from '../../../helpers/Communications';
import SmsRetriever from 'react-native-sms-retriever';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import {TSAPIResponseType} from '../../../helpers/ApiFunctions';
import FormikInputComponent from '../../../components/core/FormikInputComponent';

const MyProfileCreationGetDocuments = (props: any) => {
	const dispatch = useDispatch();
	const {auth} = useSelector((state: StateParams) => state);
	const {user} = auth;
	const navigation = props.navigation;
	const [isLoading, setIsLoading]: any = useState(false);
	const [isResendLoading, setIsResendLoading]: any = useState(false);

	const gotoNext = () => {
		navigation.navigate(NavigateTo.MyProfileCreationGetExperience);
	};

	return (
		<>
			<KeyboardAvoidCommonView>
				<BaseViewComponent>
					<StatusBar
						barStyle={'light-content'}
						animated={true}
						backgroundColor={Colors.backdropColor}
					/>
					<View
						style={{
							// flexDirection: 'row',
							flex: 0,
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							marginTop: 10,
							marginHorizontal: 20,
							// backgroundColor: 'green',
						}}>
						<View style={styles.header}>
							<View style={{}}>
								<Text style={styles.headerText}>Add Documents</Text>
							</View>
							<View style={styles.subHeadingHolder}>
								<Text style={styles.subHeading}>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit,
								</Text>
							</View>
						</View>
						<View style={styles.documentWrapper}>
							<View>
								<ImageConfig.DocumentPlaceholder height="50" />
							</View>
							<View
								style={{
									height: '100%',
									alignItems: 'flex-start',
									justifyContent: 'space-evenly',
									marginLeft: 20,
								}}>
								<Text
									style={{fontFamily: FontConfig.primary.bold, fontSize: 18}}>
									Physical Test
								</Text>

								<CustomButton
									// onPress={() => setModalVisible(!modalVisible)}
									// onPress={onCall}
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 30,
										width: 70,
									}}
									title={'Add'}
									class={'primary'}
									textStyle={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 16,
										textTransform: 'none',
									}}
								/>
							</View>
						</View>
						<View style={styles.documentWrapper}>
							<View>
								<ImageConfig.DocumentPlaceholder height="50" />
							</View>
							<View
								style={{
									height: '100%',
									alignItems: 'flex-start',
									justifyContent: 'space-evenly',
									marginLeft: 20,
								}}>
								<Text
									style={{fontFamily: FontConfig.primary.bold, fontSize: 18}}>
									TB Test
								</Text>

								<CustomButton
									// onPress={() => setModalVisible(!modalVisible)}
									// onPress={onCall}
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 30,
										width: 70,
									}}
									title={'Add'}
									class={'primary'}
									textStyle={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 16,
										textTransform: 'none',
									}}
								/>
							</View>
						</View>
						<View style={styles.documentWrapper}>
							<View>
								<ImageConfig.DocumentPlaceholder height="50" />
							</View>
							<View
								style={{
									height: '100%',
									alignItems: 'flex-start',
									justifyContent: 'space-evenly',
									marginLeft: 20,
								}}>
								<Text
									style={{fontFamily: FontConfig.primary.bold, fontSize: 18}}>
									SSN Card
								</Text>

								<CustomButton
									// onPress={() => setModalVisible(!modalVisible)}
									// onPress={onCall}
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 30,
										width: 70,
									}}
									title={'Add'}
									class={'primary'}
									textStyle={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 16,
										textTransform: 'none',
									}}
								/>
							</View>
						</View>
						<View style={styles.documentWrapper}>
							<View>
								<ImageConfig.DocumentPlaceholder height="50" />
							</View>
							<View
								style={{
									height: '100%',
									alignItems: 'flex-start',
									justifyContent: 'space-evenly',
									marginLeft: 20,
								}}>
								<Text
									style={{fontFamily: FontConfig.primary.bold, fontSize: 18}}>
									Driver's license
								</Text>

								<CustomButton
									// onPress={() => setModalVisible(!modalVisible)}
									// onPress={onCall}
									style={{
										flex: 0,
										borderRadius: 8,
										marginVertical: 0,
										height: 30,
										width: 70,
									}}
									title={'Add'}
									class={'primary'}
									textStyle={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 16,
										textTransform: 'none',
									}}
								/>
							</View>
						</View>
					</View>
					<View
						style={{
							marginHorizontal: 20,
						}}>
						<CustomButton
							title={'Continue'}
							style={styles.button}
							// autoWidth={true}
							onPress={gotoNext}
						/>
					</View>
				</BaseViewComponent>
			</KeyboardAvoidCommonView>
		</>
	);
};
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f7fffd',
		alignItems: 'center',
	},
	header: {
		flex: 0,
		marginBottom: 20,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'column',
		// backgroundColor: 'red',
		width: '70%',
	},
	headerText: {
		textAlign: 'left',
		fontSize: 26,
		fontFamily: FontConfig.primary.bold,
		// fontFamily: 'NunitoSans-Bold',
		color: Colors.textDark,
	},
	subHeadingHolder: {marginTop: 10},
	subHeading: {
		textAlign: 'left',
		fontSize: 16,
		fontFamily: FontConfig.primary.regular,
		color: Colors.textLight,
	},
	formBlock: {
		alignItems: 'center',
		marginVertical: 25,
	},
	formHolder: {},
	logo: {},

	title: {textAlign: 'center', fontSize: 32},
	button: {
		marginVertical: 40,
		fontFamily: FontConfig.primary.bold,
		height: 50,
	},
	documentWrapper: {
		backgroundColor: Colors.backgroundShiftColor,
		// backgroundColor: '#F6FEFB',
		flexDirection: 'row',
		// paddingVertical: 20,
		width: '100%',
		height: 100,
		// justifyContent: 'center',
		alignItems: 'center',
		// marginBottom: 20,
		borderRadius: 8,
	},
});

export default MyProfileCreationGetDocuments;
