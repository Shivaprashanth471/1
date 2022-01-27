import React, {useCallback, useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	Linking,
	Modal,
	Platform,
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
	ViewStyle,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {Colors, ENV, FontConfig, ImageConfig} from '../constants';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../helpers';
import {CustomButton, DatePickerComponent} from './core';
import {useSelector} from 'react-redux';
import {StateParams} from '../store/reducers';
import Moment from 'moment';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import WebView from 'react-native-webview';
import analytics from '@segment/analytics-react-native';

export interface AddDocumentComponentProps {
	title: string;
	navigation?: any;
	style?: StyleProp<ViewStyle>;
}

const AddDocumentComponent = (props: AddDocumentComponentProps) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [documentExpiry, setDocumentExpiry]: any = useState();
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [documentAvailable, setDocumentAvailable]: any = useState(false);
	const currentDate = Moment().utcOffset(0, false);
	const [show, setShow]: any = useState(false);
	const [changedDate, setChangedDate]: any = useState<string | null>(null);
	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;
	const [selectPickerModalVisible, setSelectPickerModalVisible] =
		useState(false);
	const [selectDateModalVisible, setSelectDateModalVisible] = useState(false);
	const title = props.title;
	const style = props.style || {};
	const [url, setURL]: any = useState();
	const [type, setType]: any = useState();
	const [showFullscreen, setShowFullscreen] = useState<any | null>(null);
	const [selectDeleteFileModalVisible, setSelectDeleteFileModalVisible] =
		useState<boolean>(false);
	const [fileViewModalVisible, setFileViewModalVisible] =
		useState<boolean>(false);
	const dimensions = useWindowDimensions();

	const getAttachmentData = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + HcpUser._id + '/attachments')
			.then(async resp => {
				if (resp) {
					var wantedData = resp.data.filter(function (i: any) {
						return i.attachment_type === title;
					});

					if (wantedData.length === 0) {
						setDocumentAvailable(false);
					} else {
						setDocumentAvailable(true);
						setDocumentExpiry(wantedData[0].expiry_date);
						let url = wantedData[0].url;
						let type = wantedData[0].ContentType;
						setShowFullscreen({url, type});
						setURL(wantedData[0].url);
						setType(wantedData[0].ContentType);
					}
				} else {
					Alert.alert('Error');
				}
				setIsLoading(false);
				setIsLoaded(true);
			})
			.catch((err: any) => {
				console.log(err);
				setIsLoading(false);
				setIsLoaded(true);
				setDocumentExpiry(null);
			});
	}, [HcpUser._id, title]);

	const uploadPut = useCallback(
		(dataURL, file) => {
			setIsLoading(true);

			var myHeaders = new Headers();
			myHeaders.append('Content-Type', file.type);

			var fileContent = file;

			var requestOptions = {
				method: 'PUT',
				headers: myHeaders,
				body: fileContent,
				redirect: 'follow',
			};

			fetch(dataURL, requestOptions)
				.then(response => {
					setDocumentExpiry(changedDate);
					getAttachmentData();
					analytics.track('Document Upload Complete');
					// setDocumentAvailable(true);
					// setIsLoading(false);
					// setIsLoaded(true);
				})
				.catch(error => console.log('error:', error));
		},
		[changedDate, getAttachmentData],
	);

	const uploadHandler = useCallback(
		file => {
			const payload = {
				file_name: file.name,
				file_type: file.type,
				attachment_type: title,
				expiry_date: changedDate,
			};
			setIsLoaded(false);
			setIsLoading(true);

			if (HcpUser._id) {
				ApiFunctions.post(
					ENV.apiUrl + 'hcp/' + HcpUser._id + '/attachment',
					payload,
				)
					.then(resp => {
						uploadPut(resp.data, file);
					})
					.catch(err => {
						console.log(err.error);
						ToastAlert.show(err.error);
					});
			}
		},
		[HcpUser._id, changedDate, title, uploadPut],
	);

	const openImageUpload = useCallback(
		(mode: 'pdf' | 'camera' | 'image' = 'pdf') => {
			if (mode === 'camera') {
				analytics.track('Document Upload Type', {
					documentUploadType: 'camera',
				});
				CommonFunctions.openMedia(undefined, mode)
					.then(file => {
						setSelectPickerModalVisible(false);
						uploadHandler(file);
					})
					.catch(error => {
						setSelectPickerModalVisible(false);
						ToastAlert.show(error.err || 'Something went wrong');
					});
			} else {
				let picMode: any = [DocumentPicker.types.pdf];
				if (mode === 'pdf') {
					analytics.track('Document Upload Type', {
						documentUploadType: 'pdf',
					});
				}
				if (mode === 'image') {
					analytics.track('Document Upload Type', {
						documentUploadType: 'image',
					});
					picMode = [DocumentPicker.types.images];
				}
				CommonFunctions.openDocumentPicker(picMode)
					.then(file => {
						setSelectPickerModalVisible(false);
						uploadHandler(file);
					})
					.catch(error => {
						setSelectPickerModalVisible(false);
						ToastAlert.show(error.err || 'Something went wrong');
					});
			}
		},
		[uploadHandler],
	);

	useEffect(() => {
		console.log('loading get documents');
		getAttachmentData();
	}, [getAttachmentData]);

	const deleteData = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'hcp/' + HcpUser._id + '/attachments')
			.then(resp => {
				var wantedData = resp.data.filter(function (i: any) {
					return i.attachment_type === title;
				});
				if (wantedData) {
					const payload = {file_key: wantedData[0].file_key};

					ApiFunctions.delete(
						ENV.apiUrl + 'hcp/' + HcpUser._id + '/attachment',
						payload,
					)
						.then(resp => {
							setDocumentAvailable(false);
							setSelectDeleteFileModalVisible(false);
							setIsLoading(false);
							setIsLoaded(true);
							ToastAlert.show('Attachment removed');
						})
						.catch(err => {
							console.log(err);
						});
				}
			})
			.catch((err: any) => {
				console.log(err);
				setIsLoading(false);
				setIsLoaded(true);
				setDocumentExpiry(null);
			});
	}, [HcpUser._id, title]);

	const selectPickerModal = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={selectPickerModalVisible}
					onRequestClose={() => {
						setSelectPickerModalVisible(!selectPickerModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View style={styles.modalView}>
							<View
								style={{
									width: '100%',
									alignItems: 'flex-end',
									paddingHorizontal: 20,
									paddingTop: 10,
								}}>
								<TouchableOpacity
									onPress={() => {
										setSelectPickerModalVisible(!selectPickerModalVisible);
									}}>
									<ImageConfig.CloseIconModal height={'25'} width={'25'} />
								</TouchableOpacity>
							</View>
							<Text style={[styles.modalTextTitle, {fontSize: 24}]}>
								Upload From{' '}
							</Text>

							<View
								style={{
									flexDirection: 'row',
									marginHorizontal: 10,
									marginTop: 30,
									width: '100%',
									justifyContent: 'space-evenly',
								}}>
								<TouchableOpacity
									onPress={openImageUpload.bind(null, 'pdf')}
									style={{
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<View
										style={{
											backgroundColor: Colors.backgroundShiftColor,
											padding: 20,
											borderRadius: 500,
										}}>
										<ImageConfig.docUploadIcon height={'35'} width={'35'} />
									</View>
									<Text style={styles.uploadText}>PDF</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={openImageUpload.bind(null, 'camera')}
									style={{
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<View
										style={{
											backgroundColor: Colors.backgroundShiftColor,
											padding: 20,
											borderRadius: 500,
										}}>
										<ImageConfig.cameraIcon height={'35'} width={'35'} />
									</View>
									<Text style={styles.uploadText}>CAMERA</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={openImageUpload.bind(null, 'image')}
									style={{
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<View
										style={{
											backgroundColor: Colors.backgroundShiftColor,
											padding: 20,
											borderRadius: 500,
										}}>
										<ImageConfig.imageUploadIcon height={'35'} width={'35'} />
									</View>
									<Text style={styles.uploadText}>IMAGE</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	const selectDateModal = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={selectDateModalVisible}
					onRequestClose={() => {
						setSelectDateModalVisible(!selectDateModalVisible);
					}}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View
								style={{
									width: '100%',
									alignItems: 'flex-end',
									paddingHorizontal: 20,
									paddingTop: 10,
									marginBottom: 10,
								}}>
								<TouchableOpacity
									onPress={() => {
										setSelectDateModalVisible(!selectDateModalVisible);
										setChangedDate(null);
									}}>
									<ImageConfig.CloseIconModal height={'25'} width={'25'} />
								</TouchableOpacity>
							</View>

							<Text style={[styles.modalTextTitle, {fontSize: 20}]}>
								Please give expiry date of {title}{' '}
							</Text>
							<View
								style={{
									width: '100%',

									marginTop: 10,
								}}>
								<DatePickerComponent
									style={{
										height: 50,

										borderWidth: 2,

										borderColor: Colors.borderColor,

										width: '100%',
									}}
									onChange={date => {
										setChangedDate(date);
									}}
								/>
							</View>
							<CustomButton
								style={{
									flex: 0,
									borderRadius: 8,
									marginVertical: 0,
									height: 50,
									width: '100%',
									marginTop: 20,
								}}
								title={'Upload ' + title}
								class={'primary'}
								textStyle={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 14,
									textTransform: 'none',
								}}
								onPress={() => {
									if (changedDate === null) {
									} else {
										setSelectDateModalVisible(!selectDateModalVisible);
										setSelectPickerModalVisible(!selectPickerModalVisible);
									}
								}}
								disabled={changedDate === null ? true : false}
							/>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	const selectDeleteFileModal = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={selectDeleteFileModalVisible}
					onRequestClose={() => {
						setSelectDeleteFileModalVisible(!selectDeleteFileModalVisible);
					}}>
					<View style={[styles.centeredView, {backgroundColor: '#000000A0'}]}>
						<View
							style={[
								styles.modalView,
								{
									height: '30%',
								},
							]}>
							<Text
								style={{
									fontFamily: FontConfig.primary.bold,
									fontSize: 22,
									color: Colors.primary,
								}}>
								Delete File!
							</Text>
							<Text style={styles.modalTextSub}>
								Do you want to delete {title}
							</Text>
							<View
								style={{
									flexDirection: 'row',
									marginHorizontal: 10,
									marginTop: 30,
								}}>
								<View
									style={{
										width: '45%',
										marginRight: '10%',
									}}>
									<CustomButton
										onPress={() =>
											setSelectDeleteFileModalVisible(
												!selectDeleteFileModalVisible,
											)
										}
										style={{
											flex: 0,
											borderRadius: 8,
											marginVertical: 0,
											height: 45,
											backgroundColor: Colors.backgroundShiftColor,
										}}
										title={'Cancel'}
										class={'secondary'}
										textStyle={{color: Colors.primary}}
									/>
								</View>
								<View
									style={{
										width: '45%',
									}}>
									<CustomButton
										style={{
											flex: 0,
											borderRadius: 8,
											marginVertical: 0,
											height: 45,
										}}
										title={'Delete'}
										onPress={deleteData}
										isLoading={isLoading}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	const modalViewImage = () => {
		return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={fileViewModalVisible}
				onRequestClose={() => {
					setFileViewModalVisible(!fileViewModalVisible);
				}}>
				<View
					style={{
						flex: 1,
						backgroundColor: '#fff',
					}}>
					<View
						style={{
							alignItems: 'flex-end',
							justifyContent: 'center',
							paddingHorizontal: 20,
							paddingVertical: 10,
						}}>
						<TouchableOpacity
							onPress={() => {
								setFileViewModalVisible(!fileViewModalVisible);
							}}>
							<ImageConfig.CloseIconModal height={'25'} width={'25'} />
						</TouchableOpacity>
					</View>
					{showFullscreen && (
						<>
							{
								<WebView
									contentMode={'mobile'}
									style={{
										width: dimensions.width,
										backgroundColor: '#fff',
										height: dimensions.height,
									}}
									source={{uri: showFullscreen.url}}
								/>
							}
						</>
					)}
				</View>
			</Modal>
		);
	};

	return (
		<>
			{
				<>
					<View style={[styles.documentWrapper, style]}>
						<View>
							<ImageConfig.DocumentPlaceholder height="50" />
						</View>
						{modalViewImage()}
						<View
							style={{
								height: '100%',
								alignItems: 'flex-start',
								flex: 1,
								justifyContent: 'space-evenly',
								marginLeft: 20,
							}}>
							<View>
								<Text
									style={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 16,
									}}>
									{title}
								</Text>
								{!isLoading && isLoaded && (
									<Text
										style={{
											color: Colors.textLight,
											fontFamily: FontConfig.primary.regular,
											fontSize: 14,
											display: documentAvailable ? 'flex' : 'none',
										}}>
										Expires on: {Moment(documentExpiry).format('DD-MM-YYYY')}
									</Text>
								)}
							</View>
							{isLoading && <ActivityIndicator color={Colors.primary} />}
							{documentAvailable && !isLoading && isLoaded && (
								<View
									style={{
										flexDirection: 'row',
									}}>
									<TouchableOpacity
										onPress={() => {
											if (type === 'application/pdf') {
												Linking.openURL(url);
											} else {
												setFileViewModalVisible(true);
											}
										}}>
										<Text
											style={{
												color: Colors.primary,
												fontFamily: FontConfig.primary.bold,
												fontSize: 14,
												textDecorationLine: 'underline',
												marginRight: 20,
											}}>
											View
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										// onPress={deleteData}
										onPress={() => {
											setSelectDeleteFileModalVisible(
												!selectDeleteFileModalVisible,
											);
										}}>
										<Text
											style={{
												color: Colors.warn,
												fontFamily: FontConfig.primary.bold,
												fontSize: 14,
												textDecorationLine: 'underline',
											}}>
											Delete
										</Text>
									</TouchableOpacity>
								</View>
							)}
							{!documentAvailable && !isLoading && isLoaded && (
								<CustomButton
									icon={
										<ImageConfig.AddCircleIcon
											color={Colors.textLight}
											style={{
												borderRadius: 100,
											}}
											height={'15'}
											width={'15'}
										/>
									}
									iconPosition="left"
									style={{
										borderRadius: 8,
										height: 30,
										width: '40%',
										backgroundColor: Colors.backgroundShiftColor,
										alignItems: 'center',
										justifyContent: 'center',
									}}
									title={'Add'}
									class={'primary'}
									textStyle={{
										fontFamily: FontConfig.primary.bold,
										fontSize: 14,
										textTransform: 'none',
									}}
									onPress={() => {
										setSelectDateModalVisible(!selectDateModalVisible);
									}}
								/>
							)}
						</View>
					</View>
					{selectDeleteFileModal()}
					{selectDateModal()}
					{selectPickerModal()}
				</>
			}
		</>
	);
};

const styles = StyleSheet.create({
	documentWrapper: {
		backgroundColor: '#F6FEFB',
		borderWidth: 1.5,
		borderColor: Colors.backgroundShiftBoxColor,
		flexDirection: 'row',
		width: '100%',
		height: 100,
		alignItems: 'center',
		marginBottom: 10,
		borderRadius: 8,
	},

	ModalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalView: {
		backgroundColor: 'white',
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
		width: '100%',
		height: '40%',
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalTextTitle: {
		fontFamily: FontConfig.primary.bold,
		color: Colors.textOnInput,
		marginBottom: 5,
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
		marginVertical: 14,
		fontSize: 14,
	},
	modalTime: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 24,
		color: Colors.textOnAccent,
		marginTop: 15,
	},
	dateText: {
		fontFamily: FontConfig.primary.regular,
		color: Colors.textDark,
		fontSize: 15,
	},
	uploadText: {
		fontSize: 14,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
		marginTop: 10,
	},

	//
	ModalCenteredView: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'red',
	},
	modalView1: {
		marginHorizontal: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
		fontFamily: FontConfig.primary.bold,
		fontSize: 16,
	},
});

export default AddDocumentComponent;
