export const categorizeServicePlans = (servicePlans, superGroups) => {
	const categories = [];
	superGroups.forEach(superGroup => {
		const category = {
			meta: {
				name: superGroup.name,
				_id: superGroup._id,
				type: 'superGroup',
			},
			items: [],
		};
		superGroup.subgroups.forEach(({ subgroup: subGroup }) => {
			if (subGroup.name.indexOf('NOT_SET') === 0) {
				return;
			}
			const subCategory = {
				meta: { name: subGroup.name, _id: subGroup._id, type: 'subGroup' },
				items: [],
			};

			subGroup.phases.forEach(({ phase }) => {
				const items = [];
				servicePlans.forEach(plan => {
					if (
						plan.services &&
						plan.services.map(service => service.phase).includes(phase._id)
					) {
						items.push(plan);
					}
				});
				const phaseCategory = {
					meta: { name: phase.name, _id: phase._id, type: 'phase' },
					items,
				};
				if (phaseCategory.items.length) {
					subCategory.items.push(phaseCategory);
				}
			});
			if (subCategory.items.length) {
				if (
					subCategory.items.length === 1 &&
					subCategory.items[0].meta.name === subCategory.meta.name
				) {
					// category.push(subCategory.items[0]);
					const phaseCategory = subCategory.items[0];
					subCategory.meta = phaseCategory.meta;
					subCategory.items = phaseCategory.items;
					// category.items.push(subCategory);
				}
				category.items.push(subCategory);
			}
		});
		if (category.items.length) {
			categories.push(category);
		}
	});
	return categories;
};
