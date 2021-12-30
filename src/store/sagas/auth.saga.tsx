import {call, put, takeEvery} from 'redux-saga/effects';
import {
	LOGIN_CHECK,
	LOGIN_USER,
	LOGOUT_USER,
	updateLoginUser,
} from '../actions/auth.action';
import {ApiFunctions, Communications} from '../../helpers';
import {ENV} from '../../constants';

// LOGIN_USER
function* loginUser() {
	// console.log('login user ', action);
}

// LOGOUT_USER
function* logoutUser() {
	// console.log('logout user ',action);
}

// LOGOUT_USER
const fetchCheckLogin = () => {
	return ApiFunctions.get(ENV.apiUrl + 'account/checkLogin');
};

function* loginCheck() {
	try {
		const resp = yield call(fetchCheckLogin);
		yield put(updateLoginUser(resp.data));
	} catch (error) {
		Communications.logoutSubject.next(true);
	}
}

// use them in parallel
export default function* authSaga() {
	yield takeEvery(LOGIN_USER, loginUser);
	yield takeEvery(LOGIN_CHECK, loginCheck);
	yield takeEvery(LOGOUT_USER, logoutUser);
}
