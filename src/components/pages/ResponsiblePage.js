import React, { useCallback, useEffect, useState } from 'react';
import * as Cookies from 'js-cookie';
import { Dropdown } from 'react-bootstrap';
import {
	fetchElderlyDetails,
	fetchElderlyOrganizationMeetings,
	fetchOrganizationsNames,
	fetchVolunteerOrganizationMeetings,
	fetchVolunteers
} from '../../services/server';
import Modal from '../modal/Modal';
import Sidebar from '../sidebar/Sidebar';
import separatorIcon from '../../resources/separator-icon.png';
import plusIcon from '../../resources/plus-icon.png';
import OpeningScreen from '../openingScreen';

function ResponsiblePage(props) {
	if (props?.history?.location.state) {
		Cookies.set('organizationType', props.history.location.state);
	}

	const organizationName = Cookies.get('organizationName');
	const organizationType = Cookies.get('organizationType');
	console.log(organizationType);

	const [responsibleState, setResponsibleState] = useState({
		organizations: [],
		users: [],
		elderlyUsers: [],
		volunteersUsers: [],
		isElderlyResponsible: false,
		isVolunteerResponsible: false,
		isVolunteerClicked: false,
		isElderlyClicked: false,
		isManageVolunteersClicked: false,
		isManageVolunteersMeetingsClicked: false,
		isManageElderlyMeetingsClicked: false,
		isSearchVolunteersClicked: false,
		isSearchElderlyClicked: false,
		modalisOpen: false
	});

	useEffect(() => {
		if (organizationType.includes('מתנדבים') && organizationType.includes('קשישים')) {
			setResponsibleState({
				isVolunteerResponsible: true,
				isElderlyResponsible: true
			});
		}
		else if (organizationType.includes('מתנדבים')) {
			setResponsibleState({
				...responsibleState,
				isVolunteerResponsible: true
			});
		}
		else if (organizationType.includes('קשישים')) {
			setResponsibleState({
				...responsibleState,
				isElderlyResponsible: true
			});
		}
	}, [organizationType]);

	async function getOrganizationsNames() {
		const response = fetchOrganizationsNames();
		return (await response).json();
	}

	async function getVolunteerOrganizationMeetings() {
		try {
			const response = fetchVolunteerOrganizationMeetings(organizationName);
			return (await response).json();
		}
		catch (e) {
			console.log('e.message.toString()');
			console.log(e.message.toString());
			setResponsibleState({
				...responsibleState,
				message: e.message.toString()
			});

			toggleModal();
		}
	}

	async function getElderlyOrganizationMeetings() {
		try {
			const response = fetchElderlyOrganizationMeetings(organizationName);
			return (await response).json();
		}
		catch (e) {
			console.log('e.message.toString()');
			console.log(e.message.toString());
			setResponsibleState({
				...responsibleState,
				message: e.message.toString()
			});

			toggleModal();
		}
	}

	async function getVolunteers() {
		try {
			const response = fetchVolunteers(organizationName);
			return (await response).json();
		}
		catch (error) {

		}
	}

	async function getElderly() {
		try {
			const response = fetchElderlyDetails(organizationName);
			return (await response).json();
		}
		catch (error) {

		}
	}

	async function onClick(event) {
		let organizations = await getOrganizationsNames();
		organizations = organizations.map((dic) => (
			{value: dic.organizationName, label: dic.organizationName}
		));

		organizations = organizations.filter(obj => obj.value !== 'admin');
		console.log(organizations);
		setResponsibleState({
			organizations: organizations,
			[event.target.name]: true
		});
	}

	async function onClickManageVolunteers(event) {
		let volunteers = await getVolunteers();
		console.log('volunteers');
		console.log(volunteers);

		setResponsibleState({
			users: volunteers,
			[event.target.name]: true
		});
	}

	async function onClickManageVolunteersMeetings(event) {
		let organizationMeetings = await getVolunteerOrganizationMeetings();

		setResponsibleState({
			volunteerOrganizationMeetings: organizationMeetings,
			[event.target.name]: true
		});
	}

	async function onClickManageElderlyMeetings(event) {
		let organizationMeetings = await getElderlyOrganizationMeetings();
		console.log('organizationMeetings');
		console.log(organizationMeetings);

		setResponsibleState({
			elderlyOrganizationMeetings: organizationMeetings,
			[event.target.name]: true
		});
	}

	async function onClickSearchVolunteers(event) {
		let volunteerUsers = await getVolunteers();
		console.log(volunteerUsers);

		setResponsibleState({
			volunteersUsers: volunteerUsers,
			[event.target.name]: true
		});
	}

	async function onClickSearchElderly(event) {
		let elderlyUsers = await getElderly();
		console.log(elderlyUsers);
		setResponsibleState({
			elderlyUsers: elderlyUsers,
			[event.target.name]: true
		});
	}

	useEffect(() => {
		if (responsibleState.isVolunteerClicked) {
			console.log(responsibleState.organizations);
			props.history.push('/responsible/register-volunteer', responsibleState.organizations);
		}
		else if (responsibleState.isElderlyClicked) {
			console.log(responsibleState.organizations);
			props.history.push('/responsible/register-elderly', responsibleState.organizations);
		}
		else if (responsibleState.isManageVolunteersClicked) {
			props.history.push('/responsible/manage-volunteers', {
				organizationName: organizationName,
				users: responsibleState.users
			});
		}
		else if (responsibleState.isManageVolunteersMeetingsClicked) {
			console.log('responsibleState.volunteerOrganizationMeetings');
			console.log(responsibleState.volunteerOrganizationMeetings);
			props.history.push('/responsible/manage-volunteers-meetings', responsibleState.volunteerOrganizationMeetings);
		}
		else if (responsibleState.isManageElderlyMeetingsClicked) {
			console.log('responsibleState.elderlyOrganizationMeetings');
			console.log(responsibleState.elderlyOrganizationMeetings);
			props.history.push('/responsible/manage-elderly-meetings', responsibleState.elderlyOrganizationMeetings);
		}
		else if (responsibleState.isSearchVolunteersClicked) {
			console.log('responsibleState.volunteersUsers');
			console.log(responsibleState.volunteersUsers);
			props.history.push('/responsible/search-volunteers', {
				users: responsibleState.volunteersUsers,
				usersType: 'מתנדבים'
			});
		}
		else if (responsibleState.isSearchElderlyClicked) {
			console.log('responsibleState.elderlyUsers');
			console.log(responsibleState.elderlyUsers);
			props.history.push('/responsible/search-elderly', {
				users: responsibleState.elderlyUsers,
				usersType: 'קשישים'
			});
		}
	});

	const toggleModal = useCallback(
		() => {
			setResponsibleState({
				...responsibleState,
				modalisOpen: !responsibleState.modalisOpen
			});
		}, [responsibleState.modalisOpen]);

	const content = (
		<>
			{responsibleState.isVolunteerResponsible ?
				<div className="buttons-section">
					<button
						className="sb-btn"
						name="isVolunteerClicked"
						type="button"
						onClick={(e) => onClick(e)}
					>
						צור מתנדב חדש
					</button>
					<Dropdown drop="left">
						<Dropdown.Toggle className="sb-btn" variant="success" id="dropdown-basic">
							פגישות מתנדבים
						</Dropdown.Toggle>

						<Dropdown.Menu className="dropdown-menu">
							<div className="buttons-section">
								<Dropdown.Item>
									<button
										className="sb-btn"
										name="isManageVolunteersClicked"
										type="button"
										onClick={(e) => onClickManageVolunteers(e)}
									>
										קבע פגישות למתנדבים
									</button>
									<button
										className="sb-btn"
										name="isManageVolunteersMeetingsClicked"
										type="button"
										onClick={(e) => onClickManageVolunteersMeetings(e)}
									>
										נהל פגישות מתנדבים
									</button>
								</Dropdown.Item>
							</div>
						</Dropdown.Menu>
					</Dropdown>
					<button
						className="sb-btn"
						name="isSearchVolunteersClicked"
						type="button"
						onClick={(e) => onClickSearchVolunteers(e)}
					>
						חפש מתנדבים
					</button>
				</div>
				: null
			}
			{responsibleState.isVolunteerResponsible && responsibleState.isElderlyResponsible ?
				<div className="hr">
					<img className="separator" src={separatorIcon}/>
				</div>
				: null
			}
			{responsibleState.isElderlyResponsible ?
				<div className="buttons-section">
					<button
						className="sb-btn"
						name="isElderlyClicked"
						type="button"
						onClick={(e) => onClick(e)}
					>
						צור קשיש חדש
					</button>
					<button
						className="sb-btn"
						name="isManageElderlyMeetingsClicked"
						type="button"
						onClick={(e) => onClickManageElderlyMeetings(e)}
					>
						פגישות קשישים
					</button>
					<button
						className="sb-btn"
						name="isSearchElderlyClicked"
						type="button"
						onClick={(e) => onClickSearchElderly(e)}
					>
						חפש קשישים
					</button>
				</div>
				: null
			}
		</>
	);

	return (
		<div className="page">
			<Sidebar history={props.history} content={content}/>
			<OpeningScreen />
			{responsibleState.modalisOpen ?
				<Modal
					{...responsibleState}
					closeModal={toggleModal}
				/>
				: null
			}
		</div>
	);
}

export default ResponsiblePage;
