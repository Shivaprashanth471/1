import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import {
	Alert,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	View,
	ImageBackground,
	Modal,
	ScrollView,
} from 'react-native';
import {ApiFunctions, CommonFunctions, ToastAlert} from '../../helpers';
import {Field, FieldProps, Formik, FormikHelpers} from 'formik';
import {
	Colors,
	ENV,
	FontConfig,
	ImageConfig,
	NavigateTo,
} from '../../constants';
import {
	CustomButton,
	ErrorComponent,
	KeyboardAvoidCommonView,
	LoadingComponent,
	SliderComponent,
	FormikRadioGroupComponent,
	FormikDatepickerComponent,
} from '../../components/core';
import {useSelector} from 'react-redux';
import {StateParams} from '../../store/reducers';
import moment from 'moment';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {CancelTokenSource} from 'axios';
import Moment from 'moment';
import analytics from '@segment/analytics-react-native';

export interface FilterSchema {
	shift_type?: string;
	shift_start_date?: any;
	shift_end_date?: any;
	radius?: any;
	warning_type?: string;
	// shiftHours?: any;
}

const initialValues: FilterSchema = {
	shift_type: '',
	shift_start_date: '',
	shift_end_date: '',
	warning_type: '',
	// shiftHours: '',
};

const LOCATION = CommonFunctions.isAndroid()
	? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
	: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
