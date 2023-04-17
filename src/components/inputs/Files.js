import React, { useState } from 'react';
import { map } from 'lodash';
import FileUploader from './File';

function UploadFiles({ getPolicy, onChange, value }) {
	const [newKey, setNewKey] = useState(0);
	const handleAddNew = file => {
		const updatedFiles = Array.isArray(value) ? [...value, file] : [file];
		onChange(updatedFiles);
		setNewKey(newKey + 1);
	};
	const handleRemove = index => {
		onChange(value.filter((_f, i) => i !== index));
	};
	return (
		<div>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				{map(value, (file, index) => {
					return (
						<FileUploader
							key={index}
							{...file}
							onRemove={() => handleRemove(index)}
						/>
					);
				})}
				<FileUploader key={newKey} onAdd={handleAddNew} getPolicy={getPolicy} />
			</div>
		</div>
	);
}

export default UploadFiles;
