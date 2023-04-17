import { URLS } from 'components/urls';
// TODO: delete or implement tour
export function getSteps(mode, activePhase, history) {
	let path = window.location.pathname;

	if (mode !== 'demo') {
		const steps = [
			{
				selector: '.notification-icon',
				content:
					'You will be notified when there are any updates on questions / assessments you follow, or when someone requests a solution of question from you.',
			},
			{
				selector: '.goal-container',
				resizeObservables: ['.dynamic-cards'],
				content:
					'This is your progress, will be updated after every practice session or assessment you attempt.',
				action: () => {
					let homeActive = false;
					if (
						window.location.pathname === URLS.dashboard ||
						window.location.pathname === URLS.home
					) {
						homeActive = true;
					}

					if (!homeActive) history.push(URLS.home);
				},
			},
			{
				selector: '.my-bookmarks-button',
				content:
					'This is where you can find your bookmarked questions. Bookmarking difficult questions for future revisions is a simple but very effective strategy to fill your holes.',
				action: () => {
					const bookmarksActive =
						path.indexOf(URLS.profileBookmarks) !== -1 ? true : false;
					if (!bookmarksActive) history.push(URLS.profileBookmarks);
				},
			},
			{
				selector: '.activity-title',
				content:
					'You can checkout your practice sessions and the notes that you took during the practice session here.',
				action: () => {
					const bookmarksActive =
						path.indexOf(URLS.activity + '/practice_session') !== -1 ? true : false;
					if (!bookmarksActive) history.push(URLS.activity + '/practice_session');
				},
			},
			{
				selector: '.feedback-wrapper',
				content:
					'Reach out to us anytime if your are facing any issues or just for giving feedback. We would love to hear from you.',
			},
		];
		return steps;
	}
}
