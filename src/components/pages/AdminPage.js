import React, { useEffect, useState } from 'react';
import { fetchElderlyDetails, fetchOrganizationsNames, fetchVolunteers } from '../../services/server';
import Sidebar from '../sidebar/Sidebar';
import OpeningScreen from '../openingScreen';

function AdminPage(props) {
	const [adminState, setAdminState] = useState({
		organizations: [],
		isSearchClicked: false
	});

	async function getOrganizationsNames() {
		const response = await fetchOrganizationsNames();
		return await response.json();
	}

	async function getVolunteers() {
		try {
			const response = fetchVolunteers();
			return (await response).json();
		}
		catch (error) {

		}
	}

	async function getElderly() {
		try {
			const response = fetchElderlyDetails();
			return (await response).json();
		}
		catch (error) {

		}
	}

	async function onClick() {
		let organizations = await getOrganizationsNames();
		organizations = organizations.map((dic) => {
			return {value: dic.organizationName, label: dic.organizationName};
		});

		console.log(organizations);
		setAdminState({organizations: organizations});
	}

	async function onClickSearch(event) {
		let elderlyUsers = await getElderly();
		let volunteersUsers = await getVolunteers();
		console.log(elderlyUsers);

		setAdminState({
			elderlyUsers: elderlyUsers,
			volunteersUsers: volunteersUsers,
			[event.target.name]: true
		});
	}

	useEffect(() => {
		if (adminState.organizations?.length !== 0) {
			console.log(adminState.organizations);
			props.history.push('/admin/register-responsible', {
				organizations: adminState.organizations
			});
		}
		if (adminState.isSearchClicked) {
			props.history.push('/admin/search', {
				volunteersUsers: adminState.volunteersUsers,
				elderlyUsers: adminState.elderlyUsers
			});
		}
	});

	const content = (
		<>
			<div className="buttons-section">
				<button
					className="sb-btn"
					type="button"
					onClick={() => props.history.push('/admin/register-organization')}>
					צור ארגון חדש
				</button>
				<button
					className="sb-btn"
					type="button"
					onClick={onClick}>
					צור אחראי חדש
				</button>
				<button
					className="sb-btn"
					type="button"
					name="isSearchClicked"
					onClick={e => onClickSearch(e)}>
					חפש משתמשים
				</button>
			</div>
		</>
	)

	return (
		<div className="page">
			<Sidebar history={props.history} content={content}/>
			<OpeningScreen />
		</div>
	);
}

export default AdminPage;