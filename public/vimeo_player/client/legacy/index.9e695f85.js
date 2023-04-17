import {
	_ as t,
	a as r,
	b as e,
	c as n,
	i as o,
	d as a,
	S as c,
	s as i,
	e as s,
	f,
	g as u,
	h as l,
	j as h,
	k as d,
	l as p,
	m as v,
	n as y,
} from './client.72cf42cf.js';
function m(t) {
	var n = (function() {
		if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
		if (Reflect.construct.sham) return !1;
		if ('function' == typeof Proxy) return !0;
		try {
			return (
				Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
			);
		} catch (t) {
			return !1;
		}
	})();
	return function() {
		var o,
			a = r(t);
		if (n) {
			var c = r(this).constructor;
			o = Reflect.construct(a, arguments, c);
		} else o = a.apply(this, arguments);
		return e(this, o);
	};
}
function w(t) {
	var r, e;
	return {
		c: function() {
			(r = s('iframe')), this.h();
		},
		l: function(t) {
			(r = f(t, 'IFRAME', {
				title: !0,
				src: !0,
				frameborder: !0,
				allow: !0,
				style: !0,
			})),
				u(r).forEach(l),
				this.h();
		},
		h: function() {
			h(r, 'title', 'Video'),
				r.src !== (e = 'https://player.vimeo.com/video/' + t[0] + '?autoplay=1') &&
					h(r, 'src', e),
				h(r, 'frameborder', '0'),
				h(r, 'allow', 'autoplay'),
				d(r, 'width', '100vw'),
				d(r, 'height', '100vh'),
				d(r, 'border', 'none');
		},
		m: function(t, e) {
			p(t, r, e);
		},
		p: function(t, n) {
			1 & v(n, 1)[0] &&
				r.src !== (e = 'https://player.vimeo.com/video/' + t[0] + '?autoplay=1') &&
				h(r, 'src', e);
		},
		i: y,
		o: y,
		d: function(t) {
			t && l(r);
		},
	};
}
function R(t, r, e) {
	var n = '';
	'undefined' != typeof window &&
		((n = new URLSearchParams(window.location.search).get('i')),
		(document.body.style.overflowY = 'hidden'));
	return [n];
}
var b = (function(r) {
	t(s, c);
	var e = m(s);
	function s(t) {
		var r;
		return n(this, s), (r = e.call(this)), o(a(r), t, R, w, i, {}), r;
	}
	return s;
})();
export default b;
