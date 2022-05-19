import React from 'react';
import { VideoComponent } from '../video/VideoComponent';

const VideoCallPage = (props) => {
	
	const videoOptions = props.history.location.state.videoOptions;
	const isElderly = props.history.location.state.isElderly;
	const volunteer = props.history.location.state.volunteer;
	console.log(JSON.stringify(props.history.location.state))

	return (
		<div className="no-sidebar-page">
			<VideoComponent videoOptions={videoOptions} volunteer={volunteer} isElderly={isElderly} history={props.history}/>
		</div>
	);
}

export default VideoCallPage;