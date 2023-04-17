import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { activePhaseIdSelector } from 'selectors/user';
import createOthersApi from 'apis/others';
import getWrappers from 'components/api/getwrappers';
import videoApi from 'apis/video';
import assignmentApi from 'apis/assignment';
import { createItemsById } from 'utils/store';
import { useGetAdminSubjects } from 'utils/hooks/phase';
import attendanceApi from 'apis/attendance';
import { map } from 'lodash-es';
import { useGetAllPhaseSubjects } from 'components/subject/hook';

dayjs.extend(advancedFormat);

const othersApi = createOthersApi();

export const useGetCoursePlan = () => {
	const activePhaseId = useSelector(activePhaseIdSelector);
	const { subjectIds } = useGetAdminSubjects();
	const { subjectsById } = useGetAllPhaseSubjects(activePhaseId);
	const {
		data: playlistData,
		isFetching,
		isFetched,
		refetch: refetchVideoCoursePlan,
	} = useQuery(
		['get-video-course-plan', activePhaseId],
		() => othersApi.getCoursePlan(activePhaseId),
		{
			staleTime: 60 * 60 * 1000,
		}
	);
	const { data: assessmentData, refetch: refetchAssessments } = useQuery(
		['get-assessments', activePhaseId],
		() => getWrappers(activePhaseId),
		{
			staleTime: 60 * 60 * 1000,
		}
	);
	const { data: completedVideos, refetch: refetchWatchedVideos } = useQuery(
		['get-watched-videos'],
		() => videoApi.getCompletedVideos(),
		{
			staleTime: 3e5,
		}
	);
	const {
		data: assignmentSubmissionsResponse,
		refetch: refetchAssignmentSubmissions,
	} = useQuery(
		['get-assignment-submissions'],
		() => assignmentApi.getMySubmissions(),
		{
			staleTime: 6e5,
			retry: 2,
		}
	);
	const {
		data: scheduledLectures,
		refetch: refetchScheduledLectures,
	} = useQuery(['get-scheduled-lectures', activePhaseId, subjectIds], () =>
		attendanceApi.listScheduledLectures({
			phases: [activePhaseId],
			subjects: subjectIds,
		})
	);
	const completedVideoIds = useMemo(() => {
		return Array.isArray(completedVideos) ? completedVideos.map(i => i.v) : [];
	}, [completedVideos]);
	const submissionsByAssignmentId = useMemo(
		() =>
			assignmentSubmissionsResponse
				? createItemsById(assignmentSubmissionsResponse.items, 'assignment')
				: {},
		[assignmentSubmissionsResponse]
	);

	const assessmentItems = useMemo(() => {
		return (assessmentData && assessmentData.assessmentWrappers) || [];
	}, [assessmentData]);
	const { items, now } = useMemo(
		() =>
			playlistData
				? { items: playlistData.items, now: dayjs(playlistData.now) }
				: {},
		[playlistData]
	);
	const itemsWithDayJSObject = useMemo(
		() =>
			items
				? items.map(item => ({
						...item,
						availableFrom: dayjs(item.availableFrom),
						availableTill: dayjs(item.availableTill),
						isCompleted: completedVideoIds.includes(get(item, ['resource', '_id'])),
						submission:
							item.submission ||
							get(submissionsByAssignmentId, [get(item, ['resource', '_id'])]),
				  }))
				: [],
		[completedVideoIds, items, submissionsByAssignmentId]
	);
	const assessmentItemsWithDayJsObject = useMemo(
		() =>
			assessmentItems.map(item => ({
				...item,
				availableFrom: dayjs(item.availableFrom),
				availableTill: dayjs(item.availableTill),
			})),
		[assessmentItems]
	);
	const scheduledLecturesDayJsObject = useMemo(
		() =>
			map(get(scheduledLectures, ['items']), scheduledLecture => {
				const subject = get(subjectsById, get(scheduledLecture, 'subject'), {
					name: 'Unknown Subject',
				});
				const subjectName = get(subject, 'name', 'Unknown Subject');
				return {
					...scheduledLecture,
					subjectName,
					title: get(scheduledLecture, 'label', subjectName),
					startTime: dayjs(scheduledLecture.startTime),
					endTime: dayjs(scheduledLecture.endTime),
					type: 'ScheduledLecture',
				};
			}),
		[scheduledLectures, subjectsById]
	);
	const allItems = useMemo(
		() => [
			...itemsWithDayJSObject,
			...assessmentItemsWithDayJsObject,
			...scheduledLecturesDayJsObject,
		],
		[
			assessmentItemsWithDayJsObject,
			itemsWithDayJSObject,
			scheduledLecturesDayJsObject,
		]
	);
	const refetch = useCallback(() => {
		refetchAssessments();
		refetchAssignmentSubmissions();
		refetchScheduledLectures();
		refetchVideoCoursePlan();
		refetchWatchedVideos();
	}, [
		refetchAssessments,
		refetchAssignmentSubmissions,
		refetchScheduledLectures,
		refetchVideoCoursePlan,
		refetchWatchedVideos,
	]);
	return { items: allItems, isFetching, isFetched, now, refetch };
};
