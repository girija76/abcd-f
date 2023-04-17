import React from 'react';
import asyncComponent from 'components/AsyncComponent';
import { isCBT, apiBaseUrl } from 'utils/config';

const AsyncPrepleafEditor = asyncComponent(
	() => import(/* webpackChunkName: "prepleaf-editor"*/ 'prepleaf-editor'),
	'inline',
	30
);

const cbtImageURLTransformer = url => {
	return `${apiBaseUrl}/images?url=${encodeURIComponent(url)}`;
};

const StudentEditor = props => {
	return (
		<AsyncPrepleafEditor
			transformImageUrl={isCBT ? cbtImageURLTransformer : null}
			readOnly
			{...props}
		/>
	);
};

export default StudentEditor;
