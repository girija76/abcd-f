import { Alert, Button, Col, Form, Input, Row, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import assignmentApi from 'apis/assignment';
import FileUploader from 'components/inputs/File';
import { get, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

function FileUploaderWrapper({ value, onRemove }) {
	return <FileUploader onRemove={onRemove} name={value.name} url={value.url} />;
}

function MarkingSchemeInput({ onChange, value, sectionNumber }) {
	return (
		<div>
			<Text style={{ marginBottom: 4, display: 'block' }}>
				Section #{sectionNumber}
			</Text>
			<Row gutter={[8, 8]} style={{ marginBottom: 8 }}>
				<Col xs={12}>
					<Input
						placeholder={'Section Name'}
						value={value.name}
						onChange={e =>
							onChange({ name: e.target.value, maxMarks: value.maxMarks })
						}
					/>
				</Col>
				<Col xs={12}>
					<Input
						type="number"
						placeholder="Maximum marks"
						value={value.maxMarks}
						onChange={e => onChange({ name: value.name, maxMarks: e.target.value })}
					/>
				</Col>
			</Row>
		</div>
	);
}

function UploadAssignment({ resource, onCancel, onUpload, showCancel }) {
	const [form] = Form.useForm();
	const [isNew, setIsNew] = useState(false);
	const assignmentId = get(resource, '_id');
	const [error, setError] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const handleSubmit = values => {
		if (!values.files || !values.files.length) {
			setError('Add at least one file');
			return;
		}
		const {
			title,
			description,
			files,
			tags,
			'markingScheme.sections': sections,
		} = values;
		if (!sections || !sections.length) {
			setError('Please set marking scheme');
			return;
		}
		setError(null);
		setIsCreating(true);
		const data = {
			title,
			description,
			files,
			thumbNailsUrls: [],
			tags,
			markingScheme: {
				sections,
			},
		};
		if (!isNew) {
			data.id = assignmentId;
		}
		const promise = isNew
			? assignmentApi.createAssignment(data)
			: assignmentApi.updateAssignment(data);
		promise
			.then(({ assignment }) => {
				onUpload(assignment);
			})
			.finally(() => {
				setIsCreating(false);
			});
	};
	useEffect(() => {
		if (resource) {
			const { title, description, files, markingScheme } = resource;
			const markingSchemeSections = get(markingScheme, 'sections');
			const values = {
				title,
				description,
				files,
				'markingScheme.sections': markingSchemeSections,
			};
			setIsNew(false);
			form.setFieldsValue(values);
		} else {
			setIsNew(true);
		}
	}, [resource, form]);
	return (
		<Form onFinish={handleSubmit} layout="vertical" form={form}>
			<Form.Item
				name="title"
				label="Title"
				rules={[{ required: true, message: 'Assignment title is required' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item name="description" label="Description">
				<Input.TextArea />
			</Form.Item>
			<Form.List label="Files" name="files">
				{(fields, { add, remove }) => (
					<>
						<Text>Uploaded files</Text>
						<Row>
							{map(fields, (field, index) => {
								return (
									<Col>
										<Form.Item {...field} noStyle>
											<FileUploaderWrapper onRemove={() => remove(field.name)} />
										</Form.Item>
									</Col>
								);
							})}
							<Col>
								<FileUploader
									key={fields.length}
									getPolicy={assignmentApi.getAdminUploadPolicy}
									onAdd={({ name, url }) => {
										add({ name, url });
									}}
								/>
							</Col>
						</Row>
					</>
				)}
			</Form.List>
			<Form.List name="markingScheme.sections">
				{(fields, { add, remove }) => {
					return (
						<>
							<Text style={{ display: 'block', paddingBottom: 8 }}>
								Marking Scheme
							</Text>
							{map(fields, (field, index) => {
								return (
									<Form.Item {...field} noStyle>
										<MarkingSchemeInput sectionNumber={index + 1} />
									</Form.Item>
								);
							})}
							<Button
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									marginBottom: 8,
								}}
								icon={<AiOutlinePlus style={{ marginRight: 6 }} />}
								onClick={() => add({ name: '', maxMarks: 0 })}
							>
								Add Section
							</Button>
						</>
					);
				}}
			</Form.List>
			{error && (
				<Form.Item>
					<Alert type="error" message={error} />
				</Form.Item>
			)}

			<Space style={{ marginTop: 12, display: 'flex' }}>
				<Button htmlType="submit" type="primary" loading={isCreating}>
					{isNew ? 'Create Assignment' : 'Update Assignment'}
				</Button>
				{showCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
			</Space>
		</Form>
	);
}

export default UploadAssignment;
