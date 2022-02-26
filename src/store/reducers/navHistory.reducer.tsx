import {NAVHISTORY} from '../actions/navHistory.action';
import {localStorage} from '../../helpers';

export interface NavHistoryParams {
	NavHistory?: any;
}

const initialData: NavHistoryParams = {
	NavHistory: undefined,
};

const navHistoryReducer = (
	state = initialData,
	action: any,
): NavHistoryParams => {
	switch (action.type) {
		case NAVHISTORY:
			state = {...state, NavHistory: action.NavHistory};
			localStorage.setItem('NavHistoryData', action);
			console.log('NavHistory reducer', state);

			// Communications.updateLoginUserTokenSubject.next(action.token);
			return state;
		default:
			return state;
	}
};

export default navHistoryReducer;