const FindShiftsScreen = (props: any) => {
	const [search, setSearch] = useState('');
	const [currentSelectedMarker, setCurrentSelectedMarker] = useState<
		any | null
	>(null);
	const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
	const [facilityMapList, setFacilityMapList] = useState<null | []>(null);
	const [facilityListView, setFacilityListView] = useState<null | []>(null);
	const [facilityImageUrl, setFacilityImageUrl]: any = useState();
	const [facilityImageUrlLoading, setFacilityImageUrlLoading] = useState(true);
	const [facilityImageUrlLoaded, setFacilityImageUrlLoaded] = useState(false);
	const [isLoading, setIsLoading]: any = useState(true);
	const [isLoaded, setIsLoaded]: any = useState(false);
	const navigation = props.navigation;

	const {hcp_type} = useSelector(
		(state: StateParams) => state.hcpDetails.HcpUser,
	);
	const dimensions = useWindowDimensions();
	const mapRef = useRef<MapView>(null);
	const {hcpDetails} = useSelector((state: StateParams) => state);
	const {HcpUser} = hcpDetails;

	const cancelTokenRef = useRef<CancelTokenSource | null>(null);

	let date = new Date();
	const curDate = moment(date).format('YYYY-MM-DD');

	const [currentLocation, setCurrentLocation] = useState<GeoCoordinates | null>(
		null,
	);

	const getFacilityMapList = useCallback(
		(hcpType = hcp_type, search = '', payloadFilter = {}) => {
			setIsLoading(true);

			const payload = {
				// shift_start_date: curDate,
				// shift_end_date: curDate,
				...payloadFilter,
				new_shifts: curDate,
				hcp_type: hcp_type,
				search: search,
				regions: [HcpUser.address.region],
				coordinates: [currentLocation?.longitude, currentLocation?.latitude],
				is_active: true,
			};
			console.log('map list payload', payload);

			if (cancelTokenRef.current) {
				cancelTokenRef.current?.cancel();
			}
			const cancelToken = CommonFunctions.getCancelToken();
			cancelTokenRef.current = cancelToken;
			ApiFunctions.post(
				ENV.apiUrl + 'facility/mapList',
				payload,
				{},
				{cancelToken: cancelToken.token},
			)
				.then(async resp => {
					if (resp) {
						let docs = resp.data || null;
						setFacilityMapList(docs);
						const markersList: {latitude: any; longitude: any}[] | undefined =
							[];
						docs?.forEach((item: any) => {
							if (item.location && item.location.coordinates) {
								markersList.push({
									latitude: item.location.coordinates[1],
									longitude: item.location.coordinates[0],
								});
							}
						});
						if (markersList && markersList.length > 0) {
							mapRef.current?.fitToCoordinates(markersList);
						}
					} else {
						Alert.alert('Error', resp);
						setFacilityMapList(null);
					}
					setIsLoading(false);
					setIsLoaded(true);
				})
				.catch((err: any) => {
					setIsLoading(false);
					setIsLoaded(true);
					setFacilityMapList(null);
					console.log(err, 'API Error in catch');
				});
		},
		[
			HcpUser.address.region,
			curDate,
			currentLocation?.latitude,
			currentLocation?.longitude,
			hcp_type,
		],
	);

	const getFacilityListView = useCallback(
		(search = '') => {
			setIsLoading(true);

			const payload = {
				new_shifts: curDate,
				shift_requirements: true,
				hcp_type: hcp_type,
				search: search,
				regions: [HcpUser.address.region],
				coordinates: [currentLocation?.longitude, currentLocation?.latitude],
				is_active: true,
			};
			console.log('mobile list payload', payload);

			let coordinates = [currentLocation?.longitude, currentLocation?.latitude];

			ApiFunctions.post(ENV.apiUrl + 'facility/mobileList', payload)
				.then(async resp => {
					if (resp) {
						let docs = resp.data || null;
						setFacilityListView(docs);
					} else {
						Alert.alert('Error', resp);
					}
					setIsLoading(false);
					setIsLoaded(true);
				})
				.catch((err: any) => {
					setIsLoading(false);
					setIsLoaded(true);
					console.log(err);
				});
		},
		[
			curDate,
			hcp_type,
			HcpUser.address.region,
			currentLocation?.longitude,
			currentLocation?.latitude,
		],
	);

	const COUNT_ABBRS = ['', 'K'];

	function formatDistanceCount(count: any, withAbbr = false, decimals = 2) {
		const i =
			count === 0 ? count : Math.floor(Math.log(count) / Math.log(1000));
		let result: any = parseFloat((count / Math.pow(1000, i)).toFixed(decimals));
		if (withAbbr) {
			result += `${COUNT_ABBRS[i]}`;
		}
		return result;
	}

	const facilityFilter = useCallback(
		(values: FilterSchema, formikHelpers: FormikHelpers<FilterSchema>) => {
			formikHelpers.setSubmitting(true);
			setFilterOutModalVisible(false);
			const payload = {
				...values,
			};

			const payloadFilter = JSON.parse(JSON.stringify(payload), (key, value) =>
				value === null || value === '' ? undefined : value,
			);

			if (payloadFilter.shift_type) {
				analytics.track('Map Filters Shift Type Selected', {
					shiftType: payloadFilter.shift_type,
				});
			}
			if (payloadFilter.warning_type) {
				analytics.track('Map Filters Warning Type Selected', {
					warningType: payloadFilter.warning_type,
				});
			}

			formikHelpers.setSubmitting(false);
			setCurrentSelectedMarker(null);
			// getFacilityMapList(hcp_type, search, payloadFilter);
		},
		[getFacilityMapList, hcp_type, search],
	);

	useEffect(() => {
		const focusListener = navigation.addListener('focus', getFacilityMapList);
		return () => {
			focusListener();
		};
	}, [getFacilityMapList, navigation]);

	useEffect(() => {
		if (hcp_type) {
			getFacilityMapList(hcp_type);
			getFacilityListView();
		}
	}, [
		getFacilityMapList,
		getFacilityListView,
		hcp_type,
		viewMode,
		currentLocation,
	]);

	const getFacilityImage = useCallback(facilityID => {
		setFacilityImageUrlLoading(true);
		ApiFunctions.get(ENV.apiUrl + 'facility/' + facilityID)
			.then(resp => {
				if (resp && resp.success) {
					setFacilityImageUrl(resp.data);
				} else {
					Alert.alert('Error', resp.error);
				}
				setFacilityImageUrlLoading(false);
				setFacilityImageUrlLoaded(true);
			})
			.catch((err: any) => {
				setFacilityImageUrlLoading(false);
				setFacilityImageUrlLoaded(true);
				console.log(err);
				// Alert.alert('Error', err.error || 'Oops... Something went wrong!');
			});
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					style={{
						flex: 1,
						marginRight: 24,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<CustomButton
						icon={
							viewMode === 'list' ? (
								<ImageConfig.mapIcon
									color={Colors.textLight}
									style={{
										borderRadius: 100,
										marginLeft: 10,
									}}
									height={'15'}
									width={'15'}
								/>
							) : (
								<ImageConfig.listIcon
									color={Colors.textLight}
									style={{
										borderRadius: 100,
										marginLeft: 10,
									}}
									height={'15'}
									width={'15'}
								/>
							)
						}
						iconPosition="right"
						onPress={() => {
							setViewMode(prevState => (prevState === 'map' ? 'list' : 'map'));
							if (viewMode === 'list') {
								analytics.screen('Find Shift - List View Screen Opened');
							} else {
								analytics.screen('Find Shift - Map View Screen Opened');
							}
						}}
						style={{
							flex: 0,
							borderRadius: 8,
							marginVertical: 0,
							height: 30,
							backgroundColor: Colors.backgroundShiftColor,
							alignItems: 'center',
						}}
						title={viewMode === 'list' ? 'Map View' : 'List View'}
						class={'secondary'}
						textStyle={{color: Colors.primary, textTransform: 'none'}}
					/>
				</TouchableOpacity>
			),
		});
	}, [navigation, viewMode]);

	const getItem = useCallback(
		(item: any) => {
			navigation.navigate(NavigateTo.FacilityShiftPreviewScreen, {
				facilityID: item._id,
				facilityName: item.facility_name,
				item: item,
			});
		},
		[navigation],
	);

	const [hasLocationPermission, setHasLocationPermission] = useState(false);
	const [accessText, setAccessText] = useState('');
	const getCurrentLocation = useCallback(() => {
		request(LOCATION)
			.then(result => {
				console.log(result, '><<><<<<><><');
				setHasLocationPermission(result === RESULTS.GRANTED);
				let errText = '';
				switch (result) {
					case RESULTS.UNAVAILABLE:
						errText =
							'This feature is not available (on this device / in this context)';
						break;
					case RESULTS.DENIED:
						errText =
							'The permission has not been requested / is denied but requestable';
						break;
					case RESULTS.GRANTED:
						errText = 'The permission is granted';
						Geolocation.getCurrentPosition(
							position => {
								console.log('position>>>>>>>>>>', position);
								setCurrentLocation(position.coords);
							},
							error => {
								// See error code charts below.
								console.log(error.code, error.message);
							},
							{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
						);
						break;
					case RESULTS.BLOCKED:
						errText = 'The permission is denied and not requestable anymore';
						break;
				}
				setAccessText(errText);
			})
			.catch(err => console.log(err));
	}, []);
	useEffect(() => {
		getCurrentLocation();
	}, [getCurrentLocation]);

	const [filterModalVisible, setFilterOutModalVisible] = useState(false);

	const modalFilter = () => {
		return (
			<View style={styles.ModalContainer}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={filterModalVisible}
					onRequestClose={() => {
						setFilterOutModalVisible(!filterModalVisible);
					}}>
					<ScrollView style={{flex: 1, backgroundColor: '#F6FEFB'}}>
						<View style={[styles.centeredView]}>
							<View style={[styles.formBlock]}>
								<View style={[styles.formHolder]}>
									<Formik
										onSubmit={facilityFilter}
										// validationSchema={filterSchema}
										validateOnBlur={true}
										initialValues={initialValues}>
										{({
											handleSubmit,
											resetForm,
											values,
											isValid,
											setFieldValue,
											isSubmitting,
										}) => (
											<View>
												<View
													style={{
														flexDirection: 'row',
														justifyContent: 'space-between',
														paddingHorizontal: 10,
													}}>
													<View>
														<Text
															style={{
																fontFamily: FontConfig.primary.semiBold,
																fontSize: 18,
															}}>
															Filter
														</Text>
													</View>
													<View
														style={{
															width: '28%',
														}}>
														<CustomButton
															class="secondary"
															style={{
																flex: 0,
																borderRadius: 8,
																marginVertical: 0,
																height: 30,
																backgroundColor: '#F6FEFB',
															}}
															textStyle={{
																textTransform: 'none',
																fontFamily: FontConfig.primary.semiBold,
																fontSize: 12,
																color: Colors.primary,
															}}
															title={'Clear all'}
															onPress={() => {
																resetForm({
																	values: {
																		...initialValues,
																	},
																});
															}}
														/>
													</View>
												</View>
												<View
													style={[styles.horizontalRule, {marginTop: 15}]}
												/>
												<View style={{}}>
													<Field name={'shift_type'}>
														{(field: FieldProps) => (
															<FormikRadioGroupComponent
																formikField={field}
																labelDarkText={'Shift Type:'}
																textStyle={{
																	color: Colors.primary,
																}}
																style={{
																	height: 80,
																}}
																labelStyle={{
																	margin: 0,
																}}
																radioButtons={[
																	{
																		id: 'AM-12',
																		title: 'AM-12',
																	},
																	{
																		id: 'AM',
																		title: 'AM',
																	},
																	{
																		id: 'NOC',
																		title: 'NOC',
																	},
																	{
																		id: 'PM-12',
																		title: 'PM-12',
																	},
																	{
																		id: 'PM',
																		title: 'PM',
																	},
																]}
																direction={'row'}
															/>
														)}
													</Field>
													<View
														style={[
															styles.horizontalRule,
															{marginVertical: 10},
														]}
													/>
													<View
														style={{
															flexDirection: 'row',
															justifyContent: 'space-between',
														}}>
														<Field name={'shift_start_date'}>
															{(field: FieldProps) => (
																<FormikDatepickerComponent
																	formikField={field}
																	minDate={Moment().format('YYYY-MM-DD')}
																	maxDate={Moment()
																		.add(2, 'month')
																		.format('YYYY-MM-DD')}
																	labelDarkText={'Start Date'}
																	style={{
																		width: '90%',
																	}}
																/>
															)}
														</Field>
														<Field name={'shift_end_date'}>
															{(field: FieldProps) => (
																<FormikDatepickerComponent
																	formikField={field}
																	maxDate={Moment()
																		.add(2, 'month')
																		.format('YYYY-MM-DD')}
																	minDate={
																		values.shift_start_date &&
																		values.shift_start_date.length > 0
																			? Moment(values.shift_start_date).format(
																					'YYYY-MM-DD',
																			  )
																			: Moment().format('YYYY-MM-DD')
																	}
																	labelDarkText={'End Date'}
																	style={{
																		width: '90%',
																	}}
																/>
															)}
														</Field>
													</View>
													<View
														style={[
															styles.horizontalRule,
															{marginVertical: 10},
														]}
													/>
													<Field name={'radius'}>
														{({field}: FieldProps) => (
															<>
																<SliderComponent
																	minValue={0}
																	value={field.value === true ? 0 : field.value}
																	onChange={val => {
																		setFieldValue(field.name, val);
																	}}
																	maxValue={100}
																	step={1}
																	headerStyle={styles.headerStyle}
																	wrapperStyle={styles.wrapperStyle}
																/>
															</>
														)}
													</Field>
													<View
														style={[
															styles.horizontalRule,
															{marginVertical: 10},
														]}
													/>
													<Field name={'warning_type'}>
														{(field: FieldProps) => (
															<FormikRadioGroupComponent
																formikField={field}
																labelDarkText={'Warning Zone:'}
																style={{
																	height: 40,
																}}
																labelStyle={{
																	margin: 0,
																}}
																radioButtons={[
																	{
																		id: 'red',
																		title: 'Red',
																	},
																	{
																		id: 'green',
																		title: 'Green',
																	},
																	{
																		id: 'yellow',
																		title: 'Yellow',
																	},
																]}
																direction={'row'}
															/>
														)}
													</Field>
													<View
														style={[
															styles.horizontalRule,
															{marginVertical: 10},
														]}
													/>
													{/* <Field name={'shiftHours'}>
														{(field: FieldProps) => (
															<FormikRadioGroupComponent
																formikField={field}
																labelDarkText={'Shift Hours:'}
																style={{
																	height: 40,
																}}
																labelStyle={{
																	margin: 0,
																}}
																radioButtons={[
																	{
																		id: '8',
																		title: '8 Hrs',
																	},
																	{
																		id: '12',
																		title: '12 Hrs',
																	},
																]}
																direction={'row'}
															/>
														)}
													</Field>
													<View
														style={[
															styles.horizontalRule,
															{marginVertical: 10},
														]}
													/> */}
												</View>
												<View
													style={{
														flexDirection: 'row',
														marginHorizontal: 10,
														justifyContent: 'space-between',
														marginTop: 10,
													}}>
													<CustomButton
														title={'Cancel'}
														onPress={() => {
															setFilterOutModalVisible(!filterModalVisible);
														}}
														style={{
															height: 40,
															width: '45%',
															borderColor: Colors.primary,
														}}
														textStyle={{
															color: Colors.textOnAccent,
														}}
														class="secondary"
													/>
													<CustomButton
														isLoading={isSubmitting}
														title={'Apply'}
														onPress={() => {
															const formValues = {
																...values,
															};
															if (
																formValues.shift_start_date &&
																!formValues.shift_end_date
															) {
																ToastAlert.show(
																	'Both Start Date and End Date needs to be selected',
																);
															} else if (
																!formValues.shift_start_date &&
																formValues.shift_end_date
															) {
																ToastAlert.show(
																	'Both Start Date and End Date needs to be selected',
																);
															} else {
																handleSubmit();
															}
														}}
														style={{width: '45%', height: 40}}
													/>
												</View>
											</View>
										)}
									</Formik>
								</View>
							</View>
						</View>
					</ScrollView>
				</Modal>
			</View>
		);
	};

	return (
		<>
			<KeyboardAvoidCommonView
				style={{backgroundColor: Colors.backgroundShiftColor, flex: 0}}>
				<View
					style={[
						styles.searchBarContainer,
						{justifyContent: 'space-between'},
					]}>
					<ImageConfig.IconSearch width={20} height={20} />
					<TextInput
						style={[
							// styles.textInputStyle,
							{
								color: Colors.textLight,
								height: 40,
								paddingLeft: 20,
								backgroundColor: '#ffffff',
								width: '80%',
								borderRadius: 5,
								fontFamily: FontConfig.primary.bold,
								fontSize: 18,
								padding: 5,
							},
						]}
						onChangeText={text => {
							setSearch(text);
							getFacilityMapList(hcp_type, text);
							getFacilityListView(text);
							analytics.track('Searched Facility', {
								facilitySearchedName: text,
							});
						}}
						value={search}
						underlineColorAndroid="transparent"
						placeholder="Search Here"
						selectionColor="#4FE6AF"
						placeholderTextColor={Colors.textLight}
					/>
					<TouchableOpacity
						onPress={() => {
							setSearch('');
							getFacilityMapList(hcp_type, '');
							getFacilityListView('');
						}}>
						<ImageConfig.CloseIconModal width={18} height={18} />
					</TouchableOpacity>
				</View>
			</KeyboardAvoidCommonView>
			{isLoading && (
				<View
					style={{
						position: 'absolute',
						top: 45,
						zIndex: 2,
						left: 0,
						width: dimensions.width,
						height: dimensions.height - 120,
						backgroundColor: '#FFFFFF80',
					}}>
					<LoadingComponent backgroundColor={Colors.transparent} />
				</View>
			)}

			{viewMode === 'map' && (
				<>
					<TouchableOpacity
						onPress={() => {
							setFilterOutModalVisible(!filterModalVisible);
							analytics.track('Map Filters Opened');
						}}
						style={[
							styles.iconFilterContainer,
							{
								position: 'absolute',
								bottom: currentSelectedMarker ? 300 : 70,
								right: 10,
							},
						]}>
						<ImageConfig.IconFilter height={'15'} width={'15'} />
					</TouchableOpacity>
					{modalFilter()}
					<View
						style={[
							styles.container,
							{width: dimensions.width, height: dimensions.height - 180},
						]}>
						{!hasLocationPermission && (
							<View>
								<Text>{accessText}</Text>
							</View>
						)}
						{!!currentLocation && (
							<>
								<MapView
									onMapReady={() => {
										console.log('Ready');
									}}
									mapPadding={{left: 40, top: 40, right: 40, bottom: 40}}
									ref={mapRef}
									onRegionChange={region => {
										// console.log(region, 'region');
									}}
									provider={PROVIDER_GOOGLE} // remove if not using Google Maps
									style={[
										styles.map,
										{width: dimensions.width, height: dimensions.height - 180},
									]}
									initialRegion={{
										latitude: currentLocation.latitude,
										longitude: currentLocation.longitude,
										latitudeDelta: 0.155,
										longitudeDelta: 0.155,
									}}>
									{facilityMapList &&
										(facilityMapList || []).map((facility: any, index) => {
											if (
												facility &&
												facility.location &&
												facility.location.coordinates
											) {
												return (
													<Marker
														image={
															currentSelectedMarker &&
															currentSelectedMarker._id === facility._id
																? ImageConfig.activeMarker
																: ImageConfig.marker
														}
														// pinColor={'red'}
														key={'marker-' + index}
														anchor={{x: 0.45, y: 0.14}}
														coordinate={{
															latitude: facility.location.coordinates[1],
															longitude: facility.location.coordinates[0],
														}}
														onPress={() => {
															if (
																currentSelectedMarker &&
																currentSelectedMarker._id === facility._id
															) {
																return;
															}
															setCurrentSelectedMarker(facility);
															getFacilityImage(facility._id);
														}}
														style={{
															// flex: 1,
															// backgroundColor: 'red',
															justifyContent: 'center',
															alignItems: 'center',
															alignContent: 'center',
															width: 44,
															height: 47,
														}}
														title={facility.name}>
														<Text
															style={{
																fontFamily: FontConfig.primary.bold,
																color: '#FFF',
															}}>
															{facility.requirements_count || 0}
														</Text>
													</Marker>
												);
											}
										})}
								</MapView>
								{!facilityImageUrlLoading &&
									facilityImageUrlLoaded &&
									!facilityImageUrl && <ErrorComponent />}
								{currentSelectedMarker &&
									!facilityImageUrlLoading &&
									facilityImageUrlLoaded &&
									facilityImageUrl && (
										<View style={styles.cardContainer}>
											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
												}}>
												<View
													style={{
														width: '65%',
													}}>
													<Text style={styles.cardFacilityTitleText}>
														{currentSelectedMarker.facility_name}
													</Text>
													<View
														style={{
															flexDirection: 'row',
															alignItems: 'center',
														}}>
														<ImageConfig.LocationIconDarkGray
															width={20}
															height={20}
														/>
														<Text style={styles.cardFacilityAddressText}>
															{currentSelectedMarker.address.street + ' '},
															{' ' + currentSelectedMarker.address.city + ' '},
															{' ' + currentSelectedMarker.address.state + ' '},
															{' ' +
																currentSelectedMarker.address.zip_code +
																' '}
														</Text>
													</View>
												</View>
												<View
													style={{
														alignItems: 'flex-end',
													}}>
													<TouchableOpacity
														style={{
															backgroundColor: 'white',
															borderTopLeftRadius: 10,
															borderTopRightRadius: 10,
															padding: 5,
															position: 'absolute',
															top: -36,
															right: -10,
														}}
														onPress={() => {
															setCurrentSelectedMarker(null);
														}}>
														<ImageConfig.CloseIconModal
															height={'18'}
															width={'18'}
														/>
													</TouchableOpacity>
													<ImageBackground
														resizeMethod={'auto'}
														resizeMode={
															facilityImageUrl.image_url ? 'cover' : 'contain'
														}
														source={
															facilityImageUrl.image_url
																? {uri: facilityImageUrl.image_url}
																: ImageConfig.placeholder
														}
														style={[
															styles.dashMainItem,
															{backgroundColor: Colors.backdropColor},
														]}
													/>
												</View>
											</View>
											<View
												style={{
													height: 0.8,
													backgroundColor: '#C8C8C8',
													marginVertical: 20,
												}}
											/>
											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
													alignItems: 'center',
												}}>
												<View
													style={{
														flexDirection: 'row',
														alignItems: 'center',
													}}>
													<Text
														style={[
															styles.cardAvailableShiftsText,
															{
																fontSize: 14,
																marginRight: 4,
															},
														]}>
														Available Shifts
													</Text>
													<Text
														style={[
															styles.cardAvailableShiftsText,
															{
																fontSize: 24,
															},
														]}>
														{currentSelectedMarker.requirements_count || 0}
													</Text>
												</View>
												<CustomButton
													title={'View'}
													style={{
														height: 40,
														width: '35%',
														borderColor: Colors.primary,
													}}
													onPress={() => {
														getItem(currentSelectedMarker);
													}}
													textStyle={{
														color: Colors.textOnAccent,
													}}
													class="secondary"
												/>
											</View>
										</View>
									)}
							</>
						)}
					</View>
				</>
			)}
			{viewMode === 'list' && (
				<View style={{flex: 1}}>
					{!isLoading && isLoaded && !facilityListView && <ErrorComponent />}
					{!isLoading && isLoaded && facilityListView && (
						<>
							{facilityListView.length === 0 && (
								<ErrorComponent text={'No available shifts in your region'} />
							)}
							{facilityListView.length > 0 && (
								<FlatList
									data={facilityListView}
									keyExtractor={(item, index) => index.toString()}
									ItemSeparatorComponent={() => {
										return (
											<View
												style={{
													height: 0.5,
													backgroundColor: '#C8C8C8',
													marginHorizontal: 20,
												}}
											/>
										);
									}}
									renderItem={({item, index}: {item: any; index: number}) => {
										return (
											<View key={item.id + '_ ' + index}>
												<TouchableOpacity
													style={{
														marginHorizontal: 20,
														marginBottom: 15,
														marginTop: 15,
													}}
													onPress={() => getItem(item)}>
													<View>
														<View
															style={{
																alignItems: 'center',
																flexDirection: 'row',
															}}>
															<View style={styles.locationIcon}>
																<ImageConfig.LocationIconBlack
																	width={17}
																	height={17}
																/>
															</View>
															<Text style={[styles.itemStyle, {marginLeft: 5}]}>
																{item.facility_name}
															</Text>
														</View>

														<View
															style={{
																alignItems: 'center',
																flexDirection: 'row',
															}}>
															<View>
																<Text
																	numberOfLines={1}
																	style={{
																		width: 40,
																		fontFamily: FontConfig.primary.semiBold,
																		fontSize: 10,
																		color: Colors.textOnAccent,
																	}}>
																	{formatDistanceCount(
																		item.distance ? item.distance : '',
																		true,
																	)}{' '}
																	mi
																</Text>
															</View>
															<Text
																numberOfLines={1}
																ellipsizeMode={'tail'}
																style={{
																	fontFamily: FontConfig.primary.regular,
																	fontSize: 12,
																	color: Colors.textOnTextLight,
																	maxWidth: '90%',
																	marginLeft: 5,
																}}>
																{item.address.street + ' '},
																{' ' + item.address.city + ' '},
																{' ' + item.address.region_name + ' '},
																{' ' + item.address.state + ' '},
																{' ' + item.address.country + ' '},
																{' ' + item.address.zip_code + ' '}
															</Text>
														</View>
													</View>
												</TouchableOpacity>
											</View>
										);
									}}
								/>
							)}
						</>
					)}
				</View>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.backgroundShiftColor,
	},
	textInputStyle: {
		height: 40,
		paddingLeft: 20,
		backgroundColor: '#ffffff',
		width: '80%',
		borderRadius: 5,
		fontFamily: FontConfig.primary.bold,
		fontSize: 18,
	},
	itemStyle: {
		fontFamily: FontConfig.primary.bold,
		fontSize: 15,
		color: Colors.textDark,
		textTransform: 'capitalize',
	},
	searchBarContainer: {
		marginHorizontal: 20,
		marginBottom: 5,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1.5,
		borderColor: Colors.borderColor,
		borderRadius: 8,
		paddingHorizontal: 5,
		backgroundColor: '#ffffff',
	},
	locationIcon: {
		height: 30,
		width: 30,
		backgroundColor: Colors.backgroundShiftBoxColor,
		borderRadius: 500,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	container: {
		height: 400,
		width: 400,
		alignItems: 'center',
	},
	map: {},
	dashMainItem: {
		width: 70,
		height: 70,
	},

	// modal
	ModalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	centeredView: {
		flex: 1,
		// paddingVertical: 10,
	},
	horizontalRule: {
		height: 1,
		backgroundColor: Colors.horizontalLine,
	},
	headerStyle: {
		flex: 0,
		marginBottom: 5,
	},
	wrapperStyle: {
		paddingHorizontal: 0,
		marginTop: 5,
	},

	// form
	formBlock: {
		alignItems: 'center',
		marginVertical: 10,
	},
	formHolder: {
		marginHorizontal: 10,
	},

	// card
	cardContainer: {
		position: 'absolute',
		bottom: 20,
		...CommonFunctions.getElevationStyle(4),
		zIndex: 2,
		backgroundColor: '#fff',
		borderRadius: 4,
		width: '90%',
		paddingHorizontal: 10,
		paddingVertical: 10,
	},

	//
	iconFilterContainer: {
		zIndex: 2,
		backgroundColor: Colors.backgroundShiftColor,
		width: 37,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
		borderColor: Colors.primary,
		borderWidth: 1,
		borderRadius: 8,
	},
	//
	cardFacilityTitleText: {
		fontFamily: FontConfig.primary.bold,
		color: Colors.textDark,
		fontSize: 16,
		marginVertical: 10,
	},
	cardFacilityAddressText: {
		fontFamily: FontConfig.primary.regular,
		fontSize: 10,
		color: Colors.textOnTextLight,
		marginLeft: 10,
	},
	cardAvailableShiftsText: {
		fontFamily: FontConfig.primary.bold,
		color: Colors.textOnAccent,
	},
});

export default FindShiftsScreen;
