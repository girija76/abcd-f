import asyncComponent from 'components/AsyncComponent';

// const AsyncCartDialog = asyncComponent(
// 	() => import(/* webpackChunkName: "cart-dialog" */ './Cart').CartDialog
// );
export default asyncComponent(() =>
	import(/* webpackChunkName: "cart" */ './Cart')
);

// export default AsyncCart;
