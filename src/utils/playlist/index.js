import { get } from 'lodash';
import { resourceTypeLabels } from 'utils/config';

const defaultLabelMap = {
	ResourceDocument: 'Document',
	Video: 'Video',
	Assignment: 'Assignment',
};
export function getLabelForResourceType(type) {
	return get(resourceTypeLabels, type, get(defaultLabelMap, type, type));
}

export function getPluralLabelForResourceType(type) {
	return `${getLabelForResourceType(type)}s`;
}
