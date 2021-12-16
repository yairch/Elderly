import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import MeetingTable from '../meetings/MeetingTable';
import Modal from '../modal/Modal';
import '../meetings/meetings-page.css';

const MeetingsPage = (props) => {
	const [modalState, setModalState] = useState({modalIsOpen: false, message: ''});

	return (
		<div className="no-sidebar-page">
			<Navbar history={props.history}/>
			<div className="meeting-wrapper">
				<h2>הפגישות שלך</h2>
				<div className="scrollable">
					<MeetingTable props={props} setModal={setModalState}/>
				</div>
			</div>
			{modalState.modalIsOpen ?
				<Modal
					{...modalState}
					setModal={setModalState}
					closeModal={() => setModalState({modalIsOpen: false})}
				/>
				: null
			}
		</div>
	);
};

export default MeetingsPage;
