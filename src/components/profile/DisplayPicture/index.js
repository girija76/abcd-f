import React, { useCallback, useEffect, useRef } from 'react';
import { Button, message, Modal, Spin } from 'antd';
import { map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'use-boolean';
// import Cropper from './Cropper';
import { URLS } from 'components/urls';
import './styles.scss';
import { updateUserData } from 'components/api/ApiAction';
import asyncComponent from 'components/AsyncComponent';
import { AiFillCamera } from 'react-icons/ai';

const AsyncCropper = asyncComponent(
	() => import(/* webpackChunkName: "profile-image-cropper"*/ './Cropper'),
	'inline',
	30
);

const getSignedURL = mime => {
	return fetch(URLS.backendUsers + `/avatar/policy?mime=${mime}`, {
		method: 'GET',
		headers: { Accept: 'application/json' },
		credentials: 'include',
	}).then(res => res.json());
};

const uploadImage = (file, onComplete) => {
	const fileMime = file.type;
	let mime = 'image/png';
	if (typeof mime === 'undefined' || mime === 'undefined') {
		mime = fileMime;
	}
	getSignedURL(mime).then(
		({
			attachment: {
				data: { url: uploadURL, fields },
				filePath,
			},
		}) => {
			const formData = new FormData();
			map(fields, (value, key) => {
				formData.append(key, value);
			});
			formData.append('file', file);
			fetch(uploadURL, {
				method: 'POST',
				headers: { Accept: 'application/json, text/plain, */*' },
				body: formData,
			}).then(() => {
				fetch(URLS.backendUsers + '/avatar/update', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						url: uploadURL + '/' + filePath,
					}),
				})
					.then(res => res.json())
					.then(res => {
						onComplete(res.user.dp);
					});
			});
		}
	);
};

const userSelector = state => state.api.UserData;
function DisplayPicture() {
	const fileInputRef = useRef();
	const inputImage = useRef();
	const user = useSelector(userSelector);
	const displayPicture = user.dp;
	const dispatch = useDispatch();
	const [isModalOpen, openModal, closeModal] = useBoolean(false);
	const [isReadingFile, setIsReadingFile, setIsNotReadingFile] = useBoolean();
	const [isEditing, setIsEditing, setIsNotEditing] = useBoolean();
	const [isUploading, setIsUploading, setIsNotUploading] = useBoolean(false);

	const handleEditButtonClick = () => {
		fileInputRef.current.value = '';
		fileInputRef.current.click();
	};
	const handleFileChange = e => {
		const file = e.target.files[0];
		if (file) {
			openModal();
			setIsReadingFile();
			const reader = new FileReader();
			reader.onload = e => {
				const imageFile = e.target.result;
				inputImage.current = imageFile;

				setIsNotReadingFile();
				setIsEditing();
			};
			reader.readAsDataURL(file);
		}
	};
	const onPictureChange = useCallback(
		updatedDisplayPicture => {
			dispatch(
				updateUserData({
					...user,
					dp: updatedDisplayPicture,
					thumbnail: updatedDisplayPicture,
				})
			);
			setIsNotUploading(true);
			closeModal();
			message.success('Profile picture uploaded');
		},
		[closeModal, dispatch, setIsNotUploading, user]
	);
	const handleCropComplete = useCallback(
		image => {
			setIsUploading();
			uploadImage(image, onPictureChange);
		},
		[onPictureChange, setIsUploading]
	);
	useEffect(() => {
		if (!isModalOpen) {
			setIsNotEditing(false);
		}
	}, [setIsNotEditing, isModalOpen]);
	return (
		<div className="profile-display-picture-container">
			<div className="image-container">
				<img src={displayPicture} alt="your profile" className="image" />
			</div>
			<Button
				size="medium"
				shape="circle"
				type="primary"
				ghost
				onClick={handleEditButtonClick}
				data-ga-on="click"
				data-ga-event-action="click"
				data-ga-event-category="profile"
				data-ga-event-label="Change DP SM-button"
				className="change-picture-button"
				icon={<AiFillCamera style={{ fontSize: '	' }} />}
			/>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				className="file-input"
			/>
			<Modal
				visible={isModalOpen}
				closable={false}
				onCancel={closeModal}
				centered
				footer={null}
				destroyOnClose
			>
				{isReadingFile ? <Spin /> : null}
				{isEditing ? (
					<AsyncCropper
						isUploading={isUploading}
						onCancel={closeModal}
						onComplete={handleCropComplete}
						src={inputImage.current}
					/>
				) : null}
			</Modal>
		</div>
	);
}

export default DisplayPicture;
