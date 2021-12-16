import React from 'react';

const FullDetailsMeetings = ({meetings,title}) => {
	return (
		<div>
			היסטוריית פגישות:
			<div className="details-list">
				<div className="container">
					<div className="meetings-table">
						{meetings?.length > 0
							?
							(<table className="users-table">
									<thead className="table-header">
									<tr>
										<th className="col-1">{title}</th>
										<th className="col-2">תאריך</th>
										<th className="col-3">נושא הפגישה</th>
									</tr>
									</thead>
									<tbody>
									{meetings?.map((meeting, index) => (
										<tr key={index} className="table-row">
											<td className="col-1">{meeting.firstName + ' ' + meeting.lastName}</td>
											<td className="col-2">{meeting.meeting}</td>
											<td className="col-3">{meeting.meetingSubject}</td>
										</tr>
									))}
									</tbody>
								</table>
							)
							: <>{'לא קיימות פגישות'}</>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FullDetailsMeetings;
