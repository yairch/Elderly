import React from 'react';
import * as Cookies from 'js-cookie';
import { closeWebSocket } from '../../services/notifacationService';
import './navbar.css';
import { usersFields } from '../../constants/collections';

function Navbar({history}) {
	const onClick = () => {
		closeWebSocket();
		Cookies.remove(usersFields.username);
		Cookies.remove('organizationName');
		Cookies.remove('organizationType');
		history.push('/login');
	};

	return (
		<div className="navbar">
			<button className="nav-buttons" onClick={history.goBack}>חזור</button>
			<button className="nav-buttons" onClick={onClick}>התנתק</button>
		</div>
	);
}

export default Navbar;