import React, { useEffect, useState } from 'react';
import OrganizationMeetingTable from '../meetings/OrganizationMeetingTable';
import { deleteMeetingFromDB } from '../../services/server';
import DeleteModal from '../modal/DeleteModal';
import Navbar from '../navbar/Navbar';

const ManageMeetingsPage = (props) => {
	const organizationMeetings = props.history.location.state;
	const [state, setState] = useState({modalisOpen: false});
	const [channelState, setChannelState] = useState({channelName: ''});
	const [meetingsState, setMeetingsState] = useState({meetings: organizationMeetings});

	const deleteFromUI = (channelNameToDelete) => {
		setMeetingsState({meetings: meetingsState.meetings.filter(meeting => meeting.channelName !== channelNameToDelete)});
	}

	const confirmDelete = async () => {
		await deleteMeetingFromDB(channelState.channelName);
		deleteFromUI(channelState.channelName);
		setState({modalisOpen: false});
	}

	const toggleModal = () => {
		setState(prevState => ({
			message: 'האם אתה בטוח שברצונך למחוק את הפגישה?',
			modalisOpen: !prevState.modalisOpen
		}));
	};

	let meetingsComponent = (
		<OrganizationMeetingTable
			meetings={meetingsState.meetings}
			setMeetings={setMeetingsState}
			toggleModal={toggleModal}
			setChannelState={setChannelState}/>
	)

	useEffect(() => {
		meetingsComponent = (
			<OrganizationMeetingTable
				meetings={meetingsState.meetings}
				setMeetings={setMeetingsState}
				toggleModal={toggleModal}
				setChannelState={setChannelState}/>
		)
	}, [meetingsState])

	return (
		<div className="no-sidebar-page">
			<Navbar history={props.history} />
			<h2 className="header">
				פגישות בארגון
			</h2>
			{meetingsComponent}
			{state.modalisOpen ?
				<DeleteModal
					text='שים/י לב'
					{...state}
					delete={confirmDelete}
					closeModal={toggleModal}
				/>
				: null
			}
		</div>
	);
};

export default ManageMeetingsPage;
