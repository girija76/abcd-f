import asyncComponent from 'components/AsyncComponent';

export default asyncComponent(
	() => import(/* webpackChunkName: "assesment-route"*/ './AsyncIndex'),
	'full'
);
