import React from 'react';
import { feedbackURL } from '../../ClientUtils';
import Navbar from '../navbar/Navbar';

const AfterVideoCallPage = (props) =>
	<div className="no-sidebar-page">
		<Navbar history={props.history} />
		<div className="manage-wrapper">
			<h2 className="header">משוב</h2>
			אנא מלא/י משוב על השיחה
			<a className="sb-btn" href={feedbackURL}>לחץ כאן</a>
		</div>
	</div>;

export default AfterVideoCallPage;
