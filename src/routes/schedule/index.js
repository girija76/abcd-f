import asyncComponent from 'components/AsyncComponent';

export default asyncComponent(
	() => import(/* webpackChunkName: "schedule-route"*/ './AsyncIndex'),
	'full'
);
