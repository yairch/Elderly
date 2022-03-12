import React, { useEffect, useState } from 'react';
import * as Cookies from 'js-cookie';
import Sidebar from '../sidebar/Sidebar';
import OpeningScreen from '../openingScreen';
import { filterMeetings } from '../../ClientUtils';
import { fetchElderlyDetails, getMeetings } from '../../services/server';
import {usersFields} from '../../constants/collections'

function VolunteerPage(props) {
	const [volunteerState, setVolunteerState] = useState({meetings: [], isMeetingsClicked: false});

	async function getMeetingsNames() {
		const response = await getMeetings(Cookies.get(usersFields.username));
		console.log("get Meeting name ");
		console.log(response);
		return response;
	}

	async function getElderlyDetails() {
		const response = await fetchElderlyDetails(Cookies.get(usersFields.username));
		return await response;
	}

	async function onClick() {
		let meetings = await getMeetingsNames();
		let elderlyDetails = await getElderlyDetails();
		meetings = meetings.map((dic) => (
				{
					meetingDate: dic.meeting,
					elderlyUserName: dic.elderlyuserName,
					meetingSubject: dic.meetingSubject,
					elderlyDetails: elderlyDetails.find(row => row.userName === dic.elderlyuserName)
				}
			)
		);

		meetings = filterMeetings(meetings);
		console.log('filtered meetings');
		console.log(meetings);
		setVolunteerState({meetings: meetings, isMeetingsClicked: true});
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
