import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
	ActivityIndicator,
	FlatList,
	Modal,
	NativeSyntheticEvent,
	StyleProp,
	StyleSheet,
	Text,
	TextInput,
	TextInputFocusEventData,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import LabelComponent from './LabelComponent';
import Colors from '../../constants/Colors';
import FontConfig from '../../constants/FontConfig';
import {ApiFunctions, CommonFunctions, CommonStyles} from '../../helpers';
import {ImageConfig} from '../../constants';
import {TSAPIResponseType} from '../../helpers/ApiFunctions';
import {CancelTokenSource} from 'axios';
import {BaseViewComponent, CustomButton, ErrorComponent} from './index';
import {SvgProps} from 'react-native-svg';

export interface AutoCompleteComponentProps {
	style?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<TextStyle>;
	labelText?: string;
	method?: 'post' | 'get';
	disabled?: boolean;
	value?: string | any;
	placeHolder?: string;
	displayWith?: (item: any) => any;
	keyExtractor?: (item: any) => any;
	valueExtractor?: (item: any) => any;
	onChange?: (item: any) => void;
	searchUrl?: string;
	searchKey?: string;
	secondarySearchKey?: string;
	extraPayload?: any;
	emptyIcon?: React.FC<SvgProps>;
	emptyMessage?: string;
	allowEmpty?: boolean;
	isEditable?: boolean;
}

