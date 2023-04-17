import { Button, Form, Image, Input, List, Tag } from 'antd';
import Text from 'antd/lib/typography/Text';
import assignmentApi from 'apis/assignment';
import videoApi from 'apis/video';
import { get } from 'lodash';
import React, { useMemo, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { useQuery } from 'react-query';
import { useDebounce } from 'utils/hooks/debounce';
import { getTagValueByKey } from 'utils/tags';

function VideoOrDocument({ resourceType, onSelect }) {
	const [typedQ, setTypedQ] = useState('');
	const q = useDebounce(typedQ, 300);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(10);
	const skip = (currentPage - 1) * pageSize;
	const { data, isFetching } = useQuery(
		['load-my-resources', resourceType, pageSize, skip, q],
		() =>
			(resourceType === 'Assignment'
				? assignmentApi.listAdminAssignments
				: videoApi.getMyUploads)({ resourceType, limit: pageSize, skip, q }),
		{
			staleTime: 6e4,
		}
	);
	const { items, total } = useMemo(() => data || { items: [], total: 0 }, [
		data,
	]);
	return (
		<div>
			<Form layout="vertical">
				<Form.Item>
					<Input
						placeholder="Search in title, description, and tags"
						value={typedQ}
						onChange={e => setTypedQ(e.target.value)}
					/>
				</Form.Item>
			</Form>
			<List
				loading={isFetching}
				dataSource={items}
				pagination={{ total, onChange: page => setCurrentPage(page) }}
				renderItem={item => {
					const topic = getTagValueByKey(get(item, 'tags'), 'Topic');
					const lectureNo = getTagValueByKey(get(item, 'tags'), 'Lect No.');
					return (
						<List.Item
							extra={
								<Button
									style={{ display: 'inline-flex', alignItems: 'center' }}
									icon={<AiOutlineCheck style={{ marginRight: 8 }} />}
									onClick={() => onSelect(item)}
								>
									Select
								</Button>
							}
						>
							<List.Item.Meta
								title={get(item, 'title')}
								avatar={
									<Image
										preview={false}
										src={get(item, ['thumbNailsUrls', 0])}
										width={120}
									/>
								}
								description={
									<>
										{lectureNo || topic ? (
											<div>
												{topic && <Tag color="geekblue">Topic: {topic}</Tag>}
												{lectureNo && <Tag color="cyan">Lecture No.: {lectureNo}</Tag>}
											</div>
										) : null}
										<Text type="secondary" ellipsis>
											{get(item, 'description')}
										</Text>
									</>
								}
							/>
						</List.Item>
					);
				}}
			/>
		</div>
	);
}

export default VideoOrDocument;
