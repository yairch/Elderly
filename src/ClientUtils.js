import generator from 'generate-password';
import * as clientConfig from './constants/clientConfig';
// HTTPS=true;SSL_CRT_FILE=certificate.crt;SSL_KEY_FILE=privateKey.key
// exports.serverURL = 'http://132.72.23.153:8114';

const serverURL = clientConfig.serverURL;
const wssURL = clientConfig.webSocketURL;
const feedbackURL = 'https://forms.gle/mCABoh5EteuNEceH8';

const regexes = {
	hebrewEnglishRegex: /^[a-z\u0590-\u05fe -]+$/i,
	englishRegex: /^[a-z -]+$/i,
	emailRegex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	passwordRegex: /^.{8,}$/,
	usernameRegex: /^[0-9]{9}$/,
	phoneNumberRegex: /^[(]?[0-9]{2,3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/i,
	yearRegex: /^(19|20)\d{2}$/
};

const generatePassword = () =>
	generator.generate({
		length: 10,
		numbers: true,
		symbols: true,
		exclude: '/'
	});

const convertElderlyDetailsFromDB = function (records) {
	records = records.map((dic) => {
		return {
			userName: dic.userName,
			firstName: dic.firstName,
			lastName: dic.lastName,
			birthYear: dic.birthYear,
			city: dic.city,
			email: dic.email,
			gender: dic.gender,
			areasOfInterest: JSON.parse(dic.areasOfInterest),
			languages: JSON.parse(dic.languages),
			organizationName: dic.organizationName,
			genderToMeetWith: dic.genderToMeetWith,
			wantedServices: JSON.parse(dic.wantedServices),
			preferredDays: JSON.parse(dic.preferredDays),
			digitalDevices: JSON.parse(dic.digitalDevices),
			additionalInformation: dic.additionalInformation

		};
	});

	return records;
};

const convertVolunteerDetailsFromDB = function (records) {
	records = records.map((dic) => {
		return {
			userName: dic.userName,
			firstName: dic.firstName,
			lastName: dic.lastName,
			birthYear: dic.birthYear,
			city: dic.city,
			email: dic.email,
			gender: dic.gender,
			areasOfInterest: JSON.parse(dic.areasOfInterest),
			languages: JSON.parse(dic.languages),
			organizationName: dic.organizationName,
			services: JSON.parse(dic.services),
			preferredDays: JSON.parse(dic.preferredDays),
			digitalDevices: JSON.parse(dic.digitalDevices),
			additionalInformation: dic.additionalInformation
		};
	});

	return records;
};

const prettifyStringArray = (array) => {
	return array.toString().replaceAll(',', '\n');
};

// const filterMeetings = (meetings) => {
// 	let today = new Date();
// 	let yesterday = new Date(today);
// 	yesterday.setDate(yesterday.getDate() - 1);
// 	yesterday.setHours(23,59,59);

// 	return meetings.reduce((filteredMeetings, meeting) => {
// 		console.log("mm"+JSON.stringify(meeting));
// 		const day = parseInt(meeting.meetingDate.substring(0, 2));
// 		const month = parseInt(meeting.meetingDate.substring(3, 5));
// 		const year = parseInt(meeting.meetingDate.substring(6, 10));
// 		const hours = parseInt(meeting.meetingDate.substring(11, 13));
// 		const minutes = parseInt(meeting.meetingDate.substring(14, 15));
// 		let date = new Date(year, month - 1, day, hours, minutes);

// 		if (date >= yesterday) {
// 			filteredMeetings.push({...meeting, date: date});
// 		}

// 		return filteredMeetings;
// 	}, []);
// };

export {
	serverURL,
	wssURL,
	feedbackURL,
	regexes,
	generatePassword,
	convertElderlyDetailsFromDB,
	convertVolunteerDetailsFromDB,
	prettifyStringArray,
	// filterMeetings
};