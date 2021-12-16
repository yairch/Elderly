import React from 'react';
import SearchInTable from '../users/SearchInTable';
import Navbar from '../navbar/Navbar';

const AdminSearchPage = (props) => {
	const volunteersUsers = props.history.location.state.volunteersUsers;
	const elderlyUsers = props.history.location.state.elderlyUsers;
	return (
		<div className="no-sidebar-page">
			<Navbar history={props.history}/>
			<div className="page-content">
				<div className="centered-container">
					<div className="half">
						<SearchInTable history={props.history} users={volunteersUsers} usersType="מתנדבים"/>
					</div>
					<br />
					<div className="half">
						<SearchInTable history={props.history} users={elderlyUsers} usersType="קשישים"/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminSearchPage;