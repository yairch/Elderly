import { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import InComingCallModal from '../modal/InComingCallModal';
import { AGORA_APP_ID } from '../../agora.config';
import { getCurrentWebSocket, setOnMessage } from '../../services/notifacationService';




function ElderlyPage(props) {
	// FIXME: temporary. remove when decide about elderly functionality
	const showEldrelyOptions = false;
	let fillDaily = true;
	let fillInit = true;
	const nearestMeeting = props.history.location.state;
	
	let formattedDate;
	let volunteer;
	if (nearestMeeting) {

		volunteer = nearestMeeting.volunteer[0];

		formattedDate = ( `בתאריך ${(nearestMeeting.date).slice(0,10)}, בשעה ${(nearestMeeting.date).slice(-5)}`)

	}
	
	const [state, setState] = useState({
		modalisOpen: false
	});

	useEffect(() => {
		getCurrentWebSocket();
	}, []);

	const [answerCallState, setAnswerCall] = useState({
		answerCall: () => {
			console.log('answer call');
		}
	});

	const setIncomingModal = (data) => {
		console.log(data)
		openModal(data);
		setAnswerCall({
			answerCall: () => {
				console.log('channel' + data.channelName);
				console.log('data' + JSON.stringify(data));
				const videoOptions = {
					'appId': AGORA_APP_ID,
					'channel': data.channelName,
					'baseMode': 'avc',
					'transcode': 'interop',
					'attendeeMode': 'video',
					'videoProfile': '480p_4'
				};
				props.history.push('/elderly/meetings/videoCall', {videoOptions: videoOptions, volunteer: volunteer, isElderly: true});
			}
		});
	};

	const openModal = (data) => {
		console.log("open modal",data)
		setState({modalisOpen: true, ...data});
	};

	useEffect(() => {
		setOnMessage(setIncomingModal);
	});

	async function onClick() {
	}

	const content = (
		<div className="buttons-section">
			{showEldrelyOptions &&
			<button
				className="sb-btn"
				type="button"
				onClick={onClick}>
				לא בשימוש
			</button>
			}
			{ fillInit &&
				<button
					className="sb-btn"
					type="button"
					onClick={() => props.history.push('/elderly/init-form')}>
					מלא שאלון ראשוני
				</button>
			}
			{fillDaily &&
			<button
			className="sb-btn"
			type="button"
			onClick={() => props.history.push('/elderly/daily-form')}
			>
				אנא מלא שאלון יומי
			</button>}
		</div>
	
	);

	return (
		<div className="page">
			<Sidebar history={props.history} content={content}/>
			<div className="center-page">
				{nearestMeeting
					? <span className="multiline-span">
							<div className="opening-screen-title">
							השיחה הקרובה שלך תהיה בנושא {nearestMeeting.subject}
								{'\n'}
								עם {nearestMeeting.volunteer[0].firstName + ' ' + nearestMeeting.volunteer[0].lastName} {formattedDate}
							</div>
							{/* <CountdownTimer dateToCountDownTo={nearestMeeting.date} /> */}
						</span>

					: <div className="opening-screen-title">
						אין לך שיחות בזמן הקרוב
						{/* אין לך שיחות בזמן הקרוב, ניתן ללחוץ על בקשת שיחה */}
					</div>
				}
			</div>
			{state.modalisOpen ?
				<InComingCallModal
					{...state} 
					answerCall={answerCallState.answerCall}
				/>
				: null
			}
		</div>
	);
}

export default ElderlyPage;
