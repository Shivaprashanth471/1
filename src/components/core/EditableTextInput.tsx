import React, {useState} from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	StyleProp,
	ViewStyle,
} from 'react-native';
import {CommonStyles} from '../../helpers';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import moment from 'moment';

export interface EditableTextInputProps {
	placeHolder?: string;
	placeholderTextColor?: string;
	style?: StyleProp<ViewStyle>;
	underLineColor?: string;
	title?: string;
	edit?: boolean;
	subTitle?: string;
	description?: string;
	location?: string;
	degree?: string;
	startDate?: string;
	endDate?: any;
	getDate?: boolean;
}

const EditableTextInput = (props: EditableTextInputProps) => {
	const PlaceHolder = props.placeHolder;
	const placeholderTextColor = props.placeholderTextColor;
	const style = props.style;
	const underLineColor = props.underLineColor;
	const title = props.title;
	const edit = props.edit;
	const subTitle = props.subTitle;
	const description = props.description;
	const location = props.location;
	const degree = props.degree;
	const startDate = props.startDate;
	const endDate = props.endDate;

	// getDate should be true if you want to display start date & end date
	const getDate = props.getDate;

	if (endDate != '') {
		var end_date = moment(endDate).format('MMM, YYYY');
		// var end_date = moment(endDate).utcOffset(0, false).format('MMM, YYYY');

	} else {
		var end_date = 'Current';
		// console.log(end_date);
	}

	var start_date = moment(startDate).format('MMM, YYYY');
	// var start_date = moment(startDate).utcOffset(0, false).format('MMM, YYYY');
	// var end_date = moment(endDate).format('MMM, YY');


	const [iseditable, setIsEditable]: any = useState(false);
	const [display, setDisplay] = useState<'none' | 'flex' | undefined>('flex');

	const [titleName, setTitleName]: any = useState(title);
	const [subText, setSubText]: any = useState(subTitle);
	const [descText, setDescText]: any = useState(description);
	const [id, setID]: any = useState(0);
	const removeUser = () => {
		setDisplay('none');
	};
	const gotoLogin = () => {
		// props.navigation.replace(NavigateTo.Auth);
	};
	return (
		<>
			<View style={[styles.screen]}>
				<View
					style={{display: display, flexDirection: 'row', marginVertical: 15}}>
					{iseditable ? (
						<View style={{width: '70%'}}>
							<TextInput
								placeholder={'editable test'}
								placeholderTextColor={'black'}
								underlineColorAndroid={iseditable ? Colors.primary : 'white'}
								style={[
									{
										color: 'black',
										fontSize: 16,
										fontFamily: FontConfig.primary.bold,
										minHeight: 40,
										maxHeight: 60,
									},
								]}
								editable={iseditable}
								defaultValue={titleName}
								numberOfLines={10}
								multiline={true}
								onChangeText={text => {
									setTitleName(text);
								}}
							/>
							<TextInput
								placeholder={'editable test'}
								placeholderTextColor={'black'}
								underlineColorAndroid={iseditable ? 'green' : 'white'}
								style={{
									color: '#99A7B2',
									fontSize: 14,
									fontFamily: FontConfig.primary.regular,
								}}
								editable={iseditable}
								defaultValue={subText}
								onChangeText={subText => {
									setSubText(subText);
								}}
							/>
						</View>
					) : (
						<View style={{width: '70%'}}>
							<Text style={styles.titleText}>{titleName}</Text>
							<View style={{flexDirection: 'row'}}>
								<Text style={styles.subText}>{location}</Text>
								{degree && <Text style={styles.subText}>{degree}</Text>}
								{getDate && (
									<Text style={styles.subText}>
										{start_date} - {end_date ? end_date : 'Current'}
									</Text>
								)}
							</View>
							<Text style={styles.subText}>{descText}</Text>
						</View>
					)}
					<View style={styles.editButtons}>
						<TouchableOpacity
							onPress={() => {
								// setIsEditable(!iseditable);
							}}>
							{/* <ImageConfig.EditIcon
							style={{
								borderRadius: 100,
								marginRight: 10,
							}}
							height={'25'}
							width={'25'}
						/> */}
						</TouchableOpacity>
						<TouchableOpacity
						// onPress={removeUser}
						>
							{/* <ImageConfig.CloseIcon
							style={{
								borderRadius: 100,
							}}
							height={'25'}
							width={'25'}
						/> */}
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View
				style={{
					borderBottomWidth: 1.5,
					borderBottomColor: Colors.backgroundShiftBoxColor,
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
	},
	editButtons: {
		flexDirection: 'row',
		width: '30%',
		justifyContent: 'flex-end',
		height: '100%',
	},
	titleText: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
		color: Colors.textDark,
		marginBottom: 5,
	},
	subText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 12,
		color: Colors.textOnTextLight,
	},
});

export default EditableTextInput;
