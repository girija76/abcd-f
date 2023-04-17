import asyncComponent from 'components/AsyncComponent';

export default asyncComponent(() =>
	import(/* webpackChunkName: "learning_center"*/ './AsyncIndex')
);
