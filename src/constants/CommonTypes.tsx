export interface FileType {
	uri: string;
	type: string | undefined;
	name: string;
}

export interface requirementsList {
	_id: string;
	facility_id: string;
	requirement_owner_id: string;
	title: string;
	description: null;
	shift_date: string;
	shift_details: string;
	shift_timings: {
		start_time: string;
		end_time: string;
	};
	hcp_count: number;
	hcp_type: string;
	shift_type: string;
	status: string;
	is_active: boolean;
	is_published: boolean;
	price: {
		inbound_price: null;
		outbound_price: null;
	};
	warning_details: null;
	warning_type: string;
	created_at: string;
	updated_at: string;
	facility: {
		_id: string;
		facility_uid: string;
		facility_name: string;
		facility_short_name: string;
		business_name: string;
		email: string;
		phone_number: string;
		extension_number: string;
		website_url: string;
		address: {
			street: string;
			city: string;
			state: string;
			country: string;
			zip_code: string;
			region_name: string;
		};
		hourly_base_rates: {
			cna: null;
			lvn: null;
			rn: null;
			care_giver: null;
			med_tech: null;
			holiday: null;
			hazard: null;
		};
		diff_rates: {
			pm: null;
			noc: null;
			weekend: null;
		};
		conditional_rates: {
			overtime: {
				hours: null;
				rate: null;
			};
			rush: {
				hours: null;
				rate: null;
			};
			cancellation_before: {
				hours: null;
				rate: null;
			};
			shift_early_completion: {
				hours: null;
				rate: null;
			};
		};
		is_active: boolean;
		about: string;
		timezone: number;
		created_at: string;
		updated_at: string;
	};
}

export interface hcpShiftsList {
	_id: string;
	title: string;
	requirement_id: string;
	application_id: string;
	facility_id: string;
	hcp_user_id: string;
	approved_by: {
		first_name: string;
		last_name: string;
		email: string;
		role: string;
	};
	hcp_user: {
		first_name: string;
		last_name: string;
		email: string;
		gender: string;
		hcp_type: string;
		rate: number;
	};
	expected: {
		shift_duration_minutes: number;
		shift_end_time: string;
		shift_start_time: string;
	};
	is_cdhp_valid: false;
	is_shift_acknowledged_by_facility: false;
	inbound_payment_status: string;
	outbound_payment_status: string;
	payment_breakup_details: {};
	payments: {
		differential: number;
		hourly_hcp: number;
		hourly_ot: number;
	};
	shift_approved_by: null;
	time_breakup: {
		break_timings: [];
		check_in_time: string;
		check_out_time: string;
	};
	actuals: {
		shift_end_time: null;
		shift_start_time: null;
	};
	hcp_type: string;
	shift_type: string;
	shift_date: string;
	warning_details: null;
	warning_type: string;
	shift_status: string;
	is_in_break: false;
	cdhp_form_attachment: string;
	total_inbound_payment: number;
	total_outbound_payment: number;
	created_by: string;
	created_at: string;
	updated_at: string;
}

export interface facilityList {
	_id: string;
	facility_uid: string;
	facility_name: string;
	facility_short_name: string;
	business_name: string;
	email: string;
	phone_number: string;
	extension_number: string;
	website_url: string;
	address: {
		street: string;
		city: string;
		state: string;
		region_name: string;
		country: string;
		zip_code: string;
	};
	hourly_base_rates: {
		cna: null;
		lvn: null;
		rn: null;
		care_giver: null;
		med_tech: null;
		holiday: null;
		hazard: null;
	};
	diff_rates: {
		pm: null;
		noc: null;
		weekend: null;
	};
	conditional_rates: {
		overtime: {
			hours: null;
			rate: null;
		};
		rush: {
			hours: null;
			rate: null;
		};
		cancellation_before: {
			hours: null;
			rate: null;
		};
		shift_early_completion: {
			hours: null;
			rate: null;
		};
	};
	is_active: true;
	about: string;
	timezone: number;
	created_at: string;
	updated_at: string;
}
