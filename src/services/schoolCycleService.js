import { fetch_get, fetch_post } from './fetch';

export function createSchoolCycle(year, type, segments) {
	return fetch_post(`api/v1/school-cycle`, {year, segment_type: type, segments});
}

export function getSchoolCycles() {
	return fetch_get(`api/v1/school-cycle`);
}

export function getSchoolCycle(id) {
	return fetch_get(`api/v1/school-cycle/${id}`);
}

export function formatSegment(type, number) {
	return displayType(type) + ' ' + number;
}

export async function getCurrentOrNextSegment() {
	return fetch_get(`api/v1/school-cycle/segment`);
}

export function fill0Number(number) {
	if (number < 10) {
		return '0' + number;
	} else {
		return number + '';
	}
}

export function displayNumber(number) {
	switch (number) {
		case 2:
			return 'II';
		case 3:
			return 'III';
		case 4:
			return 'IV';
		default:
			return 'I';
	}
}

export function returnMesNumber(mes) {
	switch (mes) {
		case '12':
		case '11':
		case '10':
			return parseInt(mes);
		default:
			return parseInt(mes.replace('0', ''));
	}
}

export const numberType = (type) => (type === 'bimester' ? 0 : 1);

export const displayType = (type) => (type === 'bimester' ? 'Bimestre' : 'Trimestre');
