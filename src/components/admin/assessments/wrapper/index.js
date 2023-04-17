import { Button, Card, Col, Row, Spin } from 'antd';
import axios from 'axios';
import Loading from 'components/extra/Loading';
import { URLS } from 'components/urls';
import React from 'react';
import { useHistory } from 'react-router-dom';

const styles = {
	verticalCenter: {
		display: 'flex',
		height: '100%',
		alignItems: 'center',
	},
	hvCenter: {
		display: 'flex',
		height: '100%',
		alignItems: 'center',
		justifyItems: 'center',
	},
	margin0: {
		margin: 0,
	},
};

export function StudentCard({ index, value, click, marks }) {
	const history = useHistory();
	const searchParams = new URLSearchParams(window.location.search);
	return (
		<Card hoverable style={{ margin: '1rem 1rem' }}>
			<Row>
				<Col sm={24} lg={12}>
					<Row style={{ height: '100%' }}>
						<Col sm={6} lg={2} style={styles.verticalCenter}>
							<img src={value.dp} style={styles.margin0} />
						</Col>
						<Col
							sm={18}
							lg={22}
							style={{ padding: '1rem', ...styles.verticalCenter }}
						>
							<h4 style={styles.margin0}>
								{value.name} <br />
								{value.email}
							</h4>
						</Col>
					</Row>
				</Col>
				<Col sm={24} lg={12}>
					<Row style={{ height: '100%' }}>
						<Col sm={12} style={styles.verticalCenter}>
							{marks && <h4 style={styles.margin0}>Marks Scored : {marks}</h4>}
						</Col>
						<Col
							sm={12}
							style={{
								padding: '1rem',
								textAlign: 'center',
								...styles.verticalCenter,
							}}
						>
							<Button size="large" onClick={click}>
								View Stats
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	);
}

function WrapperStats() {
	const history = useHistory();
	const [marks, setMarks] = React.useState([]);
	const [maxMarks, setMaxMarks] = React.useState(0);
	const [name, setName] = React.useState('');
	const [loading, setLoading] = React.useState(true);
	const searchParams = new URLSearchParams(window.location.search);

	const getmarks = React.useCallback(async () => {
		setLoading(true);
		if (searchParams.get('wid')) {
			axios
				.get(
					URLS.backendAnalytics + `/assessment/marks/${searchParams.get('wid')}`,
					{
						withCredentials: true,
					}
				)
				.then(response => {
					if (response.status === 200) {
						setMarks(response.data.marks);
						setMaxMarks(response.data.maxMarks);
						setName(response.data.name);
						setLoading(false);
					} else {
						setLoading(false);
						console.log(response);
						history.push(URLS.compete);
					}
				})
				.catch(err => {
					setLoading(false);
					console.log(err);
					history.push(URLS.compete);
				});
		} else {
			setLoading(false);
			console.log('Other error');
			window.location.href = URLS.dashboard;
		}
	}, [setMarks, setMaxMarks, setName]);

	React.useEffect(() => {
		getmarks();
	}, [getmarks]);

	return (
		<>
			{loading ? (
				<Loading simple />
			) : (
				<>
					<Row>
						<Col span={12}>
							<h1>Name : {name} </h1>
						</Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<h1>Max Marks : {maxMarks} </h1>
						</Col>
					</Row>
					{marks.map((value, key) => {
						return (
							<StudentCard
								marks={value.marks}
								value={value.user}
								index={key}
								key={key}
								click={() => {
									history.push(
										`${URLS.analysisId}?wid=${searchParams.get('wid')}&uid=${
											value.user._id
										}`
									);
								}}
							/>
						);
					})}
				</>
			)}
		</>
	);
}
export default WrapperStats;
