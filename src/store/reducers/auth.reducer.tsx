import {
	LOGIN_USER,
	LOGOUT_USER,
	UPDATE_LOGIN_USER,
} from '../actions/auth.action';
import {Communications, localStorage} from '../../helpers';

export interface AuthParams {
	user?: any;
	token?: string;
}

const initialData: AuthParams = {
	user: undefined,
	token: undefined,
};
const authReducer = (state = initialData, action: any): AuthParams => {
	switch (action.type) {
		case LOGIN_USER:
			state = {...state, user: action.user, token: action.token};
			localStorage.setItem('userData', action);
			Communications.updateActiveUserIdSubject.next(action.user._id);
			Communications.updateLoginUserTokenSubject.next(action.token);
			return state;
		case UPDATE_LOGIN_USER:
			state = {...state, user: action.user};
			localStorage.setItem('userData', {user: action.user, token: state.token});
			Communications.updateActiveUserIdSubject.next(action.user._id);
			return state;
		case LOGOUT_USER:
			localStorage.removeItem('userData');
			state = {
				user: undefined,
				token: undefined,
			};
			Communications.updateLoginUserTokenSubject.next();
			Communications.updateActiveUserIdSubject.next();
			return state;
		default:
			return state;
	}
};

export default authReducer;
