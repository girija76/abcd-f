import classNames from 'classnames';
import React from 'react';
import './Checkbox.scss';

function Checkbox({
	checked,
	onChange,
	color = '#fff',
	backgroundColor = '#000',
	children,
}) {
	return (
		<span
			onClick={() => onChange(!checked)}
			className={classNames('prepleaf-calendar-checkbox-container', {
				checked,
			})}
		>
			<div className="prepleaf-calendar-checkbox">
				<div className="inner" style={{ borderColor: backgroundColor }}>
					<div className="tick">
						<div className="tick-inner">
							<div className="f"></div>
							<div className="s"></div>
						</div>
					</div>
				</div>
			</div>
			<span>{children}</span>
		</span>
	);
}

export default Checkbox;
