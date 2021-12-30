import AsyncStorage from '@react-native-community/async-storage';

const setItem = (key: string, data: any = {}) => {
	let value = data;
	if (typeof data === 'object') {
		value = JSON.stringify(value);
	}
	return AsyncStorage.setItem(key, value);
};
const removeItem = (key: string) => {
	return AsyncStorage.removeItem(key);
};

const clearAll = () => {
	return new Promise<any>(async (resolve, reject) => {
		const asyncStorageKeys = await AsyncStorage.getAllKeys();
		if (asyncStorageKeys.length > 0) {
			AsyncStorage.clear().then(resolve).catch(reject);
		} else {
			resolve();
		}
	});
};
const getItem = (key: string) => {
	return AsyncStorage.getItem(key);
};
export {setItem, getItem, removeItem, clearAll};
