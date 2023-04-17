import {
	S as e,
	i as t,
	s as o,
	e as a,
	c as s,
	a as r,
	d as i,
	b as l,
	f as c,
	g as n,
	n as d,
} from './client.97f83049.js';
function h(e) {
	let t, o;
	return {
		c() {
			(t = a('iframe')), this.h();
		},
		l(e) {
			(t = s(e, 'IFRAME', {
				title: !0,
				src: !0,
				frameborder: !0,
				allow: !0,
				style: !0,
			})),
				r(t).forEach(i),
				this.h();
		},
		h() {
			l(t, 'title', 'Video'),
				t.src !== (o = 'https://player.vimeo.com/video/' + e[0] + '?autoplay=1') &&
					l(t, 'src', o),
				l(t, 'frameborder', '0'),
				l(t, 'allow', 'autoplay'),
				c(t, 'width', '100vw'),
				c(t, 'height', '100vh'),
				c(t, 'border', 'none');
		},
		m(e, o) {
			n(e, t, o);
		},
		p(e, [a]) {
			1 & a &&
				t.src !== (o = 'https://player.vimeo.com/video/' + e[0] + '?autoplay=1') &&
				l(t, 'src', o);
		},
		i: d,
		o: d,
		d(e) {
			e && i(t);
		},
	};
}
function f(e, t, o) {
	let a = '';
	if ('undefined' != typeof window) {
		(a = new URLSearchParams(window.location.search).get('i')),
			(document.body.style.overflowY = 'hidden');
	}
	return [a];
}
export default class extends e {
	constructor(e) {
		super(), t(this, e, f, h, o, {});
	}
}
