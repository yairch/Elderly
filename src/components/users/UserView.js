import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import checkIcon from '../../resources/check-logo.png';
import '../manage/manage.css';

function UserView({toggleModal, user, setUser}) {
	const setModal = () => {
		setUser(user);
		toggleModal();
	};
	useEffect(() => {
		ReactTooltip.rebuild();
	}, [user]);
	return (
		<React.Fragment>
			<td className="col-1">{user.elderly.firstName + " " +user.elderly.lastName}</td>
			<td className="col-2">{JSON.stringify(user.commonServices)}</td>
			<td className="col-3">
				<p data-tip={user.elderly.username} data-for={`tooltip-${user.elderly.username}`}>
					{(user.finalRank*1).toFixed() + '%'}
				</p>
				<ReactTooltip id={`tooltip-${user.username}`} getContent={() => {
					// return (
					// 	<div className="tooltip">
					// 		{/* {'סוגי שירות משותפים:  ' + (user.commonServices.length > 0 ? user.commonServices.toString() : 'אין')} */}
					// 		{'סוגי שירות משותפים:  ' + (JSON.stringify(user.commonServices))}
					// 		{/* {'סוגי שירות משותפים:  ' + ('אין')} */}
					// 		<br />
					// 		{/* {'תחומי עניין משותפים:  ' + (user.commonAreaOfInterest.length > 0 ? user.commonAreaOfInterest.toString() : 'אין')} */}
					// 		{'תחומי עניין משותפים:  ' + ('אין')}
					// 		<br/>
					// 		{/* {'שפות משותפות:  ' + (user.commonLanguages.length > 0 ? user.commonLanguages.toString() : 'אין')} */}
					// 		{'שפות משותפות:  ' + ('אין')}
					// 		<br/>
					// 		{/* {'ימים ושעות מועדפים משותפים:  ' + (user.commonPreferredDays?.length > 0 ? user.commonPreferredDays?.toString() : 'אין')} */}
					// 		{'ימים ושעות מועדפים משותפים:  ' + ('אין')}
					// 		<br/>
					// 		{'מגדר מועדף על הקשיש:  ' + user.preferredGender.value}
					// 	</div>
					// );
				}}/>
			</td>
			<td className="col-4">
				<button className="check-icon-button">
					<img src={checkIcon} alt="v" onClick={setModal}/>
				</button>
			</td>
		</React.Fragment>
	);
}

export default UserView;