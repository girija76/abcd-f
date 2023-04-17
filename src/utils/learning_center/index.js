const resourceTypePredefinedOrder = ['Video', 'ResourceDocument'];
export const getResourceTypes = playlists => {
	const types = {};

	playlists.forEach(playlist => {
		types[playlist.resourceType] = true;
	});
	console.log(types);
	const predefinedOrderItems = resourceTypePredefinedOrder.filter(
		type => types[type]
	);

	const notDefinedItems = Object.keys(types).filter(
		key => resourceTypePredefinedOrder.indexOf(key) === -1
	);

	return [...predefinedOrderItems, ...notDefinedItems];
};

export const filterPlaylistsByResourceType = (playlists, resourceType) => {
	return playlists
		? playlists.filter(p =>
				resourceType === 'ResourceDocument'
					? p.resourceType === 'Book' || p.resourceType === 'ResourceDocument'
					: p.resourceType === resourceType
		  )
		: [];
};
