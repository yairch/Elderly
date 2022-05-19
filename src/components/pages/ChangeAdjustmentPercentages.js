import React, { useState } from 'react';
import * as Cookies from 'js-cookie';
import Navbar from '../navbar/Navbar';
import Modal from '../modal/Modal';
import { usersFields } from '../../constants/collections';
import { updateAdjustmentPercentages } from '../../services/server';
import './ChangeAdjustmentPercentages.css'

function ChangeAdjustmentPercentages(props) {

	const [state, setState] = useState({message: '', modalisOpen: false});
	const toggleModal = () => {
		setState({modalisOpen: !state.modalisOpen});
	};
	let success = 1;

	//insert to useState the values from DB
	const dateRankDB = props.location.state.adjustmentPercentages.dateRank;
	const languageRankDB = props.location.state.adjustmentPercentages.languageRank;
	const interestRankDB = props.location.state.adjustmentPercentages.interestRank;
	const genderRankDB = props.location.state.adjustmentPercentages.genderRank;
	
	const [dateRank, setDateRank] = useState(dateRankDB);
	const [languageRank, setLanguageRank] = useState(languageRankDB);
	const [interestRank, setInterestRank] = useState(interestRankDB);
	const [genderRank, setGenderRank] = useState(genderRankDB);
	
	async function changeAdjustmentPercentages() {
		try {
			checkOnSubmit();
			if( success === 1){
				const username = Cookies.get(usersFields.username);
				console.log(username);
				console.log(dateRank+" "+languageRank+" "+interestRank+" "+genderRank);
				await updateAdjustmentPercentages(username, dateRank, languageRank, interestRank, genderRank);
				
				setState({
					modalisOpen: true,
					message: 'עדכון אחוזי ההתאמה הצליח'
				});
			}
		}
		catch (error) {
		}
	}
	
	function checkOnSubmit(){
		const sum = parseFloat(dateRank) + parseFloat(languageRank) + parseFloat(interestRank) + parseFloat(genderRank);
		console.log(sum);
		if(sum !== 100){
			console.log("incorrect values");
			setState({
				modalisOpen: true,
				message: "עדכון אחוזי ההתאמה נכשל, אנא וודא/י כי סכום הפרמטרים שווה ל100"
			});
			success = 0;
		}
	}

	return (
		<div className='container'>
		<Navbar history={props.history}/>
		<br/><h1>אנא בחר את אחוזי ההתאמה לפרמטרים השונים בין המתנדבים לקשישים עבור הארגון</h1>
		<div className='rank'>
		<br/><label>תאריכים מועדפים
		<input value={dateRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setDateRank(e.target.value)} />
		</label>

		<br/><label>שפות מועדפות 
		<input value={languageRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setLanguageRank(e.target.value)} />
		</label>

		<br/><label>תחומי עניין
		<input value={interestRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setInterestRank(e.target.value)} />
		</label>

		<br/><label>מגדר מועדף
		<input value={genderRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setGenderRank(e.target.value)} />
		</label>
		</div>
		<button className="cng-btn" onClick={changeAdjustmentPercentages}>עדכון אחוזי התאמה מחדש</button>
		{state.modalisOpen ?
				<Modal
					{...state}
					closeModal={toggleModal}
				/>
				: null
			}
		</div>
	  );
}
export default ChangeAdjustmentPercentages;

