import {Subject} from 'rxjs';

const logoutSubject: Subject<any> = new Subject<any>();
const updateLoginUserTokenSubject: Subject<string> = new Subject<string>();
const updateActiveUserIdSubject: Subject<string> = new Subject<string>();
const NetworkChangeSubject: Subject<boolean> = new Subject<boolean>();
const ReloadStateSubject: Subject<boolean> = new Subject<boolean>();

export {
	logoutSubject,
	updateActiveUserIdSubject,
	updateLoginUserTokenSubject,
	NetworkChangeSubject,
	ReloadStateSubject,
};
