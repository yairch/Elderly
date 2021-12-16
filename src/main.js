import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import './App.css';

function Main() {
	return (
		<BrowserRouter basename="/Tele-vol/">
			<Routes/>
		</BrowserRouter>
	);

}

export default Main;
