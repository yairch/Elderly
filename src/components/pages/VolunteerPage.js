import React, { useEffect, useState } from 'react';
import * as Cookies from 'js-cookie';
import Sidebar from '../sidebar/Sidebar';
import OpeningScreen from '../openingScreen';
// import { filterMeetings } from '../../ClientUtils';
import { getElderlyMeeting, getMeetingsVolunteer } from '../../services/server';
import {usersFields} from '../../constants/collections'

function VolunteerPage(props) {
	const [volunteerState, setVolunteerState] = useState({meetings: [], isMeetingsClicked: false});
	
	// async function getMeetings() {
	// 	const response = await getMeetingsVolunteer(Cookies.get(usersFields.username));
	// 	console.log("get Meeting name ");
	// 	console.log(response);
	// 	return response;
	// }

	async function getElderlyDetails(volunteerUsername) {
		const response = await getElderlyMeeting(volunteerUsername);
		return await response;
	}

	async function onClick() {
		// let meetings = await getMeetings();
		let volunteerUsername = Cookies.get(usersFields.username);
		console.log(volunteerUsername);
		let meetingFullElderlyDetails = await getElderlyDetails(volunteerUsername);
		meetingFullElderlyDetails = meetingFullElderlyDetails.map((meeting) => (
				{
					meetingDate: meeting.date,
					elderlyUsername: meeting.elderlyUsername,
					subject: meeting.subject,
					elderlyDetails: meeting.elderly[0]
				}
			)
		);
		// meetings = filterMeetings(meetings);
		setVolunteerState({meetings: meetingFullElderlyDetails, isMeetingsClicked: true});
	}

	useEffect(() => {
		if (volunteerState.isMeetingsClicked) {
			props.history.push('/volunteer/meetings', volunteerState.meetings);
		}
	});

	const content = (
		<>
			<div className="buttons-section">
				<button
					className="sb-btn"
					type="button"
					onClick={onClick}>
					פגישות
				</button>
			</div>
		</>
	);

	return (
		<div className="page">
			<Sidebar history={props.history} content={content}/>
			<OpeningScreen />
		</div>
	);
}

export default VolunteerPage;
