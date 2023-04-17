import React, { useCallback, useState } from 'react';
import { Button, Space } from 'antd';
import ReactCrop from 'react-image-crop';
import Jimp from 'jimp';
import { useBoolean } from 'use-boolean';
// import 'react-image-crop/src/ReactCrop.scss';
import 'react-image-crop/dist/ReactCrop.css';

const imageBaseStyle = { width: '100%' };
const minSize = 200;
const getBestPosition = dimen => {
	if (dimen < minSize + 2) {
		return {
			start: 0,
			distance: dimen,
		};
	}
	const distance = Math.max(minSize, parseInt(dimen / 2, 10));
	return { distance };
};

const getBestCrop = (height, width) => {
	const { distance: cropHeight } = getBestPosition(height);
	const { distance: cropWidth } = getBestPosition(width);
	const cropDimen = Math.min(cropHeight, cropWidth);
	const x = parseInt((width - cropDimen) / 2, 10);
	const y = parseInt((height - cropDimen) / 2, 10);
	return { height: cropDimen, width: cropDimen, x, y, aspect: 1 };
};

function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	const byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	const mimeString = dataURI
		.split(',')[0]
		.split(':')[1]
		.split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	const ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	const ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	const blob = new Blob([ab], { type: mimeString });
	return blob;
}

const cropImage = (rawImageSrc, initialCrop, cropImageDimensions, cb) => {
	let image = new Image();
	image.onload = () => {
		const yScale = image.height / cropImageDimensions.height;
		const xScale = image.width / cropImageDimensions.width;
		const crop = {
			x: initialCrop.x * xScale,
			y: initialCrop.y * yScale,
			width: initialCrop.width * xScale,
			height: initialCrop.height * yScale,
		};
		const canvas = document.createElement('canvas');
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(
			image,
			crop.x,
			crop.y,
			crop.width,
			crop.height,
			0,
			0,
			crop.width,
			crop.height
		);
		const mime = rawImageSrc.split(';')[0].replace('data:', '');
		const supportedTypes = [
			Jimp.MIME_PNG,
			Jimp.MIME_BMP,
			Jimp.MIME_JPEG,
			Jimp.MIME_X_MS_BMP,
		];
		const setToMime = supportedTypes.includes(mime) ? mime : Jimp.MIME_PNG;
		const dataUrl = canvas.toDataURL(setToMime);

		Jimp.read(dataUrl).then(jimpImage => {
			jimpImage
				.resize(200, 200)
				.getBase64Async(Jimp.AUTO)
				.then(result => {
					const blob = dataURItoBlob(result);
					if (blob.size > 20000) {
						jimpImage
							.quality(parseInt((20000 / blob.size) * 100))
							.getBase64Async(Jimp.AUTO)
							.then(r => {
								const nB = dataURItoBlob(r);
								cb(nB, setToMime);
							});
					} else {
						cb(blob, setToMime);
					}
				});
		});
	};
	image.src = rawImageSrc;
};

function Cropper({ onCancel, src, onComplete, isUploading }) {
	const [crop, setCrop] = useState({});
	const [isDisabled, setIsDisabled] = useState(false);
	const [isProcessing, setIsProcessing, setIsNotProcessing] = useBoolean();
	const [imageDimensions, setImageDimensions] = useState({
		height: 200,
		width: 200,
	});
	const handleCropChange = crop => {
		setCrop(crop);
	};
	const handleImageLoad = useCallback(image => {
		setImageDimensions({ height: image.height, width: image.width });
		setCrop(getBestCrop(image.height, image.width));
		if (image.height <= minSize && image.width <= minSize) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
		return false;
	}, []);
	const handleComplete = crop => {
		setCrop(crop);
	};
	const handleUpload = useCallback(() => {
		setIsProcessing();
		cropImage(src, crop, imageDimensions, image => {
			onComplete(image);
			setIsNotProcessing();
		});
	}, [
		crop,
		imageDimensions,
		onComplete,
		setIsNotProcessing,
		setIsProcessing,
		src,
	]);
	return (
		<Space size="large" direction="vertical" style={{ display: 'flex' }}>
			<ReactCrop
				src={src}
				crop={crop}
				onChange={handleCropChange}
				style={{
					position: 'relative',
					backgroundColor: '#fff',
					filter: 'brightness(90%)',
					width: '100%',
				}}
				disabled={isDisabled}
				keepSelection
				minWidth={minSize}
				minHeight={minSize}
				onImageLoaded={handleImageLoad}
				imageStyle={imageBaseStyle}
				onComplete={handleComplete}
			/>
			<Space style={{ display: 'flex' }}>
				<Button
					loading={isUploading || isProcessing}
					type="primary"
					onClick={handleUpload}
				>
					Upload
				</Button>
				<Button disabled={isUploading || isProcessing} onClick={onCancel}>
					Cancel
				</Button>
			</Space>
		</Space>
	);
}

export default Cropper;
