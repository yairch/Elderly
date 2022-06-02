import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import './App.css';

function Main() {
	return (
		<BrowserRouter>
			<Routes/>
		</BrowserRouter>
	);

}

export default Main;
