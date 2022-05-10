import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationFormOrganization from './components/registrationForms/RegistrationFormOrganization';
import RegistrationFormElderly from './components/registrationForms/RegistrationFormElderly';
import RegistrationFormVolunteer from './components/registrationForms/RegistrationFormVolunteer';
import RegistrationFormResponsible from './components/registrationForms/RegistrationFormResponsible';
import AdminPage from './components/pages/AdminPage';
import ResponsiblePage from './components/pages/ResponsiblePage';
import ManageUsers from './components/manage/ManageUsers';
import VolunteerPage from './components/pages/VolunteerPage';
import MeetingsPage from './components/pages/MeetingsPage';
import VideoCallPage from './components/pages/VideoCallPage';
import ElderlyPage from './components/pages/ElderlyPage';
import { ChangePasswordPage } from './components/pages/ChangePasswordPage';
import ManageMeetingsPage from './components/pages/ManageMeetingsPage';
import SearchPage from './components/pages/SearchPage';
import AdminSearchPage from './components/pages/AdminSearchPage';
import AfterVideoCallPage from './components/pages/AfterVideoCallPage';
import FullDetailsPage from './components/pages/FullDetailsPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ChangePassword from './components/CangePassword';
import ChangeAdjustmentPercentages from './components/pages/ChangeAdjustmentPercentages';

function Routes() {
	return (
		<div>
			<Switch>
				<Route exact path="/">
					<Redirect to="/login"/>
				</Route>
				<Route exact path="/login" component={LoginForm}/>
				<Route exact path="/user/activate/:username/:password" component={ChangePasswordPage}/>
				<Route exact path="/user/forgot-password" component={ForgotPasswordPage}/>
				<Route exact path="/user/forgot-password/change-password/:username" component={ChangePassword}/>
				<Route exact path="/admin" component={AdminPage}/>
				<Route exact path="/admin/search" component={AdminSearchPage}/>
				<Route exact path="/admin/register-responsible" component={RegistrationFormResponsible}/>
				<Route exact path="/admin/register-organization" component={RegistrationFormOrganization}/>
				<Route exact path="/responsible" component={ResponsiblePage}/>
				<Route exact path="/responsible/register-elderly" component={RegistrationFormElderly}/>
				<Route exact path="/responsible/register-volunteer" component={RegistrationFormVolunteer}/>
				<Route exact path="/responsible/manage-volunteers" component={ManageUsers}/>
				<Route exact path="/responsible/manage-volunteers-meetings" component={ManageMeetingsPage}/>
				<Route exact path="/responsible/manage-elderly-meetings" component={ManageMeetingsPage}/>
				<Route exact path="/responsible/search-volunteers" component={SearchPage}/>
				<Route exact path="/responsible/search-elderly" component={SearchPage}/>
				<Route exact path="/responsible/full-details/elderly" component={FullDetailsPage}/>
				<Route exact path="/responsible/full-details/volunteer" component={FullDetailsPage}/>
				<Route exact path="/volunteer" component={VolunteerPage}/>
				<Route exact path="/volunteer/meetings" component={MeetingsPage}/> 
				<Route exact path="/volunteer//meetings-full-details/:username" component={MeetingsPage}/>
				<Route exact path="/volunteer/meetings/videoCall" component={VideoCallPage}/>
				<Route exact path="/volunteer/meetings/feedback" component={AfterVideoCallPage}/>
				<Route exact path="/elderly" component={ElderlyPage}/>
				<Route exact path="/elderly/meetings/videoCall" component={VideoCallPage}/>
				<Route exact path="/responsible/change-adjustment-percentages" component={ChangeAdjustmentPercentages}/>
			</Switch>
		</div>
	);
}

export default Routes;