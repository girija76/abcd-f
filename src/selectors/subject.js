import { get } from 'lodash';
import { activePhaseSelector } from './user';

export const selectActivePhaseSubjectIds = state =>
	get(activePhaseSelector(state), ['subjects'], []);
