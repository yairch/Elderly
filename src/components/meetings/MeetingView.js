import React from 'react';
import { AGORA_APP_ID } from '../../agora.config';
import * as Cookies from 'js-cookie';
import { notifyElderly } from '../../services/server';
import videoCall from '../../resources/video-call-icon.png';
import '../manage/manage.css';
import {usersFields} from '../../constants/collections'

function MeetingView({meeting, history,setModal}) {
	const username = Cookies.get(usersFields.username);
	const elderlyObject = meeting.elderlyObject;
	const channel = username+meeting.elderlyUsername+meeting.date;
	const videoOptions = {
		'appId': AGORA_APP_ID,
		'channel': channel,
		'baseMode': 'avc',
		'transcode': 'interop',
		'attendeeMode': 'video',
		'videoProfile': '480p_4'
	};

	const onClick = async () => {
		try {
			const response = await notifyElderly(meeting.elderlyUsername, username, channel, meeting.subject);
			console.log('response');
			console.log(response);
			response.status
				? history.push('/volunteer/meetings/videoCall', {videoOptions:videoOptions, isElderly:false})
				: setModal({
					modalIsOpen: true,
					message: 'המשתמש לא מחובר למערכת.\n לא ניתן להתקשר אליו כעת'
				})
		}
		catch (e){
			setModal({
				modalIsOpen: true,
				message: 'ארעה שגיאה.\n לא ניתן לבצע פעולה זו כעת'
			})
		}
	};

	return (
		<React.Fragment>
			<td className="col-1">{elderlyObject.firstName +' '+elderlyObject.lastName}</td>
			<td className="col-2">{meeting.date}</td>
			<td className="col-3">{meeting.subject}</td>
			<td className="col-4">
				<button className="check-icon-button">
					<img className="video-call-icon-button" src={videoCall} alt="call" onClick={onClick}/>
				</button>
			</td>
		</React.Fragment>
	);
}

export default MeetingView;
