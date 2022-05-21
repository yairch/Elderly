import { serverURL } from '../ClientUtils';
import { handleError } from './errorHandler';
import { UserRole } from '../types/user';

const loginCheck = async (username, password) => {
	const response = await fetch(serverURL + `/user/login`, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username,
			password
		})
	});
	handleError(response);

	return response.json();
};

const registerNotifications = async (username) => {
	const response = await fetch(serverURL + `/user/register-notifications`, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username
		})
	});

	handleError(response);
	return response;
};

const forgotPassword = async (userName, email) => {
	const response = await fetch(serverURL + `/user/forgot-password/` + new URLSearchParams({userName, email}), {
		method: 'post'
	});

	handleError(response);
	return response;
}

const tryLogin = async (username, password) => {
	const response = await fetch(serverURL + `/user/activate/` + new URLSearchParams({username, password}), {
		method: 'post'
	});

	handleError(response);
	return response;
};

const updatePassword = async (username, newPassword) => {
	await fetch(serverURL + `/user/updatePassword`, {
		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username,
			newPassword
		})
	});
};

const fetchOrganizationsNames = async () =>{
	const res = await fetch(`${serverURL}/admin/organizationNames`, {
		method: 'get',
		headers: {'Content-Type': 'application/json'}
	});
	const result = await res.json()
	console.log(result)
	return result
}

const fetchElderlyMatches = async (user) => {
	const response = await fetch(serverURL + `/responsible/assign`,
		{
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				volunteerUsername: user.userName,
				volunteerServices: user.services
			})
		});

	handleError(response);
	return response;
};

const registerElderly = async (state) => {
	const response = await fetch(serverURL + `/responsible/registerElderly`, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({...state})
	});

	handleError(response);
	return response;
};

const registerOrganization = async (state) => {
	const response = await fetch(serverURL + `/admin/registerOrganization`, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({...state})
	});

	handleError(response);
	return response;
};

const registerResponsible = async (state) => {
	const response = await fetch(serverURL + `/admin/registerResponsible`, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({...state})
	});

	handleError(response);
	return response;
};

export const getResponsible = async (username) => {
	const response = await fetch(serverURL + `/responsible/${username}`, {
		method: 'GET',
	});

	handleError(response);
	return response.json();
};

export const getVolunteer = async (username) => {
	const response = await fetch(serverURL + `/volunteer/${username}`, {
		method: 'GET',
	});

	handleError(response);
	return response.json();
};


const registerVolunteer = async (state) => {
	const response = await fetch(serverURL + `/responsible/registerVolunteer`, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({...state})
	});

	handleError(response);
	return response;
};

const fetchVolunteers = async (organizationName) => {
	if (!organizationName) {
		organizationName = 'NONE';
	}
	const response = await fetch(`${serverURL}/responsible/volunteersDetails/${organizationName}`,
		{
			method: 'get',
			headers: {'Content-Type': 'application/json'},
		});

	handleError(response);
	const result = await response.json()
	return result;
};

const addMeetingDB = async (state) => {
	const response = await fetch(serverURL + '/responsible/addMeeting', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({...state})
	});

	handleError(response);
	return response;
};

const fetchVolunteerOrganizationMeetings = async (organizationName) => {
	const response = await fetch(serverURL + `/responsible/meetings-volunteers/` + organizationName,
		{
			method: 'get'
		});

	handleError(response);
	const result = await response.json()
	return result;
};

const fetchElderlyOrganizationMeetings = async (organizationName) => {
	const response = await fetch(`${serverURL}/responsible/meetings-elderly/${organizationName}`,
		{
			method: 'get'
		});

	handleError(response);
	return response;
};

//volunteer - not used
// const getMeetingsVolunteer = async (volunteerUsername) => {
// 	const response = await fetch(`${serverURL}/volunteer/meetings/${volunteerUsername}`,
// 		{
// 			method: 'get'
// 		});
// 	const result = await response.json();
// 	console.log(result);
// 	handleError(response);
// 	return result;
// };

//volunteer - used
const getElderlyMeeting = async (volunteerUsername) => {
	const response = await fetch(`${serverURL}/volunteer/meetings/${volunteerUsername}`,
		{
			method: 'get'
		});
	const result = await response.json();
	// console.log(result); 
	handleError(response);
	return result;
};

const fetchAdjustmentPercentages = async (responsibleUsername) => {
	console.log(responsibleUsername);
	const response = await fetch(`${serverURL}/responsible/change-adjustment-percentages/${responsibleUsername}`,
		{
			method: 'get'
		});
	const result = await response.json();
	console.log(result); 
	handleError(response);
	return result;
};

const updateAdjustmentPercentages = async (responsibleUsername, dateRank, languageRank, interestRank, genderRank) => {
	console.log(responsibleUsername);
	console.log(dateRank+" "+languageRank+" "+interestRank+" "+genderRank);
	const response = await fetch(`${serverURL}/responsible/change-adjustment-percentages/${responsibleUsername}`,
		{
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				responsibleUsername,
				dateRank,
				languageRank,
				interestRank,
				genderRank
			})
		});
	handleError(response);
};

const fetchMeetingsFullDetails = async (username, usersType) => {
	const requestURL = 
	(usersType === UserRole.Elderly ? '/elderly' : '/volunteer')
	 + '/meetings-full-details';

	const response = await fetch(`${serverURL + requestURL}/${username}`,
		{
			method: 'get'
		});

	handleError(response);
	return response.json();
};

const fetchChannels = async (elderlyUserName) => {
	const response = await fetch(serverURL + `/elderly/channels/` + new URLSearchParams(elderlyUserName),
		{
			method: 'get'
		});

	handleError(response);
	return response;
};

const fetchElderlyDetails = async (organizationName) => {
	console.log(organizationName);
	if (!organizationName) {
		organizationName = 'NONE';
	}

	const response = await fetch(`${serverURL}/responsible/elderlyDetails/${organizationName}`,
		{
			method: 'get'
		});
	const result = await response.json();
	console.log(result);
	handleError(response);
	return result;
};

const deleteMeetingFromDB = async (channelName) => {
	const response = await fetch(serverURL + '/responsible/deleteMeeting/' + new URLSearchParams(channelName),
		{
			method: 'delete'
		});

	handleError(response);
	return response;
};
 
const notifyElderly = async (elderlyId, volunteerId, channel, meetingSubject) => {
	const response = await fetch(serverURL + '/volunteer/notify-elderly', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({elderlyId, volunteerId, channel, meetingSubject})
	});

	handleError(response);
	return response;
};

const fetchPostDailyForm = async (formAnswer,userId,date)=> {
	const response = await fetch(serverURL + '/elderly/daily-form', {
		method: 'post',
		headers:{'Content-Type': 'application/json'},
		body: JSON.stringify({formAnswer,userId,date})
	});
	handleError(response);
	return response;
}

 
export {
	registerNotifications,
	loginCheck,
	forgotPassword,
	tryLogin,
	updatePassword,
	fetchOrganizationsNames,
	fetchElderlyMatches,
	registerElderly,
	registerOrganization,
	registerResponsible,
	registerVolunteer,
	fetchVolunteers,
	addMeetingDB,
	// getMeetingsVolunteer,
	fetchMeetingsFullDetails,
	fetchChannels,
	fetchElderlyDetails,
	fetchVolunteerOrganizationMeetings,
	fetchElderlyOrganizationMeetings,
	getElderlyMeeting,
	fetchAdjustmentPercentages,
	updateAdjustmentPercentages,
	deleteMeetingFromDB,
	notifyElderly,
	fetchPostDailyForm
};