/* eslint-disable no-nested-ternary */
import React from 'react';
import Default from './headOneComponents/default';
import Cat from './headOneComponents/cat';
import Tangedco from './headOneComponents/Tangedco';
import Jobs from './headOneComponents/jobs';
import SMS from './headOneComponents/sms';
import Sat from './headOneComponents/sat';
import Resonance from './headOneComponents/Resonance';
import Prepniti from './headOneComponents/prepniti';
import SatyaClasses from './headOneComponents/satya-classes';
import JNV from './headOneComponents/jnv';
import { clientAlias, name } from 'utils/config';
import './HeadOne.scss';

const HeadOne = ({ view }) => {
	console.log(name);
	if (clientAlias === 'cat') {
		return <Cat view={view} />;
	} else if (clientAlias === 'onlinetangedco') {
		return <Tangedco view={view} />;
	} else if (clientAlias === 'placement') {
		return <Jobs view={view} />;
	} else if (clientAlias === 'sat') {
		return <Sat view={view} />;
	} else if (name === 'SMS') {
		return <SMS view={view} />;
	} else if (name === 'Resonance') {
		return <Resonance view={view} />;
	} else if (name === 'Prepniti') {
		return <Prepniti view={view} />;
	} else if (clientAlias === 'satya') {
		return <SatyaClasses view={view} />;
	} else if (clientAlias === 'jnv') {
		return <JNV view={view} />;
	} else {
		return <Default view={view} />;
	}
};

export default HeadOne;
