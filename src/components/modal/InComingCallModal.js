import React from 'react';
import './modal.css';
import answerCall from '../../resources/answer-call-icon.png';

const InComingCallModal = (props) => (
		<div className="modal">
			<div className="modal-content" >
				<div className="modal-title">שיחה נכנסת</div>
				<div className="modal-body">
					<span>
					{/* eslint-disable-next-line no-useless-concat */}
					{'שיחה נכנסת מ' + props.volunteerName + '\n' + 'בנושא ' + props.meetingSubject}
					</span>
				</div>
				<div className="modal-buttons">
					<button className="incoming-call-modal-btn">
						<img id="answerCall" src={answerCall} onClick={props.answerCall} alt=''/>
					</button>
				</div>
			</div>
		</div>
	);

export default InComingCallModal;