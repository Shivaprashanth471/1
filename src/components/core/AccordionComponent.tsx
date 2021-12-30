import React, {PropsWithChildren, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

export interface AccordionComponentProps {
	header: Element;
	openIcon?: string;
	closeIcon?: string;
	isOpen?: boolean;
}

const AccordionComponent = (
	props: PropsWithChildren<AccordionComponentProps>,
) => {
	const {header, children, isOpen} = props;
	const [expand, setExpand] = useState(!!isOpen);
	// const openIcon = props.openIcon || 'chevron-down';
	// const closeIcon = props.closeIcon || 'chevron-up';
	return (
		<View style={styles.accordion}>
			<TouchableOpacity
				onPress={() => {
					setExpand(!expand);
				}}
				style={styles.accordionHeader}>
				<View style={{flex: 1}}>{header}</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					{/*{!expand && (*/}
					{/*  <IconComponent name={openIcon} size={26} color={Colors.textDark} />*/}
					{/*)}*/}
					{/*{expand && (*/}
					{/*  <IconComponent name={closeIcon} size={26} color={Colors.textDark} />*/}
					{/*)}*/}
				</View>
			</TouchableOpacity>
			<View style={styles.accordionBody}>{expand ? children : null}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	accordion: {
		// marginVertical: 5,
		// backgroundColor: Colors.backgroundColor,
		// borderWidth: 1,
		// borderColor: Colors.borderColor
	},

	accordionHeader: {
		// paddingVertical: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	accordionBody: {},
});

export default AccordionComponent;
