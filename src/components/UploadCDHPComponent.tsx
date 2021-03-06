import React, {useEffect, useState, useCallback} from 'react';
import {
	StyleSheet,
	Text,
	View,
	Alert,
	TouchableOpacity,
	Modal,
	useWindowDimensions,
	Linking,
	Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {Colors, FontConfig, ImageConfig, ENV} from '../constants';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../helpers';
import {LoadingComponent, CustomButton} from './core';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@segment/analytics-react-native';
import WebView from 'react-native-webview';

export interface UploadCDHPComponentProps {
	title: string;
	navigation?: any;
	shiftID: any;
	state: any;
	showOnlyDocument?: boolean;
}

const UploadCDHPComponent = (props: UploadCDHPComponentProps) => {
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const [documentAvailable, setDocumentAvailable]: any = useState(false);
	const [selectPickerModalVisible, setSelectPickerModalVisible] =
		useState(false);
	const [selectDeleteFileModalVisible, setSelectDeleteFileModalVisible] =
		useState<boolean>(false);
	const title = props.title;
	const shiftID = props.shiftID;
	const state = props.state;
	const showOnlyDocument = props.showOnlyDocument || false;

	const dimensions = useWindowDimensions();
	const [url, setURL]: any = useState();
	const [type, setType]: any = useState();
	const [fileViewModalVisible, setFileViewModalVisible] =
		useState<boolean>(false);
	const [showFullscreen, setShowFullscreen] = useState<any | null>(null);

	const uploadPut = useCallback((dataURL, file) => {
		setIsLoading(true);

		const myHeaders = new Headers();
		myHeaders.append('Content-Type', file.type);

		const fileContent = file;

		const requestOptions = {
			method: 'PUT',
			headers: myHeaders,
			body: fileContent,
			redirect: 'follow',
		};

		fetch(dataURL, requestOptions)
			.then(response => {
				setSelectPickerModalVisible(false);
				setDocumentAvailable(true);
				setIsLoading(false);
				setIsLoaded(true);
				state(false);
				analytics.track('Document Upload Complete');
			})
			.catch(error => console.log('error:', error));
	}, []);

	const uploadHandler = useCallback(
		file => {
			const payload = {
				file_name: file.name,
				file_type: file.type,
				attachment_type: title,
			};
			setIsLoaded(false);
			setIsLoading(true);

			if (shiftID) {
				ApiFunctions.post(
					ENV.apiUrl + 'shift/' + shiftID + '/attachment',
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
		[shiftID, title, uploadPut],
	);

	const openImageUpload = useCallback(
		(mode: 'pdf' | 'camera' | 'image' = 'pdf') => {
			if (mode === 'camera') {
				analytics.track('Document Upload Type', {
					documentUploadType: 'camera',
				});
				CommonFunctions.openMedia(undefined, mode)
					.then(file => {
						uploadHandler(file);
					})
					.catch(error => {
						console.log(error);
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
						uploadHandler(file);
					})
					.catch(error => {
						ToastAlert.show(error.err || 'Something went wrong');
					});
			}
		},
		[uploadHandler],
	);

	const getAttachmentData = useCallback(() => {
		setIsLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'shift/' + shiftID + '/attachments')
			.then(async resp => {
				if (resp) {
					var wantedData = resp.data.filter(function (i: any) {
						return i.attachment_type === title;
					});

					if (wantedData.length === 0) {
						setDocumentAvailable(false);
						state(true);
					} else {
						state(false);
						let url = wantedData[0].url;
						let type = wantedData[0].ContentType;
						setDocumentAvailable(true);
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
			});
	}, [shiftID, title]);
	useEffect(() => {
		console.log('loading get documents');
		getAttachmentData();
	}, [getAttachmentData]);

	const deleteData = useCallback(() => {
		setIsLoading(true);
		setSelectDeleteFileModalVisible(false);
		ApiFunctions.get(ENV.apiUrl + 'shift/' + shiftID + '/attachments')
			.then(resp => {
				var wantedData = resp.data.filter(function (i: any) {
					return i.attachment_type === title;
				});
				if (wantedData) {
					const payload = {file_key: wantedData[0].file_key};

					ApiFunctions.delete(
						ENV.apiUrl + 'shift/' + shiftID + '/attachment',
						payload,
					)
						.then(resp => {
							setDocumentAvailable(false);
							setIsLoading(false);
							setIsLoaded(true);
							ToastAlert.show('Attachment removed');
							state(true);
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
			});
	}, [shiftID, title]);

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
								{/* {Platform.OS === 'android' && ( */}
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
								{/* )} */}
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
							marginTop: 15,
						}}>
						<TouchableOpacity
							style={{
								padding: 10,
							}}
							onPress={() => {
								setFileViewModalVisible(!fileViewModalVisible);
							}}>
							<ImageConfig.CloseIconModal height={'25'} width={'25'} />
						</TouchableOpacity>
					</View>
					{showFullscreen && (
						<>
							{
								<Image
									style={{
										width: dimensions.width,
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
			{isLoading && <LoadingComponent />}
			{!isLoading && isLoaded && (
				<>
					<View style={{marginHorizontal: 20}}>
						<View>
							{!documentAvailable ? (
								<TouchableOpacity
									onPress={() => {
										setSelectPickerModalVisible(!selectPickerModalVisible);
									}}>
									<LinearGradient
										start={{x: 0, y: 0}}
										end={{x: 1, y: 0}}
										colors={['#10C4D3', '#4FE6AF']}
										style={{
											height: 45,
											borderRadius: 8,
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center',
											paddingHorizontal: 10,
										}}>
										<Text
											style={{
												fontFamily: FontConfig.primary.semiBold,
												fontSize: 16,
												color: '#fff',
											}}>
											Upload Document
										</Text>
										<ImageConfig.AddCircleIcon width="20" height="20" />
									</LinearGradient>
								</TouchableOpacity>
							) : (
								<View
									style={{
										height: 45,
										borderRadius: 8,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
										paddingHorizontal: 10,
										backgroundColor: '#fff',
									}}>
									<View
										style={{
											flexDirection: 'row',
										}}>
										<ImageConfig.fileIconShift width="25" height="25" />
										<Text
											style={{
												fontFamily: FontConfig.primary.bold,
												fontSize: 16,
												marginLeft: 10,
											}}>
											{title}
										</Text>
									</View>
									{showOnlyDocument ? (
										<>
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
										</>
									) : (
										<>
											<TouchableOpacity
												onPress={() => {
													setSelectDeleteFileModalVisible(
														!selectDeleteFileModalVisible,
													);
												}}>
												<ImageConfig.CloseOrangeIcon width="12" height="12" />
											</TouchableOpacity>
										</>
									)}
								</View>
							)}
						</View>
					</View>
					{modalViewImage()}
					{selectDeleteFileModal()}
					{selectPickerModal()}
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
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
	modalTextTitle: {
		fontFamily: FontConfig.primary.bold,
		color: Colors.textOnInput,
		marginBottom: 5,
	},
	uploadText: {
		fontSize: 14,
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
		marginTop: 10,
	},
	modalTextSub: {
		textAlign: 'center',
		fontFamily: FontConfig.primary.regular,
		color: Colors.textOnTextLight,
		marginVertical: 14,
		fontSize: 14,
	},
});

export default UploadCDHPComponent;
