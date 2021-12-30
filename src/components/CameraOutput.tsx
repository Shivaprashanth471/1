// import React from 'react';
// import {Image, StyleSheet, View} from 'react-native';
// import {CommonFunctions, CommonStyles} from "../helpers";
// import {Colors, FontConfig} from "../constants";
// import VideoComponent from "./VideoComponent";
// import {CustomButton} from "./core";
//
// export interface CameraOutputProps {
// 	photo: any,
// 	mode: "image" | "video",
// 	onPhotoConfirmed: (photo: any) => void,
// }
//
// const CameraOutput = (props: CameraOutputProps) => {
// 	let {photo, mode, onPhotoConfirmed} = props;
//
// 	return (
// 		<View style={styles.container}>
// 			{photo &&
//       <View style={CommonStyles.flex}>
// 				{mode === 'image' && <Image style={styles.preview} source={{uri: photo.uri}}/>}
// 				{mode === 'video' && <VideoComponent style={styles.preview} meta={{url: photo.uri}}/>}
// 				{/* <View style={CommonStyles.flex}><Image style={styles.preview} source={{ uri: photo }} /> */}
//
//           <View style={{
// 						position: "absolute",
// 						bottom: 10,
// 						height: 50,
// 						width: CommonFunctions.getWidth() * 0.8,
// 						left: '10%'
// 					}}>
//               <CustomButton class={"primary"} onPress={onPhotoConfirmed.bind(null, photo)} title='Proceed'/>
//           </View>
// 				{/*<View style={styles.captureBtn}>*/}
// 				{/*    <TouchableOpacity onPress={onPhotoConfirmed.bind(null, photo)} style={styles.capture}>*/}
// 				{/*		<Text style={styles.captureText}> Proceed </Text>*/}
// 				{/*    </TouchableOpacity>*/}
// 				{/*</View>*/}
//       </View>}
// 		</View>
// 	);
// }
//
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: 'black',
// 	},
// 	preview: {
// 		flex: 1,
// 		// backgroundColor: 'black',
// 		justifyContent: 'flex-end',
// 		alignItems: 'center',
// 		width: '100%',
// 		height: '100%'
// 	},
// 	capture: {
// 		flex: 0,
// 		backgroundColor: '#fff',
// 		borderRadius: 5,
// 		padding: 10,
// 		paddingHorizontal: 20,
// 		alignSelf: 'center',
// 		margin: 20,
// 	},
// 	captureBtn: {
// 		position: 'absolute',
// 		bottom: 5,
// 		width: '100%',
// 		flex: 1,
// 		flexDirection: 'row',
// 		justifyContent: 'center'
// 	},
// 	captureText: {
// 		fontSize: 14,
// 		fontFamily: FontConfig.primary.normal,
// 		color: Colors.primary
// 	}
// });
//
// export default CameraOutput;
