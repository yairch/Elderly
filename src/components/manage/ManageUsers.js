import React, { useState } from 'react';
import AssignableUsers from '../users/AssignableUsers';
import Navbar from '../navbar/Navbar';
import { DateModal } from '../modal/DateModal';
import Modal from '../modal/Modal';

function ManageUsers({history}) {
	const state = history.location.state;
	const [user, setUser] = useState();
	const [dateModalState, setDateModalState] = useState({dateModalIsOpen: false});
	const [modalState, setModalState] = useState({modalIsOpen: false});

	const toggleDateModal = () => {
		setDateModalState({dateModalIsOpen: !dateModalState.dateModalIsOpen});
	};

	const toggleModal = () => {
		setModalState({modalIsOpen: !modalState.modalIsOpen});
	};

	return (
		<div className="no-sidebar-page">
			<Navbar history={history}/>
			<div>
				<h2 className="header">
					קביעת פגישות למתנדבים
				</h2>
			</div>
			<div className="manage-wrapper">
				<div className="shadow-box">
					<div className="scrollable-100">
						<AssignableUsers users={state.users} toggleModal={toggleDateModal} setUser={setUser}/>
					</div>
				</div>
			</div>
			<div>
				{dateModalState.dateModalIsOpen ?
					<DateModal
						user={user}
						closeModal={toggleDateModal}
						setModalState={setModalState}
					/>
					: null
				}
				{modalState.modalIsOpen ?
					<Modal
						{...modalState}
						closeModal={toggleModal}
					/>
					: null
				}
			</div>
		</div>

	);
}

export default ManageUsers;
