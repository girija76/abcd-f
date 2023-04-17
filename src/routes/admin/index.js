import asyncComponent from 'components/AsyncComponent';

export default asyncComponent(
	() => import(/* webpackChunkName: "admin-route"*/ './AsyncIndex'),
	'full'
);
