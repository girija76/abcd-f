import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ApiReducer from './components/api/ApiReducer.js';
import sessionReducer from 'reducers/session';
import discussionReducer from 'reducers/discussion';
import liveTestReducer from 'reducers/liveTest';
import userAccountReducer from 'reducers/userAccount';
import topicReducer from 'reducers/topic';

const middlewares = [thunk];
const composeParams = [applyMiddleware(...middlewares)];
if (
	process.env.NODE_ENV === 'development' &&
	window.__REDUX_DEVTOOLS_EXTENSION__
) {
	composeParams.push(
		window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 })
	);
}
const store = createStore(
	combineReducers({
		api: ApiReducer,
		session: sessionReducer,
		discussion: discussionReducer,
		liveTest: liveTestReducer,
		userAccount: userAccountReducer,
		topic: topicReducer,
	}),
	compose(...composeParams)
);

export default store;
