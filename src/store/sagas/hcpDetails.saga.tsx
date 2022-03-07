import {call, put, takeEvery} from 'redux-saga/effects';

import {HCPDETAILS, NAVHISTORY} from '../actions/hcpDetails.action';

import {ApiFunctions, Communications} from '../../helpers';
import {ENV} from '../../constants';

function* hcpDetails() {
	console.log('hcpDetailssaga>>>>>>>>>>>');
}

function* navHistoryDetails() {
	console.log('nav history saga');
}

export default function* hcpDetailsSaga() {
	yield takeEvery(HCPDETAILS, hcpDetails);
	yield takeEvery(NAVHISTORY, navHistoryDetails);
}
