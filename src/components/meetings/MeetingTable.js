import React from 'react';
import MeetingView from './MeetingView';

function MeetingTable({props,setModal}) {
	const meetings = props.history.location.state;

	return (
		<div className="meetings-table">
			{meetings?.length > 0
				?
				(<table className="users-table">
					<thead className="table-header">
					<tr>
						<th className="col-1">שם הקשיש</th>
						<th className="col-2">תאריך הפגישה</th>
						<th className="col-3">נושא הפגישה</th>
						<th className="col-4">פעולות</th>
					</tr>
					</thead>
					<tbody>
					{meetings?.map((meeting, index) => (
						<tr key={index} className="table-row">
							<MeetingView
								key={index}
								meeting={meeting}
								history={props.history}
								setModal={setModal}
							/>
						</tr>
					))}
					</tbody>
				</table>
				)
				: <>{'לא קיימות פגישות'}</>
			}
		</div>
	);
}

export default MeetingTable;