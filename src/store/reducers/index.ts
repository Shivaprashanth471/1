import {combineReducers} from 'redux';
import authReducer, {AuthParams} from './auth.reducer';
import hcpDetailsReducer, {HcpDetailsParams} from './hcpDetails.reducer';
import navHistoryReducer, {NavHistoryParams} from './navHistory.reducer';

export interface StateParams {
	auth: AuthParams;
	hcpDetails: HcpDetailsParams;
	navHistory: NavHistoryParams;
}

const rootReducer = combineReducers({
	auth: authReducer,
	hcpDetails: hcpDetailsReducer,
	navHistory: navHistoryReducer,
});

export default rootReducer;
