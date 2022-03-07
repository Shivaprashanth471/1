import {combineReducers} from 'redux';
import authReducer, {AuthParams} from './auth.reducer';
import hcpDetailsReducer, {HcpDetailsParams} from './hcpDetails.reducer';

export interface StateParams {
	auth: AuthParams;
	hcpDetails: HcpDetailsParams;
}

const rootReducer = combineReducers({
	auth: authReducer,
	hcpDetails: hcpDetailsReducer,
});

export default rootReducer;
