export const isAtLeast = (requiredRole, role, above = 0) => {
	const roleOrder = ['user', 'mentor', 'moderator', 'admin', 'super'];
	const requiredRoleIndex = roleOrder.indexOf(requiredRole);
	const actualRoleIndex = roleOrder.indexOf(role);
	if (actualRoleIndex >= requiredRoleIndex + above) {
		return true;
	}
	return false;
};

export const isAtLeastMentor = role => isAtLeast('mentor', role);
export const isAtLeastModerator = role => isAtLeast('moderator', role);
export const isAtLeastAdmin = role => isAtLeast('admin', role);
export const isAtLeastSuper = role => isAtLeast('super', role);

export const isSuper = role => role === 'super';

export const allRoles = ['user', 'mentor', 'moderator', 'admin', 'super'];
