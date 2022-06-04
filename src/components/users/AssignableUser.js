import React, { useState } from 'react';
import UsersTable from './UsersTable';
import { fetchElderlyMatches } from '../../services/server';


function AssignableUser({user, setUser, toggleModal}) {
	const [userState, setUserState] = useState({
		matches: [],
		isHidden: true,
		buttonText: 'מצא התאמות'
	});

	async function getElderlyMatch() {
		const response = await fetchElderlyMatches(user);
		const res = await response.json()
		return res;
	}

	async function onClick() {
		let elderlyMatch = await getElderlyMatch();
		console.log(elderlyMatch);
		if (userState.isHidden) {
			setUserState({
				matches: elderlyMatch,
				isHidden: false,
				buttonText: 'הסתר טבלת התאמה'
			});
		}
		else {
			setUserState({matches: elderlyMatch, isHidden: true, buttonText: 'מצא התאמות'});
		}
	}

	return (
		<div>
			<li className="list-group-item" key={user.userName}>
				<div className="content">
					<div>
						<label className="volunteer-name">
							{'שם מתנדב: ' + user.firstName +' '+ user.lastName}
						</label>
					</div>
				</div>
				<div className="actions">
					<button
						className="sb-btn"
						name={user.username}
						onClick={() => onClick()}>
						{userState.buttonText}
					</button>
				</div>
			</li>
			<div>
				<UsersTable
					users={userState.matches}
					isHidden={userState.isHidden}
					toggleModal={toggleModal}
					setUser={setUser}
				/>
			</div>
		</div>
	);
}

export default AssignableUser;
