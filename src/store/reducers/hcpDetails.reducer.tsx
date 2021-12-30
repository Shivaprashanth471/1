import {HCPDETAILS} from '../actions/hcpDetails.action';
import {Communications, localStorage} from '../../helpers';

export interface HcpDetailsParams {
	HcpUser?: any;
}

const initialData: HcpDetailsParams = {
	HcpUser: undefined,
};

const hcpDetailsReducer = (
	state = initialData,
	action: any,
): HcpDetailsParams => {
	switch (action.type) {
		case HCPDETAILS:
			state = {...state, HcpUser: action.HcpUser};
			localStorage.setItem('hcpDetailsData', action);

			// Communications.updateLoginUserTokenSubject.next(action.token);
			return state;
		default:
			return state;
	}
};

export default hcpDetailsReducer;
