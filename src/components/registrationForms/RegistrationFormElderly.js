import React, { Component } from 'react';
import Select from 'react-select';
import Modal from '../modal/Modal.js';
import { registerElderly } from '../../services/server';
import { generatePassword, regexes } from '../../ClientUtils';
import {
	areasOfInterestList,
	citiesList,
	digitalDevicesList,
	genderList,
	languagesList,
	preferredDaysAndHoursList,
	preferredGenderList,
	servicesList
} from '../../resources/lists';
import Navbar from '../navbar/Navbar';
import './RegistrationForm.css';

class RegistrationFormElderly extends Component {
	constructor(props) {
		super(props);
		this.state = {
			organizationName: '',
			firstName: '',
			lastName: '',
			email: '',
			username: '',
			password: '',
			birthYear: '',
			city: '',
			gender: '',
			phoneNumber: '',
			selectedAreasOfInterest: [],
			selectedLanguages: [],
			wantedServices: [],
			preferredDaysAndHours: [],
			digitalDevices: [],
			genderToMeetWith: '',
			additionalInformation: '',
			contactName: '',
			kinship: '',
			contactPhoneNumber: '',
			contactEmail: '',
			valid: {
				firstName: true,
				lastName: true,
				username: true,
				email: true,
				birthYear: true,
				phoneNumber: true,
				contactPhoneNumber: true,
				contactEmail: true
			},
			touched: {
				organizationName: false,
				firstName: false,
				lastName: false,
				username: false,
				email: false,
				gender: false,
				birthYear: false,
				phoneNumber: false,
				contactPhoneNumber: false,
				contactEmail: false
			},
			modalisOpen: false,
			hasErrors: false
		};

		this.rexExpMap = {
			additionalInformation: regexes.hebrewEnglishRegex,
			organizationName: regexes.hebrewEnglishRegex,
			firstName: regexes.hebrewEnglishRegex,
			lastName: regexes.hebrewEnglishRegex,
			username: regexes.usernameRegex,
			email: regexes.emailRegex,
			birthYear: regexes.yearRegex,
			phoneNumber: regexes.phoneNumberRegex,
			contactName: regexes.hebrewEnglishRegex,
			kinship: regexes.hebrewEnglishRegex,
			contactPhoneNumber: regexes.phoneNumberRegex,
			contactEmail: regexes.emailRegex
		};

		this.handleChange = this.handleChange.bind(this);
		this.checkData = this.checkData.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.checkOnSubmit = this.checkOnSubmit.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	handleChange = (e, name) => {
		if (name === 'username' && this.state.password === '') {
			this.setState({password: generatePassword()});
		}
		this.setState({[e.target.name]: e.target.value}, () => {
			this.checkData(this.rexExpMap[name], this.state[name], this.state.valid[name], name);
		});
	};

	checkData(regExp, stateName, stateValid, name) {
		this.setState({
			touched: {...this.state.touched, [name]: true}
		});
		if (regExp.test(stateName)) {
			this.setState({
				valid: {...this.state.valid, [name]: true}
			});
		}
		else {
			this.setState({
				valid: {...this.state.valid, [name]: false}
			});
		}
	}

	validate(firstName, lastName, username, email, birthYear, phoneNumber) {
		return {
			firstName: firstName.length === 0,
			lastName: lastName.length === 0,
			username: username.length === 0,
			email: email.length === 0,
			birthYear: birthYear.length === 0,
			phoneNumber: phoneNumber.length === 0
		};
	}

	requiredStyle(name) {
		const show = (this.state[name] === '' || !this.state.valid[name]) && this.state.touched[name];
		return {display: show ? 'block' : 'none'};
	}

	errorMessages(name) {
		const requiredStr = 'שדה חובה';
		const invalidStr = 'ערך לא תקין';
		return !this.state.valid[name] && this.state[name] !== '' ? invalidStr : requiredStr;
	}

	checkOnSubmit() {
		const {firstName, lastName, username, email, birthYear, phoneNumber, contactPhoneNumber, contactEmail} = this.state;
		const formFilled = !(firstName === '' || lastName === '' || username === '' || email === '' || birthYear === '' || phoneNumber === '');
		const formInvalid = Object.keys(this.state.valid).some(x => !this.state.valid[x]);
		const formHasErrors = !formFilled || formInvalid;

		if (!formHasErrors) {
			this.handleSubmit();
		}
		else {
			this.setState({message: `אחד או יותר מהשדות לא תקינים`, hasErrors: true});
			this.toggleModal();
		}
		this.setState({
			touched: {
				organizationName: true,
				firstName: true,
				lastName: true,
				username: true,
				email: true,
				birthYear: true,
				phoneNumber: true,
				contactEmail: true,
				contactPhoneNumber: true
			}
		});
	}

	async handleSubmit() {
		try {
			const response = await registerElderly(this.state);
			await response.json();
			this.setState({message: 'הרישום הצליח', hasErrors: false});

		}
		catch (error) {
			this.setState({message: `הרישום נכשל. \n ${error.message}`, hasErrors: true});
		}

		this.toggleModal();
	}

	toggleModal() {
		this.setState(prevState => ({
			modalisOpen: !prevState.modalisOpen
		}));
	}

	closeModal() {
		this.toggleModal();

		if (!this.state.hasErrors) {
			this.props.history.push('/responsible');
		}
	}

	render() {
		const errors = this.validate(this.state.firstName, this.state.lastName,
			this.state.username, this.state.email, this.state.birthYear, this.state.phoneNumber);
		const shouldMarkError = (field) => {
			const hasError = errors[field];
			const shouldShow = this.state.touched[field];
			return hasError ? shouldShow : false;
		};

		return (
			<div className="no-sidebar-page">
				<Navbar history={this.props.history}/>
				<h2 className="header">
					טופס רישום קשיש
				</h2>
				<div className="register-wrapper">
					<div className="shadow-box">
						<div className="container">
							<div className="register-form">
								<div className="form">
									<div className="field">
										<label>
											שם ארגון
											<Select
												isRtl
												placeholder="בחר/י..."
												name="organizationName"
												className={shouldMarkError('organizationName') ? 'error' : ''}
												value={this.state.organizationName}
												options={this.props.history.location.state}
												onChange={(value) => this.setState({organizationName: value})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('organizationName')}>{this.errorMessages('organizationName')}</span>
									</div>
									<div className="field">
										<label>
											שם פרטי
											<input
												type="text"
												value={this.state.firstName}
												name="firstName" id="firstName"
												className={shouldMarkError('firstName') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'firstName')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('firstName')}>{this.errorMessages('firstName')}</span>
									</div>

									<div className="field">
										<label>
											שם משפחה
											<input
												type="text"
												value={this.state.lastName}
												name="lastName" id="lastName"
												className={shouldMarkError('lastName') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'lastName')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('lastName')}>{this.errorMessages('lastName')}</span>
									</div>

									<div className="field">
										<label>
											מספר תעודת זהות
											<input
												type="text"
												value={this.state.username}
												name="username"
												className={shouldMarkError('username') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'username')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('username')}>{this.errorMessages('username')}</span>
									</div>

