import {HCPDETAILS, NAVHISTORY} from '../actions/hcpDetails.action';
import {Communications, localStorage} from '../../helpers';

export interface HcpDetailsParams {
	HcpUser?: any;
	navHistory?: any;
}

const initialData: HcpDetailsParams = {
	HcpUser: undefined,
	navHistory: '',
};

const hcpDetailsReducer = (
	state = initialData,
	action: any,
): HcpDetailsParams => {
	switch (action.type) {
		case HCPDETAILS:
			state = {...state, HcpUser: action.HcpUser};
			localStorage.setItem('hcpDetailsData', action);
			console.log('state reducer', state.HcpUser);

			// Communications.updateLoginUserTokenSubject.next(action.token);
			return state;
		case NAVHISTORY:
			state = {...state, navHistory: action.navHistory};
			localStorage.setItem('NavHistoryData', action);
			console.log('NavHistory reducer', state.navHistory);
			return state;
		default:
			return state;
	}
};

export default hcpDetailsReducer;
