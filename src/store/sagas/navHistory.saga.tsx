import {takeEvery} from 'redux-saga/effects';

import {NAVHISTORY} from '../actions/navHistory.action';

function* navHistoryDetails() {
	console.log('nav history saga');
}

export default function* navHistorySaga() {
	yield takeEvery(NAVHISTORY, navHistoryDetails);
}
