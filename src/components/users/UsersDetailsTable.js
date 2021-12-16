import React from 'react';
import { Button } from 'react-bootstrap';

function UsersDetailsTable({history, users, usersType}) {
	const onClick = (user) => {
		if (usersType === 'קשישים') {
			history.push('/responsible/full-details/elderly', {details: user, usersType});
		}
		else if (usersType === 'מתנדבים') {
			history.push('/responsible/full-details/volunteer', {details: user, usersType});
		}
	};

	return (
		<div className="table-wrapper">
			<table className="users-table">
				<thead className="table-header">
				<tr>
					<th className="col-1">שם ושם משפחה</th>
					<th className="col-2">תעודת זהות</th>
					<th className="col-3">אימייל</th>
					<th className="col-4">מספר טלפון</th>
				</tr>
				</thead>
				<tbody>
				{users.map((user, index) => (
					<tr key={index} className="table-row">
						<td className="col-1">
							<Button className="hidden-btn" onClick={() => onClick(user)}>
								{user.firstName + ' ' + user.lastName}
							</Button>
						</td>
						<td className="col-2">
							{user.userName}
						</td>
						<td className="col-3">
							{user.email}
						</td>
						<td className="col-4">
							{user.phoneNumber}
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
}

export default UsersDetailsTable;
