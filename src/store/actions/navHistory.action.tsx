export const NAVHISTORY = 'NAVHISTORY';

export const updateNavHistory = (navHistory: string) => {
	return {type: NAVHISTORY, navHistory};
};
