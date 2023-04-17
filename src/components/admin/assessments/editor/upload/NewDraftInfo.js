import { Input, Modal, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Supergroups from 'utils/Supergroups';

const getDefaultSupergroup = SuperGroups => {
	const dsg = localStorage.getItem('dsg');
	let found = false;
	SuperGroups.forEach(sg => {
		if (sg._id === dsg) {
			found = true;
		}
	});
	if (found) {
		return dsg;
	} else {
		if (SuperGroups.length === 1) {
			localStorage.setItem('dsg', SuperGroups[0]._id);
			return SuperGroups[0]._id;
		}
	}
	return '';
};

const NewDraftInfo = ({
	creatingDraft,
	handleSaveDraft,
	hideDraft,
	draft,
	setDraft,
}) => {
	const handleSupergroupChange = supergroup => {
		const dsg = localStorage.getItem('dsg');
		if (dsg !== supergroup) {
			localStorage.setItem('dsg', supergroup);
		}
		setDraft({
			...draft,
			supergroup: supergroup,
		});
	};

	const superGroups = useSelector(state => state.api.SuperGroups);

	useEffect(() => {
		setDraft({
			...draft,
			supergroup: getDefaultSupergroup(superGroups),
		});
	}, [superGroups]);

	return (
		<>
			<Modal
				width="60%"
				title="Name Assignment"
				visible={creatingDraft}
				onOk={handleSaveDraft}
				onCancel={hideDraft}
				centered
			>
				<div>
					<Typography>Name of Assingment</Typography>
					<Input
						placeholder="Name"
						value={draft.name}
						onChange={e =>
							setDraft({
								...draft,
								name: e.target.value,
							})
						}
					/>

					<Typography>Time</Typography>
					<Input
						placeholder="Time"
						type="number"
						value={draft.duration}
						onChange={e => {
							setDraft({
								...draft,
								duration: e.target.value,
							});
						}}
					/>

					<Typography>SuperGroup</Typography>

					<Supergroups
						style={{ width: 200 }}
						supergroup={draft.supergroup}
						onChange={handleSupergroupChange}
					/>
				</div>
			</Modal>
		</>
	);
};

export default NewDraftInfo;
