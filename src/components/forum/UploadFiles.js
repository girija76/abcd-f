import React from 'react';
import createForumApi from 'apis/forum';
import UploadFiles from 'components/inputs/Files';

const forumApi = createForumApi();

function ForumFilesUploader(props) {
	return <UploadFiles getPolicy={forumApi.getUploadPolicy} {...props} />;
}

export default ForumFilesUploader;
