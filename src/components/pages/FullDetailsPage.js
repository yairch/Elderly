import React, { useEffect, useState } from 'react';
import ElderlyFullDetails from '../users/usersFullDetails/ElderlyFullDetails';
import VolunteerFullDetails from '../users/usersFullDetails/VolunteerFullDetails';
import Navbar from '../navbar/Navbar';
import { fetchMeetingsFullDetails } from '../../services/server';
import FullMeetings from '../users/usersFullDetails/FullDetailsMeetings';

const FullDetailsPage = (props) => {
	const [meetings, setMeetings] = useState([]);
	const details = props.history.location.state.details;
	const usersType = props.history.location.state.usersType;
	console.log(details);

	useEffect(()=> {
		async function setMeetingsFullDetails() {
			const response = await fetchMeetingsFullDetails(details.userName, usersType);
			const meetingsDetails = await response.json();
			setMeetings(meetingsDetails);
		}

		setMeetingsFullDetails()
	},[])

	return (
		<div className="no-sidebar-page">
			<Navbar history={props.history}/>
			<div className="full-page-container">
				<h2>פרטים מלאים</h2>
				<div className="horizontal">
					<div>
						{
							usersType === 'קשישים'
								? <ElderlyFullDetails details={details}/>
								: <VolunteerFullDetails details={details}/>
						}
					</div>
					<div>
						{
							usersType === 'קשישים'
								? <FullMeetings meetings={meetings} title={"שם המתנדב"}/>
								: <FullMeetings meetings={meetings} title={"שם הקשיש"}/>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FullDetailsPage;