									<div className="field">
										<label>
											שנת לידה
											<input
												type="number"
												min="1900"
												max="2099"
												value={this.state.birthYear}
												name="birthYear"
												className={shouldMarkError('birthYear') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'birthYear')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('birthYear')}>{this.errorMessages('birthYear')}</span>
									</div>

									<div className="field">
										<label>
											כתובת דואר אלקטרוני
											<input
												type="text"
												name="email"
												value={this.state.email}
												className={shouldMarkError('email') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'email')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('email')}>{this.errorMessages('email')}</span>
									</div>

									<div className="field">
										<label>
											מספר טלפון
											<input
												type="text"
												name="phoneNumber"
												value={this.state.phoneNumber}
												className={shouldMarkError('phoneNumber') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'phoneNumber')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('phoneNumber')}>{this.errorMessages('phoneNumber')}</span>
									</div>

									<div className="field">
										<label>
											עיר מגורים
											<Select
												isRtl
												placeholder="בחר/י..."
												name="city"
												className={shouldMarkError('city') ? 'error' : ''}
												value={this.state.city}
												options={citiesList}
												onChange={(value) => this.setState({city: value})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('city')}>{this.errorMessages('city')}</span>
									</div>

									<div className="field">
										<label>
											מגדר
											<Select
												isRtl
												placeholder="בחר/י..."
												name="gender"
												className={shouldMarkError('gender') ? 'error' : ''}
												value={this.state.gender}
												options={genderList}
												onChange={(value) => this.setState({gender: value})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('gender')}>{this.errorMessages('gender')}</span>
									</div>

									<div className="field">
										<label>
											תחומי עניין
											<Select
												isMulti
												placeholder="בחירה מרובה..."
												isRtl
												name="selectedAreasOfInterest"
												className={shouldMarkError('selectedAreasOfInterest') ? 'error' : ''}
												value={this.state.selectedAreasOfInterest}
												options={areasOfInterestList}
												onChange={(values) => this.setState({selectedAreasOfInterest: values})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('selectedAreasOfInterest')}>{this.errorMessages('selectedAreasOfInterest')}</span>
									</div>

									<div className="field">
										<label>
											שפות
											<Select
												isMulti
												placeholder="בחירה מרובה..."
												isRtl
												name="languages"
												className={shouldMarkError('selectedLanguages') ? 'error' : ''}
												value={this.state.selectedLanguages}
												options={languagesList}
												onChange={(values) => this.setState({selectedLanguages: values})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('selectedLanguages')}>{this.errorMessages('selectedLanguages')}</span>
									</div>

									<div className="field">
										<label>
											ימים ושעות מועדפים
											<Select
												isMulti
												placeholder="בחירה מרובה..."
												isRtl
												name="preferredDaysAndHours"
												className={shouldMarkError('preferredDaysAndHours') ? 'error' : ''}
												value={this.state.preferredDaysAndHours}
												options={preferredDaysAndHoursList}
												onChange={(values) => this.setState({preferredDaysAndHours: values})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('preferredDaysAndHours')}>{this.errorMessages('preferredDaysAndHours')}</span>
									</div>

									<div className="field">
										<label>
											מעדיף לדבר עם
											<Select
												isRtl
												placeholder="בחר/י..."
												name="genderToMeetWith"
												className={shouldMarkError('genderToMeetWith') ? 'error' : ''}
												value={this.state.genderToMeetWith}
												options={preferredGenderList}
												onChange={(value) => this.setState({genderToMeetWith: value})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('genderToMeetWith')}>{this.errorMessages('genderToMeetWith')}</span>
									</div>

									<div className="field">
										<label>
											מכשירים טכנולוגיים שברשותי ורמת הידע בהם
											<Select
												isMulti
												placeholder="בחירה מרובה..."
												isRtl
												name="digitalDevices"
												className={shouldMarkError('digitalDevices') ? 'error' : ''}
												value={this.state.digitalDevices}
												options={digitalDevicesList}
												onChange={(values) => this.setState({digitalDevices: values})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('digitalDevices')}>{this.errorMessages('digitalDevices')}</span>
									</div>

									<div className="field">
										<label>
											סוגי שירות רצויים
											<Select
												isMulti
												placeholder="בחירה מרובה..."
												isRtl
												name="wantedServices"
												className={shouldMarkError('wantedServices') ? 'error' : ''}
												value={this.state.wantedServices}
												options={servicesList}
												onChange={(values) => this.setState({wantedServices: values})}
											/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('wantedServices')}>{this.errorMessages('wantedServices')}</span>
									</div>

									<div className="field">
										<label>
											עוד משהו שכדאי לדעת עליו
											<input
												name="additionalInformation"
												className={shouldMarkError('additionalInformation') ? 'error' : ''}
												value={this.state.additionalInformation}
												onChange={(e) => this.handleChange(e, 'additionalInformation')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('additionalInformation')}>{this.errorMessages('additionalInformation')}</span>
									</div>

									<h4>פרטי איש קשר</h4>
									<div className="field">
										<label>
											שם ושם משפחה
											<input
												type="text"
												value={this.state.contactName}
												name="contactName" id="contactName"
												className={shouldMarkError('contactName') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'contactName')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('contactName')}>{this.errorMessages('contactName')}</span>
									</div>
									<div className="field">
										<label>
											קירבה
											<input
												type="text"
												value={this.state.kinship}
												name="kinship"
												className={shouldMarkError('kinship') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'kinship')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('kinship')}>{this.errorMessages('kinship')}</span>
									</div>
									<div className="field">
										<label>
											מספר טלפון
											<input
												type="text"
												name="contactPhoneNumber"
												value={this.state.contactPhoneNumber}
												className={shouldMarkError('contactPhoneNumber') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'contactPhoneNumber')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('contactPhoneNumber')}>{this.errorMessages('contactPhoneNumber')}</span>
									</div>
									<div className="field">
										<label>
											כתובת דואר אלקטרוני
											<input
												type="text"
												name="contactEmail"
												value={this.state.contactEmail}
												className={shouldMarkError('contactEmail') ? 'error' : ''}
												onChange={(e) => this.handleChange(e, 'contactEmail')}/>
										</label>
										<span className="required-field"
											  style={this.requiredStyle('contactEmail')}>{this.errorMessages('contactEmail')}</span>

									</div>
									<button className="sb-btn" type="button" onClick={this.checkOnSubmit}>סיום</button>
								</div>
							</div>
							{this.state.modalisOpen ?
								<Modal
									text='שים/י לב'
									{...this.state}
									closeModal={this.closeModal}
								/>
								: null
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default RegistrationFormElderly;
