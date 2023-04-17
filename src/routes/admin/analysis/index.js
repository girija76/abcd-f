import axios from 'axios';
import Loading from 'components/extra/Loading';
import Leaderboard from 'components/leaderboard/Leaderboard';
import { URLS } from 'components/urls';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userSelector } from 'selectors/user';
import { StudentCard } from '../../../components/admin/assessments/wrapper/index';

function Analysis() {
	const UserData = useSelector(userSelector);
	const phase = UserData.subscriptions[0].subgroups[0].phases[0].phase._id;
	const [loading, setLoading] = React.useState(true);
	const [students, setStudents] = React.useState([]);
	const history = useHistory();

	React.useEffect(() => {
		axios
			.get(`${URLS.backendAnalytics}/assessment/getUser/${phase}`, {
				withCredentials: true,
			})
			.then(res => {
				setLoading(false);
				setStudents(res.data);
			})
			.catch(e => {
				setLoading(false);
				setStudents([]);
				console.log(e);
			});
	}, [setStudents, setLoading]);

	return (
		<>
			{loading ? (
				<Loading simple />
			) : (
				<>
					<Leaderboard activePhase={phase} />
					{students.map((doc, key) => {
						return (
							<StudentCard
								key={key}
								value={doc}
								click={() => {
									history.push(`${URLS.adminAnalysisOverall}?uid=${doc._id}`);
								}}
							/>
						);
					})}
				</>
			)}
		</>
	);
}

export default Analysis;
