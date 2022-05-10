import React, { useState } from 'react';
import * as Cookies from 'js-cookie';
import Navbar from '../navbar/Navbar';
import Modal from '../modal/Modal';

function ChangeAdjustmentPercentages(props) {

	//insert to useState the values from DB
	const dateRankDB = props.location.state.adjustmentPercentages.dateRank;
	const languageRankDB = props.location.state.adjustmentPercentages.languageRank;
	const interestRankDB = props.location.state.adjustmentPercentages.interestRank;
	const genderRankDB = props.location.state.adjustmentPercentages.genderRank;
	console.log(dateRankDB+" "+languageRankDB+" "+interestRankDB+" "+genderRankDB);
	
	const [dateRank, setDateRank] = useState(dateRankDB);
	const [languageRank, setLanguageRank] = useState(languageRankDB);
	const [interestRank, setInterestRank] = useState(interestRankDB);
	const [genderRank, setGenderRank] = useState(genderRankDB);

	function checkOnSubmit(){
		const sum = dateRank + languageRank + interestRank + genderRank;
		console.log(sum);
		if(sum !== 100){
			console.log("incorrect values");
			// this.handleConfirm();
		}
		else{
			console.log("correct values");
		}
	}

	// async function handleConfirm(){
	// 	try {
	// 		const response = await updateAdjustmentPercentages(this.state);
	// 		await response.json();
	// 		this.setState({message: 'העדכון הצליח', hasErrors: false});
	// 	}
	// 	catch (error) {
	// 		this.setState({message: `,העדכון נכשל.וודא שסך האחוזים שווה ל100 \n ${error.message}`, hasErrors: true});
	// 	}
	// 	this.toggleModal();
	// }

	return (
		<div>
		<Navbar history={props.history}/>
		<br/><h1>Choose your organization's adjustment percentages</h1>
		
		<br/><label>Date Rank
		<input value={dateRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setDateRank(e.target.value)} />
		</label>

		<br/><label>Language Rank
		<input value={languageRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setLanguageRank(e.target.value)} />
		</label>

		<br/><label>InterestRank
		<input value={interestRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setInterestRank(e.target.value)} />
		</label>

		<br/><label>Gender Rank
		<input value={genderRank} type='number' min='0' max='100' pattern="[0-9]*"
		onChange={e => setGenderRank(e.target.value)} />
		</label>
		<br/><br/>
		<button className="sb-btn" onClick={checkOnSubmit}>עדכון אחוזי התאמה מחדש</button>
		</div>
	  );
}
export default ChangeAdjustmentPercentages;
