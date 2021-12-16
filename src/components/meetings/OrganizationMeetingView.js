import React  from 'react';
import '../manage/manage.css';
import deleteIcon from '../../resources/delete-icon.png';

function OrganizationMeetingView({meeting, toggleModal, setChannelState}) {
	console.log(meeting);

	const onClick = () => {
		setChannelState({channelName: meeting.channelName});
		toggleModal();
	}

	return (
		<React.Fragment>
			<td className="col-1">{meeting.volunteerFirstName +' '+meeting.volunteerLastName}</td>
			<td className="col-2">{meeting.elderlyFirstName +' '+meeting.elderlyLastName}</td>
			<td className="col-3">{meeting.meeting}</td>
			<td className="col-4">{meeting.meetingSubject}</td>
			<td className="col-5">
				<button className="check-icon-button">
					<img className="delete-icon-button" src={deleteIcon} alt="x" onClick={onClick}/>
				</button>
			</td>
		</React.Fragment>
	);
}

export default OrganizationMeetingView;