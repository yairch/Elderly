import React, { useState } from 'react';
import Select from 'react-select';
import dateFormat from 'dateformat';
import DatePicker, { registerLocale } from 'react-datepicker';
import he from 'date-fns/locale/he';
import { addMeetingDB } from '../../services/server';
import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.css';

registerLocale('he', he);

const DateTimePickerWrapper = ({user, closeModal, setModalState}) => {
	const [state, setState] = useState({date: new Date(), wantedService: ''});
	console.log(user)
	const requiredStyle = (name) => {
		const show = state[name] === '';
		return {display: show ? 'block' : 'none'};
	}

	const errorMessages = (name) => {
		const requiredStr = 'שדה חובה';
		const invalidStr = 'ערך לא תקין';
		return state[name] !== '' ? invalidStr : requiredStr;
	}

	const onClick = async () => {
		
		if (state.wantedService !== '') {
			user.actualDate = dateFormat(state.date, 'dd.mm.yyyy,HH:MM');
			user.meetingSubject = state.wantedService.label;

			try {
				await addMeetingDB({user});
				setModalState({
					message: 'הפגישה נקבעה בהצלחה',
					modalIsOpen: true
				});
			}
			catch (error) {
				setModalState({
					message: error.message,
					modalIsOpen: true
				});
			} finally {
				closeModal();
			}
		}
	};
	return (
		<div className="modal-wrapper">
			<div className="date-modal-body">
				<div className="modal-preferred-days">
					<h4>ימים ושעות מועדפים משותפים:</h4>
					{user.commonPreferredDays.length > 0 ? user.commonPreferredDays : 'אין ימים ושעות מועדפים משותפים'}
				</div>
				<br/>
				<div className="field">
					<label>
						<h4>סוגי שירות אפשריים:</h4>
						<Select
							placeholder="בחר/י..."
							isRtl
							name="wantedService"
							value={state.wantedService}
							options={user.commonServices.map((dic) => (
								{value: dic, label: dic}
							))}
							onChange={(value) => setState({...state, wantedService: value})}
						/>
						<span className="required-field"
							  style={requiredStyle('wantedService')}>{errorMessages('wantedService')}</span>
					</label>
				</div>
				<br/>
				<h4>תאריך ושעה:</h4>
				<DatePicker
					selected={state.date}
					onChange={(date) => setState({...state ,date: date})}
					locale={'he'}
					showTimeSelect
					timeFormat="p"
					dateFormat="dd.MM.yyyy, HH:mm"
				/>
			</div>

			<div className="modal-buttons">
				<button className="modal-btn" onClick={onClick}>אישור</button>
			</div>
		</div>
	);
};

export { DateTimePickerWrapper};