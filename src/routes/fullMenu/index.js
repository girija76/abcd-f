import { SidebarNavigationGroup } from 'components/dashboard/SideNavigation';
import { getConfigGenerator } from 'configs/navigation';
import { get, map } from 'lodash-es';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { activePhaseSelector, userSelector } from 'selectors/user';

function FullMenuRoutes(props) {
	const user = useSelector(userSelector);

	let activePhase = useSelector(activePhaseSelector);
	const configGenerator = useMemo(
		() => getConfigGenerator('mobile', 'full'),
		[]
	);
	const sideConfig = useMemo(() => configGenerator(activePhase, user, null), [
		activePhase,
		configGenerator,
		user,
	]);
	return (
		<div
			className="full-navigation"
			style={{ display: 'block', background: 'white' }}
		>
			{map(get(sideConfig, 'items'), item => {
				return <SidebarNavigationGroup group={item} collapsed={false} />;
			})}
		</div>
	);
}

export default FullMenuRoutes;
