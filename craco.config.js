const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
	plugins: [
		{
			plugin: CracoAntDesignPlugin,
			options: {
				customizeTheme: {
					'@primary-color': 'rgb(26, 115, 232)',
					'@border-radius-base': '8px',
					'@border-color-split': '#dadce0',
					'@tabs-horizontal-margin': '0',
					'@tabs-horizontal-padding': '@padding-md @padding-md',
					'@tabs-horizontal-padding-lg': '@padding-md @padding-md',
					'@tabs-horizontal-padding-sm': '@padding-xs @padding-xs',
				},
				babelPluginImportOptions: {
					libraryName: 'lodash',
					libraryDirectory: '',
					camel2DashComponentName: false, // default: true
					style: false,
				},
			},
		},
	],
};
