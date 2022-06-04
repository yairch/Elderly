import React from 'react';
import '../manage/manage.css';
import AssignableUser from './AssignableUser';

const AssignableUsers = ({users, toggleModal, setUser}) =>
	<div>
		<ul className="list-group">
			{users.map((user) => (
				<AssignableUser key={user.username} user={user} toggleModal={toggleModal} setUser={setUser}/>
			))}
		</ul>
	</div>;

export default AssignableUsers;