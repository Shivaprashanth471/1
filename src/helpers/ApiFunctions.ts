import axios, {
	AxiosAdapter,
	AxiosBasicCredentials,
	AxiosProxyConfig,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosTransformer,
	CancelToken,
	ResponseType,
} from 'axios';
import * as Communications from './Communications';
import CommonFunctions from './CommonFunctions';
import {ENV} from '../constants';
import * as localStorage from './localStorage';

export const defaultHeaders = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};

export const defaultOptions = {};
const isHardLocal = false;
let runMock = false;
let jwtToken: string | undefined;

if (isHardLocal) {
	jwtToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYwM2U4YmJlOTcyMjhhN2NmYjU4NjdiOCIsImZpcnN0TmFtZSI6ImFzZGYiLCJsYXN0TmFtZSI6InNkZmEiLCJwaG9uZU51bWJlciI6IjY3ODc4Nzg3ODciLCJlbWFpbCI6ImFAZ21haWwuY29tIiwicm9sZSI6ImNvbnN1bHRhbnQiLCJwb3NJZCI6IjYwM2U4YmJlOWUwODNjODI1ZDRiNGZiZiIsImV4cCI6MTYxNTU5ODkyNX19.m-0fr_FqWPInNdaZU_ZQqwMnCKkBg99ZTfg63OclPGA';
	localStorage.setItem('userData', {user: {}, token: jwtToken});
}
Communications.updateLoginUserTokenSubject.subscribe(token => {
	if (!isHardLocal) {
		jwtToken = token;
	}
});
// Communications.updateMockRunSubject.subscribe((isMock) => {
//   if (!isHardLocal) {
//     runMock = isMock;
//     const isMockRaw = isMock ? '1' : '0';
//     localStorage.setItem('isMock', isMockRaw);
//   }
// });

const getHeaders = (headers: any) => {
	const Authorization = CommonFunctions.getAuthHeader(jwtToken || '');
	headers = {
		...defaultHeaders,
		...Authorization,
		...headers,
	};
	return headers;
};

const getPayload = (payload: any | FormData, isFormData = false) => {
	if (isFormData) {
		// payload.append('active_user_id', activeUserId);
		return payload;
	} else {
		return {...payload};
	}
};
export interface PaginationResponseType<T> {
	docs?: T[];
	total: number;
	limit: number;
	page: number;
}
export interface PaginationType {
	total: number;
	limit: number;
	page: number;
}
export interface TSAPIResponseType<T> {
	success: boolean;
	data: T;
	msg?: string;
	error?: string;
	email?: any[];
	errors?: any[];
}

export interface AxiosOptions {
	transformRequest?: AxiosTransformer | AxiosTransformer[];
	transformResponse?: AxiosTransformer | AxiosTransformer[];
	paramsSerializer?: (params: any) => string;
	timeout?: number;
	timeoutErrorMessage?: string;
	withCredentials?: boolean;
	adapter?: AxiosAdapter;
	auth?: AxiosBasicCredentials;
	responseType?: ResponseType;
	xsrfCookieName?: string;
	xsrfHeaderName?: string;
	maxContentLength?: number;
	validateStatus?: ((status: number) => boolean) | null;
	maxBodyLength?: number;
	maxRedirects?: number;
	socketPath?: string | null;
	httpAgent?: any;
	httpsAgent?: any;
	proxy?: AxiosProxyConfig | false;
	cancelToken?: CancelToken;
	decompress?: boolean;
}

