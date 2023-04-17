import {
	Card,
	Space,
	Form,
	Input,
	Checkbox,
	Tooltip,
	notification,
	Table,
} from 'antd';
import draftApi from 'apis/draft';
import DatePicker from 'components/inputs/DatePicker';
import { get, size, some } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AiFillEdit, AiFillInfoCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isNetworkError } from 'utils/axios';
import { useDebounce } from 'utils/hooks/debounce';
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

const DraftList = ({ renderKey }) => {
	const superGroups = useSelector(state => state.api.SuperGroups);
	const [superGroup, setSuperGroup] = useState();
	const [query, setQuery] = useState('');
	const [createdAfter, setCreatedAfter] = useState(null);
	const [createdBefore, setCreatedBefore] = useState(null);
	const [hasQuestionGroups, setHasOptionalQuestions] = useState('-1');
	const [drafts, setDrafts] = useState([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingError, setLoadingError] = useState(null);
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const debouncedQuery = useDebounce(query, 500);
	const [selectedDraftId, setSelectedDraftId] = useState(null);
	const [selectedAction, setSelectedAction] = useState(null);

	const loadList = useCallback(params => {
		setIsLoading(true);
		setLoadingError(null);
		draftApi
			.draftList(params)
			.then(({ drafts, total }) => {
				setIsLoading(false);
				setTotal(total);
				setDrafts(drafts);
			})
			.catch(err => {
				setIsLoading(false);
				if (isNetworkError(err)) {
					setLoadingError('Network error. Please retry.');
				} else {
					setLoadingError('Unknown error occurred. Please retry.');
				}
			});
	}, []);

	const [fetchParams, setFetchParams] = useState();
	const debouncedFetchParams = useDebounce(fetchParams, 100);

	const refresh = useCallback(() => {
		const currentPageIndex = currentPage - 1;
		const skip = currentPageIndex * pageSize;
		const limit = pageSize;
		const params = { superGroup, skip, limit, q: debouncedQuery };
		if (createdAfter) {
			if (!params.createdAt) {
				params.createdAt = {};
			}
			params.createdAt.$gte = createdAfter.startOf('day').valueOf();
		}
		if (createdBefore) {
			if (!params.createdAt) {
				params.createdAt = {};
			}
			params.createdAt.$lte = createdBefore.endOf('day').valueOf();
		}
		if (hasQuestionGroups) {
			params.hasQuestionGroups = hasQuestionGroups;
		}
		setFetchParams(params);
	}, [
		createdAfter,
		createdBefore,
		currentPage,
		debouncedQuery,
		hasQuestionGroups,
		pageSize,
		superGroup,
	]);

	const handleQueryChange = e => {
		setQuery(e.target.value);
		setCurrentPage(1);
	};
	const handleSupergroupChange = supergroup => {
		const dsg = localStorage.getItem('dsg');
		if (dsg !== supergroup) {
			localStorage.setItem('dsg', supergroup);
		}
		setSuperGroup(supergroup);
		setCurrentPage(1);
	};
	const handlePaginationChange = page => {
		setCurrentPage(page);
	};
	const handleShowSizeChange = (_current, size) => {
		setPageSize(size);
	};

	const handleCreatedAfterChange = date => {
		setCreatedAfter(date);
		setCurrentPage(1);
	};
	const handleCreatedBeforeChange = date => {
		setCreatedBefore(date);
		setCurrentPage(1);
	};

	const handleHasOptionalQuestionsToggle = () => {
		if (hasQuestionGroups === '1') {
			setHasOptionalQuestions('-1');
		} else if (hasQuestionGroups === '-1') {
			setHasOptionalQuestions('0');
		} else {
			setHasOptionalQuestions('1');
		}
		setCurrentPage(1);
	};

	useEffect(() => {
		if (loadingError) {
			notification.error({ message: loadingError, duration: 5000 });
		}
	}, [loadingError]);

	useEffect(() => {
		if (debouncedFetchParams) {
			loadList(debouncedFetchParams);
		}
	}, [debouncedFetchParams, loadList]);

	useEffect(() => {
		setSuperGroup(getDefaultSupergroup(superGroups));
	}, [superGroups]);

	useEffect(() => {
		refresh();
	}, [refresh, renderKey]);

	const paginationProps = useMemo(
		() => ({
			showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
			total,
			current: currentPage,
			pageSize,
			onChange: handlePaginationChange,
			onShowSizeChange: handleShowSizeChange,
			showQuickJumper: true,
		}),
		[currentPage, pageSize, total]
	);

	const columns = [
		{
			dataIndex: 'actions',
			title: 'Actions',
			width: 120,
			render: (_d, item) => {
				return (
					<Space>
						<Tooltip title="Set Questions">
							<Link
								className="ant-btn ant-btn-icon-only"
								to={`/dashboard/admin/assessments/draft/${item._id}`}
							>
								<AiFillEdit />
							</Link>
						</Tooltip>
						{/* <Dropdown
							trigger="click"
							arrow
							placement="topLeft"
							overlayStyle={{ border: 'solid 1px #eee' }}
							overlay={
								<Menu
									onClick={({ key }) => {
										switch (key) {
											case 'clone':
												setSelectedDraftId(item._id);
												setSelectedAction('clone');
												break;
											case 'archive':
												Modal.confirm({
													title: `Are you sure you want to archive "${item.name}"?`,
													onOk: () => archive(item._id),
												});
												break;
											case 'downloadTopics':
												adminApi
													.downloadQuestionTopicsOfAssessment('draft', item._id)
													.then((response) => {
														downloadCSVFile(response.data, `${item.name}-topics`);
													});
												break;
											default:
												break;
										}
									}}
								>
									<Menu.Item key="clone">
										<CopyOutlined /> Clone Draft
									</Menu.Item>
									<Menu.Item key="archive">
										<DeleteOutlined /> Archive
									</Menu.Item>
									{role === 'super' ? (
										<Menu.Item key="downloadTopics">
											<DownloadOutlined /> Download Topics
										</Menu.Item>
									) : null}
								</Menu>
							}
						>
							<Button icon={<MoreOutlined />} shape="circle" />
						</Dropdown> */}
						{/* {selectedAction === 'clone' && selectedDraftId === item._id ? (
							<CloneAssessmentDraft
								onCancel={() => {
									setSelectedAction(null);
									setSelectedDraftId(null);
								}}
								onComplete={() => {
									setSelectedAction(null);
									setSelectedDraftId(null);
									refresh();
								}}
								draft={item}
							/>
						) : null} */}
					</Space>
				);
			},
		},
		{
			dataIndex: 'name',
			title: 'Name',
		},
		{
			dataIndex: 'duration',
			title: 'Duration',
		},
		{
			dataIndex: 'sections',
			title: 'Sections',
			render: sections => size(sections),
		},
		{
			dataIndex: 'markingScheme',
			title: 'Marking Scheme',
			width: 150,
			render: markingScheme => {
				return (
					<div>
						<div>
							<Tooltip title="Multiple Choice Multiple Correct">MCMC</Tooltip>:{' '}
							{get(markingScheme, 'multipleCorrect')}
						</div>
						<div>
							<Tooltip title="Match the columns">Columns</Tooltip>:{' '}
							{get(markingScheme, 'matchTheColumns')}
						</div>
					</div>
				);
			},
		},
		{
			dataIndex: 'config',
			title: 'Other configs',
			render: config => {
				return (
					<div>
						<div>
							<Tooltip title="Question numbering">QNum</Tooltip>:{' '}
							{get(config, ['questionNumbering'], 'overall-increasing')}
						</div>
					</div>
				);
			},
		},
		{
			dataIndex: 'sections',
			title: 'Has Optional Ques.',
			render: sections =>
				some(sections, section => size(get(section, 'questionGroups')))
					? 'Yes'
					: 'No',
		},
	];

	return (
		<Space size="small" direction="vertical" style={{ width: '100%' }}>
			<Card>
				<Form layout="inline">
					<Form.Item>
						<Input
							style={{ width: 200 }}
							placeholder="Search by draft name"
							onChange={handleQueryChange}
							value={query}
						/>
					</Form.Item>
					<Form.Item label="Super Group">
						<Supergroups
							style={{ width: 200 }}
							supergroup={superGroup}
							onChange={handleSupergroupChange}
						/>
					</Form.Item>
					<Form.Item label="Created on or after">
						<DatePicker
							value={createdAfter}
							onChange={handleCreatedAfterChange}
							style={{ width: 200 }}
						/>
					</Form.Item>
					<Form.Item label="Created on or before">
						<DatePicker
							value={createdBefore}
							onChange={handleCreatedBeforeChange}
							style={{ width: 200 }}
						/>
					</Form.Item>
					<Form.Item>
						<Checkbox
							indeterminate={hasQuestionGroups === '-1'}
							checked={hasQuestionGroups === '1'}
							onChange={handleHasOptionalQuestionsToggle}
						>
							Has Optional Qs
						</Checkbox>
						<Tooltip
							title={
								<div>
									<div>Checked means, Yes(Which have optional questions)</div>
									<div>Unchecked means, No(which don't have Optional Questions)</div>
									<div>Indeterminate means, does not matter (include all)</div>
								</div>
							}
						>
							<AiFillInfoCircle />
						</Tooltip>
					</Form.Item>
				</Form>
			</Card>
			<Table
				rowKey="_id"
				pagination={{ position: ['topRight', 'bottomRight'], ...paginationProps }}
				loading={isLoading}
				dataSource={drafts}
				columns={columns}
			/>
		</Space>
	);
};

export default DraftList;
