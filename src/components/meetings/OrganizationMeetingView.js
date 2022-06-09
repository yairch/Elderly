import React  from 'react';
import '../manage/manage.css';
import deleteIcon from '../../resources/delete-icon.png';

function OrganizationMeetingView({meeting, toggleModal, setChannelState}) {

	const onClick = () => {
		setChannelState({channelName: meeting.channelName});
		toggleModal();
	}

	return (
		<React.Fragment>
			<td className="col-1">{meeting.volunteer[0].firstName +' '+meeting.volunteer[0].lastName}</td>
			<td className="col-2">{meeting.elderly[0].firstName +' '+meeting.elderly[0].lastName}</td>
			<td className="col-3">{meeting.date}</td>
			<td className="col-4">{meeting.subject}</td>
			<td className="col-5">
				<button className="check-icon-button">
					<img className="delete-icon-button" src={deleteIcon} alt="x" onClick={onClick}/>
				</button>
			</td>
		</React.Fragment>
	);
}

export default OrganizationMeetingView;