export default {
	post: (
		url: string,
		payload = {},
		headers = {},
		options: AxiosOptions = {},
		progressCallback: (progress: number) => void = () => {},
	): Promise<TSAPIResponseType<any>> => {
		const axiosOptions: AxiosRequestConfig = {
			headers: getHeaders(headers),
			...options,
			onUploadProgress: uploadProgressHandler.bind(null, progressCallback),
		};
		payload = getPayload(payload);
		url = interceptUrl(url);
		// console.log(payload,getHeaders(headers),url, 'payload, headers, url');
		console.log(payload, url, axiosOptions, 'payload, post, url, axiosOptions');
		let request = axios.post(url, payload, axiosOptions);
		return getRequestPromise(request);
	},
	patch: (
		url: string,
		payload = {},
		headers = {},
		options: AxiosOptions = {},
		progressCallback: (progress: number) => void = progress => {},
	): Promise<TSAPIResponseType<any>> => {
		const axiosOptions: AxiosRequestConfig = {
			headers: getHeaders(headers),
			...options,
			method: 'OPTIONS',
		};
		payload = getPayload(payload);
		let request = axios.patch(url, payload, axiosOptions);
		return getRequestPromise(request);
	},
	upload: (
		url: string,
		payload = {},
		headers = {},
		options: AxiosOptions = {},
		progressCallback: (progress: number) => void = () => {},
	): Promise<TSAPIResponseType<any>> => {
		const axiosOptions: AxiosRequestConfig = {
			headers: getHeaders(headers),
			...options,
			method: 'PUT',
			onUploadProgress: uploadProgressHandler.bind(null, progressCallback),
		};
		payload = getPayload(payload, true);
		url = interceptUrl(url);
		console.log(payload, url, axiosOptions, 'payload, upload, url');
		let request = axios.put(url, payload, axiosOptions);
		console.log('APi Generated', url);
		return getRequestPromise(request);
	},
	put: (
		url: string,
		payload = {},
		headers = {},
		options: AxiosOptions = {},
		progressCallback: (progress: number) => void = () => {},
	): Promise<TSAPIResponseType<any>> => {
		const axiosOptions: AxiosRequestConfig = {
			headers: getHeaders(headers),
			...options,
			method: 'PUT',
			onUploadProgress: uploadProgressHandler.bind(null, progressCallback),
		};
		payload = getPayload(payload);
		url = interceptUrl(url);
		console.log(payload, url, 'payload,put, url');
		let request = axios.put(url, payload, axiosOptions);
		return getRequestPromise(request);
	},
	get: (
		url: string,
		payload = {},
		headers = {},
		options: AxiosOptions = {},
	): Promise<TSAPIResponseType<any>> => {
		const axiosOptions: AxiosRequestConfig = {
			headers: getHeaders(headers),
			params: getPayload(payload),
			method: 'GET',
			...options,
		};
		url = interceptUrl(url);
		console.log(
			payload,
			url,
			axiosOptions.headers,
			'payload, get, url, headers',
		);

		let request = axios.get(url, axiosOptions);
		return getRequestPromise(request);
	},
	delete: (
		url: string,
		payload = {},
		headers = {},
		options: AxiosOptions = {},
	): Promise<TSAPIResponseType<any>> => {
		// options = getParsedOptions(headers, options);
		const axiosOptions: AxiosRequestConfig = {
			headers: getHeaders(headers),
			data: getPayload(payload),
			method: 'DELETE',
			...options,
		};
		// url = getParsedParams(url, payload);
		console.log(payload, url, 'payload,delete, url');
		let request = axios.delete(url, axiosOptions);

		return getRequestPromise(request);
	},
};

const uploadProgressHandler = (
	progressCallback: (progress: number) => void,
	progressEvent: any,
) => {
	if (progressCallback) {
		const percentFraction = progressEvent.loaded / progressEvent.total;
		const percent = Math.floor(percentFraction * 100);
		progressCallback(percent);
	}
};
const interceptUrl = (url: string) => {
	if (runMock) {
		if (isHardLocal) {
			url = url.replace('', '');
			return url.replace(ENV.apiUrl, 'http://192.168.0.143:3000/');
		}
		return url.replace(ENV.apiUrl, ENV.mockUrl);
	}
	return url;
};

const getRequestPromise = (request: Promise<AxiosResponse>) => {
	return new Promise<any>((resolve, reject) => {
		request
			.then(resp => {
				// console.log('\n====>>>>>>', resp.data, '<<<<<<<<<-=======\n');
				resolve({...resp.data, status: resp.status});
			})
			.catch((err: any) => {
				console.log(err ? err.response : err, 'API Error');
				try {
					const response: any = err.response ? err.response : {data: null};
					let error: any = response.data ? {...response.data} : {status: 500};
					error.status = response.status ? parseInt(response.status) : 500;
					if (error.status === 401) {
						Communications.logoutSubject.next();
					}
					reject(error);
				} catch (e) {
					console.log(e, 'Api Function Catch');
				}
			});
	});
};
