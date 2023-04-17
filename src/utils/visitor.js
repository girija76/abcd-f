import { URLS } from '../components/urls';
export function createVisitor(search) {
	const searchParams = new URLSearchParams(search);
	let source = '';
	if (searchParams.get('utm_source')) {
		source = searchParams.get('utm_source');
	} else if (searchParams.get('fbclid')) {
		source = 'facebook';
	} else if (searchParams.get('tele')) {
		source = 'telegram';
	} else if (searchParams.get('wapp')) {
		source = 'whatsapp';
	} else if (searchParams.get('code')) {
		source = 'referralcode';
	}
	if (source) {
		fetch(`${URLS.backendUnauthorized}/cvis?source=${source}`, {
			method: 'GET',
			credentials: 'include',
		});
	}
}
