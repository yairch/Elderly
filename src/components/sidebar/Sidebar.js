import React from 'react';
import * as Cookies from 'js-cookie';
import { closeWebSocket } from '../../services/notifacationService';
import spaceFiller from '../../resources/space-filler.png';
import './sidebar.css';
import { usersFields } from '../../constants/collections';

function Sidebar({history, content}) {
	const onClick = () => {
		closeWebSocket();
		Cookies.remove(usersFields.username);
		Cookies.remove('organizationName');
		Cookies.remove('organizationType');
		history.push('/login');
	};

	return (
		<div className="sidebar">
			<div className="top-sidebar">
				<div className="right">
					<button className="nav-buttons" onClick={onClick}>התנתק</button>
				</div>
				<div className="left">
				</div>
			</div>
			<div className="hr">
				<img className="space-filler" src={spaceFiller} alt=''/>
			</div>
			{content}
		</div>
	);
}

export default Sidebar;