const AutoCompleteComponent = (props: AutoCompleteComponentProps) => {
	const {labelText, onChange, value, isEditable} = props;
	const style = props.style || {};
	const method = props.method || 'get';
	const extraPayload = props.extraPayload || {};
	const searchUrl = props.searchUrl || false;
	const searchKey = props.searchKey || 'search';
	const disabled = props.disabled !== undefined ? props.disabled : false;
	const secondarySearchKey = props.secondarySearchKey || false;
	const placeHolder = props.placeHolder || 'Type Something here!';
	const emptyMessage = props.emptyMessage || 'Nothing to show here!';
	const inputStyle = props.inputStyle || {};
	const emptyIcon = props.emptyIcon || ImageConfig.IconErrorOutline;
	const cancelTokenRef = useRef<CancelTokenSource | null>(null);

	const [text, setText] = useState<string>('');
	const [selected, setSelected] = useState<any | null>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [list, setList] = useState<any[]>([]);

	const defaultDisplayWith = useCallback(item => item?.name || '', []);
	const defaultKeyExtractor = useCallback(item => item?._id || '', []);
	const defaultValueExtractor = useCallback(item => item || '', []);
	const displayWith = props.displayWith || defaultDisplayWith;
	const valueExtractor = props.valueExtractor || defaultValueExtractor;
	const keyExtractor = props.keyExtractor || defaultKeyExtractor;
	useEffect(() => {
		if (value) {
			setText(displayWith(value));
			setSelected(value);
		}
	}, [displayWith, value]);
	const onBlur = useCallback(
		(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			// console.log('onBlur', e.timeStamp);
		},
		[],
	);
	const onFocus = useCallback(
		(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			// console.log('onFocus', e.timeStamp);
		},
		[],
	);

	const onCancel = useCallback(() => {
		setText(selected ? displayWith(selected) : '');
		setIsEditing(false);
	}, [displayWith, selected]);

	const onConfirm = useCallback(() => {
		setSelected((prevState: any) => {
			setText(prevState ? displayWith(prevState) : '');
			if (onChange) {
				onChange(valueExtractor(prevState));
			}
			return prevState;
		});
		setIsEditing(false);
	}, [displayWith, onChange, valueExtractor]);

	const getAutoComplete = useCallback(
		(t = text) => {
			console.log('trigger');
			if (!searchUrl) {
				return;
			}
			const defaultPayload = {limit: 20};
			const payload = {...defaultPayload, ...extraPayload};
			payload[searchKey] = (t || '').trim().toLowerCase();
			if (secondarySearchKey) {
				payload[secondarySearchKey] = (t || '').trim().toLowerCase();
			}
			setIsLoaded(false);
			setIsLoading(true);
			if (cancelTokenRef.current) {
				cancelTokenRef.current.cancel('aborted');
			}
			const cancelToken = CommonFunctions.getCancelToken();
			cancelTokenRef.current = cancelToken;
			let ApiCall = ApiFunctions.get;
			if (method === 'post') {
				ApiCall = ApiFunctions.post;
			}

			ApiCall(searchUrl, payload, {}, {cancelToken: cancelToken.token})
				.then((resp: TSAPIResponseType<any[]>) => {
					setIsLoading(false);
					setIsLoaded(true);
					setList(resp.data);
				})
				.catch(err => {
					setIsLoading(false);
					setIsLoaded(true);
					setList([]);
					console.log(err);
				});
		},
		[searchUrl, extraPayload, searchKey, text, secondarySearchKey, method],
	);

	const openEditing = useCallback(() => {
		setIsEditing(true);
		getAutoComplete();
	}, [getAutoComplete]);
	const onSelect = useCallback(
		(item: any) => {
			console.log('onSelect', item);
			setText(item ? displayWith(item) : '');
			setSelected(item);
			onConfirm();
		},
		[displayWith, onConfirm],
	);
	//
	// useEffect(() => {
	//   getAutoComplete();
	// }, [text, getAutoComplete]);

	return (
		<>
			<Modal
				visible={isEditing}
				presentationStyle={'fullScreen'}
				animated={true}
				animationType={'slide'}
				onRequestClose={onCancel}>
				<BaseViewComponent noScroll={true} normal={true}>
					<View style={{paddingVertical: 0, paddingBottom: 60, flex: 1}}>
						<View style={{padding: 0}}>
							{!!labelText && (
								<LabelComponent
									style={{paddingHorizontal: 15, paddingTop: 15}}
									title={labelText}
								/>
							)}
							<View style={[styles.inputWrapper, {paddingHorizontal: 15}]}>
								{isLoading && (
									<View style={{position: 'absolute', right: 40}}>
										<ActivityIndicator color={Colors.primary} />
									</View>
								)}
								{!!text && text.length > 0 && (
									<TouchableOpacity
										onPress={() => {
											setText('');
											getAutoComplete('');
										}}
										style={{position: 'absolute', zIndex: 2, right: 10}}>
										<ImageConfig.IconClose
											color={Colors.textDark}
											width={24}
											height={24}
										/>
									</TouchableOpacity>
								)}
								<TextInput
									style={[styles.input, inputStyle]}
									value={text}
									autoFocus={true}
									onBlur={onBlur}
									placeholder={placeHolder}
									onFocus={onFocus}
									onChangeText={t => {
										setText((t || '').trimStart());
										getAutoComplete((t || '').trimStart());
									}}
								/>
							</View>
						</View>
						<View style={{flex: 1}}>
							<FlatList
								data={list}
								ListHeaderComponent={() => {
									return (
										<>
											{list && list.length > 0 && (
												<TouchableOpacity
													onPress={onSelect.bind(null, undefined)}
													style={{
														padding: 15,
														flexDirection: 'row',
														justifyContent: 'space-between',
													}}>
													<Text
														style={[
															{
																fontSize: 16,
																fontFamily: FontConfig.primary.regular,
															},
															{
																color:
																	selected === undefined
																		? Colors.primary
																		: Colors.textDark,
															},
														]}>
														Not Selected
													</Text>
												</TouchableOpacity>
											)}
										</>
									);
								}}
								ListEmptyComponent={() => {
									return (
										<>
											{isLoaded && (
												<ErrorComponent icon={emptyIcon} text={emptyMessage} />
											)}
											{!isLoaded && (
												<ErrorComponent
													text={'Search Something!'}
													icon={ImageConfig.IconReload}
												/>
											)}
										</>
									);
								}}
								keyboardShouldPersistTaps={'handled'}
								keyExtractor={keyExtractor}
								renderItem={({item, index}) => {
									return (
										<TouchableOpacity
											style={{
												padding: 15,
												flexDirection: 'row',
												justifyContent: 'space-between',
												borderTopColor: Colors.borderColor,
												borderTopWidth:
													index === 0 ? 0 : StyleSheet.hairlineWidth,
											}}
											onPress={onSelect.bind(null, item)}>
											<Text
												style={[
													{
														fontSize: 16,
														fontFamily: FontConfig.primary.regular,
													},
													{
														color:
															selected && selected === item
																? Colors.primary
																: Colors.textDark,
													},
												]}>
												{displayWith(item)}
											</Text>
											{selected && selected === item && (
												<View
													style={{
														justifyContent: 'center',
														alignItems: 'center',
													}}>
													<ImageConfig.IconCheck color={Colors.primary} />
												</View>
											)}
										</TouchableOpacity>
									);
								}}
							/>
						</View>
					</View>
					<View
						style={{
							position: 'absolute',
							bottom: 0,
							backgroundColor: Colors.backgroundColor,
							borderTopColor: Colors.borderColor,
							borderTopWidth: StyleSheet.hairlineWidth,
							right: 0,
							left: 0,
							paddingHorizontal: 10,
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<View style={CommonStyles.flex}>
							<CustomButton
								onPress={onCancel}
								style={{flex: 0, marginRight: 5, marginBottom: 10}}
								title={'Cancel'}
								type={'outline'}
							/>
						</View>
						{/*<View style={CommonStyles.flex}>*/}
						{/*  <CustomButton*/}
						{/*    disabled={!selected}*/}
						{/*    onPress={onConfirm}*/}
						{/*    style={{flex: 0, marginLeft: 5}}*/}
						{/*    title={'Select'}*/}
						{/*  />*/}
						{/*</View>*/}
					</View>
				</BaseViewComponent>
			</Modal>
			<View style={[styles.wrapper, style]}>
				{!!labelText && <LabelComponent title={labelText} />}
				<TouchableOpacity
					disabled={disabled}
					onPress={() => {
						isEditable ? openEditing() : setIsEditing(false);
					}}
					style={[styles.inputWrapper]}>
					{!!text && (
						<Text
							style={[
								styles.input,
								{paddingTop: 10, height: 'auto', paddingBottom: 5},
							]}>
							{text || ''}
						</Text>
					)}
					{!text && (
						<Text
							style={[
								styles.input,
								{
									color: Colors.textLight,
									paddingTop: 10,
								},
							]}>
							{placeHolder}
						</Text>
					)}
					{/*<TextInput*/}
					{/*  style={[styles.input, inputStyle]}*/}
					{/*  value={text}*/}
					{/*  onBlur={onBlur}*/}
					{/*  placeholder={'Type Something here!'}*/}
					{/*  onFocus={(e) => {*/}
					{/*    onFocus(e);*/}
					{/*    openEditing();*/}
					{/*  }}*/}
					{/*  onChangeText={(t) => {*/}
					{/*    setText(t);*/}
					{/*    getAutoComplete(t);*/}
					{/*    openEditing();*/}
					{/*  }}*/}
					{/*/>*/}
				</TouchableOpacity>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		marginVertical: 10,
	},
	inputWrapper: {
		// marginVertical: 5,
		// borderRadius: 10,
		// borderWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: 1.5,
		borderColor: Colors.borderColor,
		// backgroundColor: Colors.backgroundColor,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		height: 40,
		// borderRadius: 10,
		width: '100%',
		paddingHorizontal: 0,
		color: Colors.textDark,
		// backgroundColor: Colors.backgroundColor,
		fontFamily: FontConfig.primary.regular,
		fontSize: 16,
	},
});

export default AutoCompleteComponent;
