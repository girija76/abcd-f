import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const createVideoApi = () => {
	const baseFeedbackApi = createBaseApi(`${apiBaseUrl}/feedback`);
	return {
		getFormWrapper: ({ item, itemRef, formFor, otherRefs }) =>
			baseFeedbackApi
				.post(
					'/form-wrapper/public/get',
					{
						otherRefs,
					},
					{
						params: { item, itemRef, formFor, otherRefs },
					}
				)
				.then(res => res.data),
		submitResponse: ({ responseByQuestionItemId, formWrapper, otherRefs }) =>
			baseFeedbackApi
				.post('/form/response/submit', {
					responseByQuestionItemId,
					formWrapper,
					otherRefs,
				})
				.then(res => res.data),
		getMyResponse: ({ formWrapper, otherRefs }) =>
			baseFeedbackApi.get('/form/response/my-response').then(res => res.data),
	};
};

const feedbackApi = createVideoApi();
export default feedbackApi;
