import UserView from './UserView';
import React from 'react';

function UsersTable({users, isHidden, toggleModal, setUser}) {
	if (!isHidden) {
		return (
			<table className="users-table">
				<thead className="table-header">
				<tr>
					<th className="col-1">שם הקשיש</th>
					<th className="col-2">נושאי פגישה רצויים</th>
					<th className="col-3">אחוזי התאמה</th>
					<th className="col-4">צור פגישה</th>
				</tr>
				</thead>
				<tbody>
				{users.map((user, index) => (
					<tr key={index} className="table-row">
						<UserView user={user} toggleModal={toggleModal} setUser={setUser}/>
					</tr>
				))}
				</tbody>
			</table>
		);
	}
	else {
		return (
			<div className="no-data">
			</div>
		);
	}
}

export default UsersTable;