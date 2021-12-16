import React from 'react';
import SearchInTable from '../users/SearchInTable';
import Navbar from '../navbar/Navbar';

const SearchPage = (props) => {
	const users = props.history.location.state.users;
	const usersType = props.history.location.state.usersType;

	return (
		<div className="no-sidebar-page">
			<Navbar history={props.history}/>
			<div className="meeting-wrapper">
				<SearchInTable history={props.history} users={users} usersType={usersType}/>
			</div>
		</div>
	);
};

export default SearchPage;
