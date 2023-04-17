import React from 'react';
import { get, split, map } from 'lodash';

function Files({ items }) {
	return (
		<div>
			{map(items, (item, index) => {
				return (
					<a
						key={index}
						href={get(item, 'url')}
						target="_blank"
						rel="noreferrer"
						style={{ display: 'block' }}
					>
						{get(item, ['name'], get(split(get(item, 'url'), '/'), ['0']))}
					</a>
				);
			})}
		</div>
	);
}

export default Files;
