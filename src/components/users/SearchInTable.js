import React, { useState } from 'react';
import UsersDetailsTable from './UsersDetailsTable';

const SearchInTable = ({history, users, usersType}) => {
	const [state, setState] = useState({
		filteredUsers: users
	});

	const search = (e) => {
		let filteredUsers = users.filter(user => user.userName.includes(e.target.value) || user.firstName.includes(e.target.value)
			|| user.lastName.includes(e.target.value));
		console.log(filteredUsers);
		setState({filteredUsers: filteredUsers});
	};

	return (
		<div className="search-section">
			<div className="freeze-section">
				<h2>{'חיפוש ' + usersType?.toString()}</h2>
				<input
					placeholder="חפש שם או תעודת זהות..."
					onChange={e => search(e)}
				/>
			</div>
			<div className="scrollable">
				<UsersDetailsTable history={history} users={state.filteredUsers} usersType={usersType}/>
			</div>
		</div>
	);
};

export default SearchInTable;