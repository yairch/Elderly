import React, { useEffect, useRef } from 'react';
import { DateTimePickerWrapper } from '../datePicker/dateAndTimePicker';
import './date-modal.css';

const DateModal = ({user, closeModal, setModalState}) => {
	const modalRef = useRef(null);



	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				closeModal();
			}
		};

		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	},[closeModal]);

	return (
		<div className="modal" >
			<div className="modal-content" ref={modalRef}>
				<div className="modal-title">
					<span>
					קביעת פגישה
					</span>
				</div>
				<DateTimePickerWrapper user={user} closeModal={closeModal} setModalState={setModalState}/>
			</div>
		</div>
	);
};

export { DateModal };