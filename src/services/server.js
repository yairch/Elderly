import { serverURL } from '../ClientUtils';
import { handleError } from './errorHandler';

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

const fetchOrganizationsNames = async () =>
	await fetch(serverURL + `/admin/organizationNames`, {
		method: 'get'
	});

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
	const response = await fetch(serverURL + `/responsible/volunteersDetails/` + new URLSearchParams(organizationName),
		{
			method: 'get'
		});

	handleError(response);
	return response;
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
	const response = await fetch(serverURL + `/responsible/meetings-volunteers/` + new URLSearchParams(organizationName),
		{
			method: 'get'
		});

	handleError(response);
	return response;
};

const fetchElderlyOrganizationMeetings = async (organizationName) => {
	const response = await fetch(serverURL + `/responsible/meetings-elderly/` + new URLSearchParams(organizationName),
		{
			method: 'get'
		});

	handleError(response);
	return response;
};

const getMeetings = async (volunteerUserName) => {
	const response = await fetch(`${serverURL}/volunteer/meetings/:${volunteerUserName}`,
		{
			method: 'get'
		});

	handleError(response);
	return response.json();
};

const fetchMeetingsFullDetails = async (userName, usersType) => {
	const requestURL = usersType === 'קשישים'
		? '/elderly/meetings-full-details/'
		: '/volunteer/meetings-full-details/';

	const response = await fetch(serverURL + requestURL + new URLSearchParams(userName),
		{
			method: 'get'
		});

	handleError(response);
	return response;
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
	if (!organizationName) {
		organizationName = 'NONE';
	}

	const response = await fetch(serverURL + `/responsible/elderlyDetails/` + new URLSearchParams(organizationName),
		{
			method: 'get'
		});

	handleError(response);
	return response.json();
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
	getMeetings,
	fetchMeetingsFullDetails,
	fetchChannels,
	fetchElderlyDetails,
	fetchVolunteerOrganizationMeetings,
	fetchElderlyOrganizationMeetings,
	deleteMeetingFromDB,
	notifyElderly
};