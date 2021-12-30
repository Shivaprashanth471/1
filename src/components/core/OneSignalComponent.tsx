import React, {useCallback, useEffect, useRef} from 'react';
import OneSignal from 'react-native-onesignal';
import {CommonFunctions, Communications} from '../../helpers';
import {Subscription} from 'rxjs/internal/Subscription';
import {ENV} from '../../constants';

const OneSignalComponent = () => {
	const myiOSPromptCallback = (permission: any) => {
		// do something with permission value
		console.log(permission, 'iOS Permissions');
	};
	const updateActiveUserIdSubscription = useRef<Subscription | null>(null);
	const setPushNotificationMap = useCallback((externalUserId: string) => {
		console.log(externalUserId, 'externalUserId');
		if (externalUserId) {
			OneSignal.setExternalUserId(externalUserId, () => {});
		} else {
			OneSignal.removeExternalUserId(() => {});
		}
	}, []);

	useEffect(() => {
		/* O N E S I G N A L   S E T U P */
		OneSignal.setAppId(ENV.oneSignalKey);
		OneSignal.setLogLevel(6, 0);
		OneSignal.setRequiresUserPrivacyConsent(false);

		if (CommonFunctions.isIOS()) {
			// The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
			OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);
		}

		/* O N E S I G N A L  H A N D L E R S */
		// OneSignal.setNotificationWillShowInForegroundHandler(
		//   (notifReceivedEvent) => {
		//     console.log(
		//       'OneSignal: notification will show in foreground:',
		//       notifReceivedEvent,
		//     );
		//     let notif = notifReceivedEvent.getNotification();
		//
		//     const button1 = {
		//       text: 'Cancel',
		//       onPress: () => {
		//         notifReceivedEvent.complete();
		//       },
		//       style: 'cancel',
		//     };
		//
		//     const button2 = {
		//       text: 'Complete',
		//       onPress: () => {
		//         notifReceivedEvent.complete(notif);
		//       },
		//     };
		//
		//     Alert.alert('Complete notification?', 'Test', [button1, button2], {
		//       cancelable: true,
		//     });
		//   },
		// );
		OneSignal.setNotificationOpenedHandler(notification => {
			if (ENV.mode === 'debug') {
				console.log('OneSignal: notification opened:', notification);
			}
		});
		OneSignal.setInAppMessageClickHandler(event => {
			if (ENV.mode === 'debug') {
				console.log('OneSignal IAM clicked:', event);
			}
		});
		OneSignal.addEmailSubscriptionObserver(event => {
			if (ENV.mode === 'debug') {
				console.log('OneSignal: email subscription changed: ', event);
			}
		});
		OneSignal.addSubscriptionObserver(event => {
			if (ENV.mode === 'debug') {
				console.log('OneSignal: subscription changed:', event);
			}
		});
		OneSignal.addPermissionObserver(event => {
			if (ENV.mode === 'debug') {
				console.log('OneSignal: permission changed:', event);
			}
		});
		OneSignal.getDeviceState().then(console.log);
		updateActiveUserIdSubscription.current =
			Communications.updateActiveUserIdSubject.subscribe(
				setPushNotificationMap,
			);
		return () => {
			updateActiveUserIdSubscription.current?.unsubscribe();
		};
	}, [setPushNotificationMap]);
	return <></>;
};

// const OneSignalComponent = () => {};

export default OneSignalComponent;
