import React, { useCallback, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { MdCheck } from 'react-icons/md';
import ReactModal from 'react-modal';
import { Alert, Button, Typography } from 'antd';
import createBookmarksAPI from 'apis/bookmarks';

import './Create.scss';

const { Title } = Typography;

const bookmarksApi = createBookmarksAPI();

const colors = [
	{ color: '#ee4c48', light: 'rgba(238, 76, 72, 1)' },
	{ color: '#f4a451', light: 'rgba(244, 164, 81, 1)' },
	{ color: '#f4ce56', light: 'rgba(244, 206, 86, 1)' },
	{ color: '#68ca48', light: 'rgba(104, 202, 72, 1)' },
	{ color: '#55b8f3', light: 'rgba(85, 184, 243, 1)' },
	{ color: '#cf85e1', light: 'rgba(207, 133, 225, 1)' },
	{ color: '#a4a4a7', light: 'rgba(164, 164, 167, 1)' },
];

const Create = ({
	isOpen,
	baseClass = 'create-bookmark-bucket',
	handleClose,
}) => {
	const [selectedColor, setSelectedStyle] = useState(null);
	const [name, setName] = useState('');
	const [error, setError] = useState(null);
	const createBucket = useCallback(() => {
		setError(null);
		bookmarksApi
			.createBucket({ name, color: selectedColor })
			.then(() => {
				handleClose();
			})
			.catch(e => {
				console.error(e);
				setError(e.message);
			});
	}, [name, selectedColor, handleClose]);
	const handleCreate = e => {
		e.preventDefault();
		if (isEmpty(name) || isEmpty(name.trim())) {
			setError('Enter list name');
		} else if (!selectedColor) {
			setError('Please select a color');
		} else {
			createBucket();
		}
	};
	useEffect(() => {
		setSelectedStyle(null);
		setName('');
		setError(null);
	}, [isOpen]);
	return (
		<ReactModal
			className={`${baseClass}-modal-content`}
			overlayClassName={`${baseClass}-modal-overlay`}
			isOpen={isOpen}
			onRequestClose={handleClose}
		>
			<Title level={3} className="heading">
				Create Bookmark List
			</Title>
			<form onSubmit={handleCreate} className="body">
				<input
					placeholder="Name"
					value={name}
					onChange={e => setName(e.target.value)}
					className="input"
				/>
				<div style={{ display: 'flex' }}>
					{colors.map(style => {
						const isSelected = style.color === selectedColor;
						return (
							<div
								onClick={() => setSelectedStyle(style.color)}
								style={{
									width: 18,
									height: 18,
									backgroundColor: style.light,
									borderRadius: 100,
									margin: 4,
									border: '2px solid ' + style.color,
									cursor: 'pointer',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									color: isSelected ? 'white' : 'transparent',
								}}
							>
								<MdCheck />
							</div>
						);
					})}
				</div>
				{error ? (
					<div style={{ marginTop: 8 }}>
						<Alert message={error} type="error" />
					</div>
				) : null}
			</form>
			<div className="footer">
				<Button onClick={handleClose} type="link">
					Cancel
				</Button>
				<Button htmlType="submit" onClick={handleCreate} type="primary">
					Create
				</Button>
			</div>
		</ReactModal>
	);
};

export default Create;
