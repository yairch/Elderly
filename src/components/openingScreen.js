import React from 'react';
import plusIcon from '../resources/plus-icon.png';

const OpeningScreen = () => (
	<div className="page-content">
		<div>
			<img id="plusIcon" src={plusIcon}/>
		</div>
		<div className="center-page">
			<div id="chooseOptionTitle">
				בחר אופציה מהתפריט הצדדי
			</div>
		</div>
	</div>
);

export default OpeningScreen;
