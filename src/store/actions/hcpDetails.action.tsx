export const HCPDETAILS = 'HCPDETAILS';

export const updateHcpDetails = (HcpUser: any) => {
	return {type: HCPDETAILS, HcpUser};
};
