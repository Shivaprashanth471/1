import {call, put, takeEvery} from 'redux-saga/effects';

import {HCPDETAILS} from '../actions/hcpDetails.action';

import {ApiFunctions, Communications} from '../../helpers';
import {ENV} from '../../constants';

function* hcpDetails() {
	// console.log('hcpDetailssaga>>>>>>>>>>>');
}

export default function* hcpDetailsSaga() {
	yield takeEvery(HCPDETAILS, hcpDetails);
}
