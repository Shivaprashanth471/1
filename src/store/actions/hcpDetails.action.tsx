export const HCPDETAILS = 'HCPDETAILS';
export const NAVHISTORY = 'NAVHISTORY';

export const updateHcpDetails = (HcpUser: any) => {
	return {type: HCPDETAILS, HcpUser};
};
export const updateNavHistory = (navHistory: string) => {
	return {type: NAVHISTORY, navHistory};
};
