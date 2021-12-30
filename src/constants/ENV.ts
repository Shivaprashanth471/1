import Config from 'react-native-config';
import {Platform} from 'react-native';

export interface ENVTypes {
	apiUrl: string;
	oneSignalKey: string;
	segmentKey: string;
	googleMapKey: string;
	mode: string;
	buildType: string;
}

console.log(Config, 'Config; ');
const ENV: ENVTypes = {
	apiUrl: Config.API_URL, //'https://test.api.vitawerks.com/'
	segmentKey: Config.SEGMENT_KEY,
	googleMapKey:
		Platform.OS === 'ios'
			? Config.GOOGLEMAPS_IOS_KEY
			: Config.GOOGLEMAPS_ANDROID_KEY,
	buildType: Config.BUILD_TYPE,
	oneSignalKey: Config.ONESIGNAL_KEY,
	mode: Config.DEBUG ? 'debug' : 'release',
};

// full common url including host/api/
export default ENV;
