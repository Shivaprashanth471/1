import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
// @ts-ignore
import Chart from 'react-google-charts';

// console.log(process.env);
const test = () => {
	return (
		<div>
			<Chart
				width={'500px'}
				height={'300px'}
				chartType="PieChart"
				loader={<div>Loading Chart</div>}
				data={[
					['Task', 'Hours per Day'],
					['Work', 11],
					['Eat', 2],
					['Commute', 2],
					['Watch TV', 2],
					['Sleep', 7],
				]}
				options={{
					title: 'My Daily Activities',
				}}
				rootProps={{'data-testid': '1'}}
			/>
		</div>
	);
};

export default test;
