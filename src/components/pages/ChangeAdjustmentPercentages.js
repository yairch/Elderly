import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import Modal from '../modal/Modal';
import '../meetings/meetings-page.css';

const ChangeAdjustmentPercentages = (props) => {
	const [modalState, setModalState] = useState({modalIsOpen: false, message: ''});

	return (
		<div className="no-sidebar-page">
			<Navbar history={props.history}/>
			<div className="meeting-wrapper">
				<h2>change your organization's adjustment percentages</h2>
				<div className="scrollable">
                    
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

export default ChangeAdjustmentPercentages;
