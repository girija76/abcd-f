import React from 'react';
import { Typography } from 'antd';
import { BsCheck } from 'react-icons/bs';
import { map } from 'lodash';
import { phaseLabel } from 'utils/config';

const { Text } = Typography;

export const TopbarDropdownAccountSelector = ({ value, onChange, options }) => {
	return (
		<div className="topbar-account-dropdown-button mobile-only">
			<div style={{ textAlign: 'left' }}>
				<Text type="secondary">Switch {phaseLabel}</Text>
				{map(options, option => {
					return (
						<button
							onClick={() => onChange(option.value)}
							key={option.value}
							style={{
								border: 'none',
								background: 'transparent',
								padding: 0,
								lineHeight: '36px',
								display: 'flex',
								alignItems: 'center',
								width: '100%',
							}}
						>
							<span style={{ display: 'inline-flex', minWidth: 21 }}>
								{option.value === value ? (
									<BsCheck color="green" fontSize="1rem" />
								) : null}
							</span>
							{option.label}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export const NavigationDrawerAccountSelector = ({
	value,
	onChange,
	options,
}) => {
	return (
		<div style={{ textAlign: 'left', lineHeight: 'normal' }}>
			<Text style={{ paddingTop: 8, display: 'inline-block' }} type="secondary">
				Switch {phaseLabel}
			</Text>
			{map(options, option => {
				return (
					<button
						onClick={() => onChange(option.value)}
						key={option.value}
						style={{
							border: 'none',
							background: 'transparent',
							padding: 0,
							lineHeight: '48px',
							display: 'flex',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<span style={{ display: 'inline-flex', minWidth: 32 }}>
							{option.value === value ? (
								<BsCheck color="green" fontSize="1.2rem" />
							) : null}
						</span>
						{option.label}
					</button>
				);
			})}
		</div>
	);
};
