function t() {}
function e(t, e) {
	for (const n in e) t[n] = e[n];
	return t;
}
function n(t) {
	return t();
}
function r() {
	return Object.create(null);
}
function o(t) {
	t.forEach(n);
}
function s(t) {
	return 'function' == typeof t;
}
function i(t, e) {
	return t != t
		? e == e
		: t !== e || (t && 'object' == typeof t) || 'function' == typeof t;
}
function c(t, n, r, o) {
	return t[1] && o ? e(r.ctx.slice(), t[1](o(n))) : r.ctx;
}
function a(t, e, n, r, o, s, i) {
	const a = (function(t, e, n, r) {
		if (t[2] && r) {
			const o = t[2](r(n));
			if (void 0 === e.dirty) return o;
			if ('object' == typeof o) {
				const t = [],
					n = Math.max(e.dirty.length, o.length);
				for (let r = 0; r < n; r += 1) t[r] = e.dirty[r] | o[r];
				return t;
			}
			return e.dirty | o;
		}
		return e.dirty;
	})(e, r, o, s);
	if (a) {
		const o = c(e, n, r, i);
		t.p(o, a);
	}
}
function l(t, e) {
	t.appendChild(e);
}
function u(t, e, n) {
	t.insertBefore(e, n || null);
}
function f(t) {
	t.parentNode.removeChild(t);
}
function p(t) {
	return document.createElement(t);
}
function d(t) {
	return document.createTextNode(t);
}
function h() {
	return d(' ');
}
function m() {
	return d('');
}
function g(t, e, n) {
	null == n
		? t.removeAttribute(e)
		: t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function $(t) {
	return Array.from(t.childNodes);
}
function y(t, e, n, r) {
	for (let r = 0; r < t.length; r += 1) {
		const o = t[r];
		if (o.nodeName === e) {
			let e = 0;
			const s = [];
			for (; e < o.attributes.length; ) {
				const t = o.attributes[e++];
				n[t.name] || s.push(t.name);
			}
			for (let t = 0; t < s.length; t++) o.removeAttribute(s[t]);
			return t.splice(r, 1)[0];
		}
	}
	return r
		? (function(t) {
				return document.createElementNS('http://www.w3.org/2000/svg', t);
		  })(e)
		: p(e);
}
function b(t, e) {
	for (let n = 0; n < t.length; n += 1) {
		const r = t[n];
		if (3 === r.nodeType) return (r.data = '' + e), t.splice(n, 1)[0];
	}
	return d(e);
}
function v(t) {
	return b(t, ' ');
}
function _(t, e) {
	(e = '' + e), t.wholeText !== e && (t.data = e);
}
function x(t, e, n, r) {
	t.style.setProperty(e, n, r ? 'important' : '');
}
let w;
function E(t) {
	w = t;
}
function S() {
	if (!w) throw new Error('Function called outside component initialization');
	return w;
}
const R = [],
	N = [],
	P = [],
	L = [],
	A = Promise.resolve();
let O = !1;
function j(t) {
	P.push(t);
}
let U = !1;
const q = new Set();
function C() {
	if (!U) {
		U = !0;
		do {
			for (let t = 0; t < R.length; t += 1) {
				const e = R[t];
				E(e), T(e.$$);
			}
			for (E(null), R.length = 0; N.length; ) N.pop()();
			for (let t = 0; t < P.length; t += 1) {
				const e = P[t];
				q.has(e) || (q.add(e), e());
			}
			P.length = 0;
		} while (R.length);
		for (; L.length; ) L.pop()();
		(O = !1), (U = !1), q.clear();
	}
}
function T(t) {
	if (null !== t.fragment) {
		t.update(), o(t.before_update);
		const e = t.dirty;
		(t.dirty = [-1]),
			t.fragment && t.fragment.p(t.ctx, e),
			t.after_update.forEach(j);
	}
}
const k = new Set();
let B;
function I() {
	B = { r: 0, c: [], p: B };
}
function J() {
	B.r || o(B.c), (B = B.p);
}
function K(t, e) {
	t && t.i && (k.delete(t), t.i(e));
}
function M(t, e, n, r) {
	if (t && t.o) {
		if (k.has(t)) return;
		k.add(t),
			B.c.push(() => {
				k.delete(t), r && (n && t.d(1), r());
			}),
			t.o(e);
	}
}
function V(t, e) {
	const n = {},
		r = {},
		o = { $$scope: 1 };
	let s = t.length;
	for (; s--; ) {
		const i = t[s],
			c = e[s];
		if (c) {
			for (const t in i) t in c || (r[t] = 1);
			for (const t in c) o[t] || ((n[t] = c[t]), (o[t] = 1));
			t[s] = c;
		} else for (const t in i) o[t] = 1;
	}
	for (const t in r) t in n || (n[t] = void 0);
	return n;
}
function D(t) {
	return 'object' == typeof t && null !== t ? t : {};
}
function H(t) {
	t && t.c();
}
function Y(t, e) {
	t && t.l(e);
}
function z(t, e, r) {
	const { fragment: i, on_mount: c, on_destroy: a, after_update: l } = t.$$;
	i && i.m(e, r),
		j(() => {
			const e = c.map(n).filter(s);
			a ? a.push(...e) : o(e), (t.$$.on_mount = []);
		}),
		l.forEach(j);
}
function F(t, e) {
	const n = t.$$;
	null !== n.fragment &&
		(o(n.on_destroy),
		n.fragment && n.fragment.d(e),
		(n.on_destroy = n.fragment = null),
		(n.ctx = []));
}
function G(t, e) {
	-1 === t.$$.dirty[0] &&
		(R.push(t), O || ((O = !0), A.then(C)), t.$$.dirty.fill(0)),
		(t.$$.dirty[(e / 31) | 0] |= 1 << e % 31);
}
function W(e, n, s, i, c, a, l = [-1]) {
	const u = w;
	E(e);
	const p = n.props || {},
		d = (e.$$ = {
			fragment: null,
			ctx: null,
			props: a,
			update: t,
			not_equal: c,
			bound: r(),
			on_mount: [],
			on_destroy: [],
			before_update: [],
			after_update: [],
			context: new Map(u ? u.$$.context : []),
			callbacks: r(),
			dirty: l,
			skip_bound: !1,
		});
	let h = !1;
	if (
		((d.ctx = s
			? s(e, p, (t, n, ...r) => {
					const o = r.length ? r[0] : n;
					return (
						d.ctx &&
							c(d.ctx[t], (d.ctx[t] = o)) &&
							(!d.skip_bound && d.bound[t] && d.bound[t](o), h && G(e, t)),
						n
					);
			  })
			: []),
		d.update(),
		(h = !0),
		o(d.before_update),
		(d.fragment = !!i && i(d.ctx)),
		n.target)
	) {
		if (n.hydrate) {
			const t = $(n.target);
			d.fragment && d.fragment.l(t), t.forEach(f);
		} else d.fragment && d.fragment.c();
		n.intro && K(e.$$.fragment), z(e, n.target, n.anchor), C();
	}
	E(u);
}
class X {
	$destroy() {
		F(this, 1), (this.$destroy = t);
	}
	$on(t, e) {
		const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
		return (
			n.push(e),
			() => {
				const t = n.indexOf(e);
				-1 !== t && n.splice(t, 1);
			}
		);
	}
	$set(t) {
		var e;
		this.$$set &&
			((e = t), 0 !== Object.keys(e).length) &&
			((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
	}
}
const Q = [];
function Z(e, n = t) {
	let r;
	const o = [];
	function s(t) {
		if (i(e, t) && ((e = t), r)) {
			const t = !Q.length;
			for (let t = 0; t < o.length; t += 1) {
				const n = o[t];
				n[1](), Q.push(n, e);
			}
			if (t) {
				for (let t = 0; t < Q.length; t += 2) Q[t][0](Q[t + 1]);
				Q.length = 0;
			}
		}
	}
	return {
		set: s,
		update: function(t) {
			s(t(e));
		},
		subscribe: function(i, c = t) {
			const a = [i, c];
			return (
				o.push(a),
				1 === o.length && (r = n(s) || t),
				i(e),
				() => {
					const t = o.indexOf(a);
					-1 !== t && o.splice(t, 1), 0 === o.length && (r(), (r = null));
				}
			);
		},
	};
}
const tt = {};
function et(t) {
	let e;
	const n = t[1].default,
		r = (function(t, e, n, r) {
			if (t) {
				const o = c(t, e, n, r);
				return t[0](o);
			}
		})(n, t, t[0], null);
	return {
		c() {
			r && r.c();
		},
		l(t) {
			r && r.l(t);
		},
		m(t, n) {
			r && r.m(t, n), (e = !0);
		},
		p(t, [e]) {
			r && r.p && 1 & e && a(r, n, t, t[0], e, null, null);
		},
		i(t) {
			e || (K(r, t), (e = !0));
		},
		o(t) {
			M(r, t), (e = !1);
		},
		d(t) {
			r && r.d(t);
		},
	};
}
function nt(t, e, n) {
	let { $$slots: r = {}, $$scope: o } = e;
	return (
		(t.$$set = t => {
			'$$scope' in t && n(0, (o = t.$$scope));
		}),
		[o, r]
	);
}
class rt extends X {
	constructor(t) {
		super(), W(this, t, nt, et, i, {});
	}
}
function ot(e) {
	let n,
		r,
		o,
		s,
		i,
		c,
		a,
		g = e[0].message + '';
	return {
		c() {
			(n = p('h1')),
				(r = d(e[1])),
				(o = h()),
				(s = p('p')),
				(i = d(g)),
				(c = h()),
				(a = m());
		},
		l(t) {
			n = y(t, 'H1', {});
			var l = $(n);
			(r = b(l, e[1])), l.forEach(f), (o = v(t)), (s = y(t, 'P', {}));
			var u = $(s);
			(i = b(u, g)), u.forEach(f), (c = v(t)), (a = m());
		},
		m(t, e) {
			u(t, n, e), l(n, r), u(t, o, e), u(t, s, e), l(s, i), u(t, c, e), u(t, a, e);
		},
		p(t, [e]) {
			2 & e && _(r, t[1]), 1 & e && g !== (g = t[0].message + '') && _(i, g);
		},
		i: t,
		o: t,
		d(t) {
			t && f(n), t && f(o), t && f(s), t && f(c), t && f(a);
		},
	};
}
function st(t, e, n) {
	let { error: r } = e,
		{ status: o } = e;
	return (
		(t.$$set = t => {
			'error' in t && n(0, (r = t.error)), 'status' in t && n(1, (o = t.status));
		}),
		[r, o]
	);
}
class it extends X {
	constructor(t) {
		super(), W(this, t, st, ot, i, { error: 0, status: 1 });
	}
}
function ct(t) {
	let n, r, o;
	const s = [t[4].props];
	var i = t[4].component;
	function c(t) {
		let n = {};
		for (let t = 0; t < s.length; t += 1) n = e(n, s[t]);
		return { props: n };
	}
	return (
		i && (n = new i(c())),
		{
			c() {
				n && H(n.$$.fragment), (r = m());
			},
			l(t) {
				n && Y(n.$$.fragment, t), (r = m());
			},
			m(t, e) {
				n && z(n, t, e), u(t, r, e), (o = !0);
			},
			p(t, e) {
				const o = 16 & e ? V(s, [D(t[4].props)]) : {};
				if (i !== (i = t[4].component)) {
					if (n) {
						I();
						const t = n;
						M(t.$$.fragment, 1, 0, () => {
							F(t, 1);
						}),
							J();
					}
					i
						? ((n = new i(c())),
						  H(n.$$.fragment),
						  K(n.$$.fragment, 1),
						  z(n, r.parentNode, r))
						: (n = null);
				} else i && n.$set(o);
			},
			i(t) {
				o || (n && K(n.$$.fragment, t), (o = !0));
			},
			o(t) {
				n && M(n.$$.fragment, t), (o = !1);
			},
			d(t) {
				t && f(r), n && F(n, t);
			},
		}
	);
}
function at(t) {
	let e, n;
	return (
		(e = new it({ props: { error: t[0], status: t[1] } })),
		{
			c() {
				H(e.$$.fragment);
			},
			l(t) {
				Y(e.$$.fragment, t);
			},
			m(t, r) {
				z(e, t, r), (n = !0);
			},
			p(t, n) {
				const r = {};
				1 & n && (r.error = t[0]), 2 & n && (r.status = t[1]), e.$set(r);
			},
			i(t) {
				n || (K(e.$$.fragment, t), (n = !0));
			},
			o(t) {
				M(e.$$.fragment, t), (n = !1);
			},
			d(t) {
				F(e, t);
			},
		}
	);
}
function lt(t) {
	let e, n, r, o;
	const s = [at, ct],
		i = [];
	function c(t, e) {
		return t[0] ? 0 : 1;
	}
	return (
		(e = c(t)),
		(n = i[e] = s[e](t)),
		{
			c() {
				n.c(), (r = m());
			},
			l(t) {
				n.l(t), (r = m());
			},
			m(t, n) {
				i[e].m(t, n), u(t, r, n), (o = !0);
			},
			p(t, o) {
				let a = e;
				(e = c(t)),
					e === a
						? i[e].p(t, o)
						: (I(),
						  M(i[a], 1, 1, () => {
								i[a] = null;
						  }),
						  J(),
						  (n = i[e]),
						  n || ((n = i[e] = s[e](t)), n.c()),
						  K(n, 1),
						  n.m(r.parentNode, r));
			},
			i(t) {
				o || (K(n), (o = !0));
			},
			o(t) {
				M(n), (o = !1);
			},
			d(t) {
				i[e].d(t), t && f(r);
			},
		}
	);
}
function ut(t) {
	let n, r;
	const o = [{ segment: t[2][0] }, t[3].props];
	let s = { $$slots: { default: [lt] }, $$scope: { ctx: t } };
	for (let t = 0; t < o.length; t += 1) s = e(s, o[t]);
	return (
		(n = new rt({ props: s })),
		{
			c() {
				H(n.$$.fragment);
			},
			l(t) {
				Y(n.$$.fragment, t);
			},
			m(t, e) {
				z(n, t, e), (r = !0);
			},
			p(t, [e]) {
				const r =
					12 & e
						? V(o, [4 & e && { segment: t[2][0] }, 8 & e && D(t[3].props)])
						: {};
				147 & e && (r.$$scope = { dirty: e, ctx: t }), n.$set(r);
			},
			i(t) {
				r || (K(n.$$.fragment, t), (r = !0));
			},
			o(t) {
				M(n.$$.fragment, t), (r = !1);
			},
			d(t) {
				F(n, t);
			},
		}
	);
}
function ft(t, e, n) {
	let { stores: r } = e,
		{ error: o } = e,
		{ status: s } = e,
		{ segments: i } = e,
		{ level0: c } = e,
		{ level1: a = null } = e,
		{ notify: l } = e;
	var u, f, p;
	return (
		(u = l),
		S().$$.after_update.push(u),
		(f = tt),
		(p = r),
		S().$$.context.set(f, p),
		(t.$$set = t => {
			'stores' in t && n(5, (r = t.stores)),
				'error' in t && n(0, (o = t.error)),
				'status' in t && n(1, (s = t.status)),
				'segments' in t && n(2, (i = t.segments)),
				'level0' in t && n(3, (c = t.level0)),
				'level1' in t && n(4, (a = t.level1)),
				'notify' in t && n(6, (l = t.notify));
		}),
		[o, s, i, c, a, r, l]
	);
}
class pt extends X {
	constructor(t) {
		super(),
			W(this, t, ft, ut, i, {
				stores: 5,
				error: 0,
				status: 1,
				segments: 2,
				level0: 3,
				level1: 4,
				notify: 6,
			});
	}
}
const dt = [],
	ht = [
		{
			js: () =>
				Promise.all([import('./index.449ab452.js')]).then(function(t) {
					return t[0];
				}),
		},
	],
	mt = [{ pattern: /^\/$/, parts: [{ i: 0 }] }];
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function gt(t, e, n, r) {
	return new (n || (n = Promise))(function(o, s) {
		function i(t) {
			try {
				a(r.next(t));
			} catch (t) {
				s(t);
			}
		}
		function c(t) {
			try {
				a(r.throw(t));
			} catch (t) {
				s(t);
			}
		}
		function a(t) {
			var e;
			t.done
				? o(t.value)
				: ((e = t.value),
				  e instanceof n
						? e
						: new n(function(t) {
								t(e);
						  })).then(i, c);
		}
		a((r = r.apply(t, e || [])).next());
	});
}
function $t(t) {
	for (; t && 'A' !== t.nodeName.toUpperCase(); ) t = t.parentNode;
	return t;
}
let yt,
	bt = 1;
const vt =
		'undefined' != typeof history
			? history
			: { pushState: () => {}, replaceState: () => {}, scrollRestoration: 'auto' },
	_t = {};
let xt, wt;
function Et(t) {
	const e = Object.create(null);
	return (
		t.length > 0 &&
			t
				.slice(1)
				.split('&')
				.forEach(t => {
					const [, n, r = ''] = /([^=]*)(?:=(.*))?/.exec(
						decodeURIComponent(t.replace(/\+/g, ' '))
					);
					'string' == typeof e[n] && (e[n] = [e[n]]),
						'object' == typeof e[n] ? e[n].push(r) : (e[n] = r);
				}),
		e
	);
}
function St(t) {
	if (t.origin !== location.origin) return null;
	if (!t.pathname.startsWith(xt)) return null;
	let e = t.pathname.slice(xt.length);
	if (('' === e && (e = '/'), !dt.some(t => t.test(e))))
		for (let n = 0; n < mt.length; n += 1) {
			const r = mt[n],
				o = r.pattern.exec(e);
			if (o) {
				const n = Et(t.search),
					s = r.parts[r.parts.length - 1],
					i = s.params ? s.params(o) : {},
					c = { host: location.host, path: e, query: n, params: i };
				return { href: t.href, route: r, match: o, page: c };
			}
		}
}
function Rt(t) {
	if (
		1 !==
		(function(t) {
			return null === t.which ? t.button : t.which;
		})(t)
	)
		return;
	if (t.metaKey || t.ctrlKey || t.shiftKey || t.altKey) return;
	if (t.defaultPrevented) return;
	const e = $t(t.target);
	if (!e) return;
	if (!e.href) return;
	const n =
			'object' == typeof e.href && 'SVGAnimatedString' === e.href.constructor.name,
		r = String(n ? e.href.baseVal : e.href);
	if (r === location.href) return void (location.hash || t.preventDefault());
	if (e.hasAttribute('download') || 'external' === e.getAttribute('rel')) return;
	if (n ? e.target.baseVal : e.target) return;
	const o = new URL(r);
	if (o.pathname === location.pathname && o.search === location.search) return;
	const s = St(o);
	if (s) {
		Lt(s, null, e.hasAttribute('sapper:noscroll'), o.hash),
			t.preventDefault(),
			vt.pushState({ id: yt }, '', o.href);
	}
}
function Nt() {
	return { x: pageXOffset, y: pageYOffset };
}
function Pt(t) {
	if (((_t[yt] = Nt()), t.state)) {
		const e = St(new URL(location.href));
		e ? Lt(e, t.state.id) : (location.href = location.href);
	} else
		(bt = bt + 1),
			(function(t) {
				yt = t;
			})(bt),
			vt.replaceState({ id: yt }, '', location.href);
}
function Lt(t, e, n, r) {
	return gt(this, void 0, void 0, function*() {
		const o = !!e;
		if (o) yt = e;
		else {
			const t = Nt();
			(_t[yt] = t), (yt = e = ++bt), (_t[yt] = n ? t : { x: 0, y: 0 });
		}
		if (
			(yield wt(t),
			document.activeElement &&
				document.activeElement instanceof HTMLElement &&
				document.activeElement.blur(),
			!n)
		) {
			let t,
				n = _t[e];
			r &&
				((t = document.getElementById(r.slice(1))),
				t && (n = { x: 0, y: t.getBoundingClientRect().top + scrollY })),
				(_t[yt] = n),
				o || t ? scrollTo(n.x, n.y) : scrollTo(0, 0);
		}
	});
}
function At(t) {
	let e = t.baseURI;
	if (!e) {
		const n = t.getElementsByTagName('base');
		e = n.length ? n[0].href : t.URL;
	}
	return e;
}
let Ot,
	jt = null;
function Ut(t) {
	const e = $t(t.target);
	e &&
		'prefetch' === e.rel &&
		(function(t) {
			const e = St(new URL(t, At(document)));
			if (e)
				(jt && t === jt.href) || (jt = { href: t, promise: Wt(e) }), jt.promise;
		})(e.href);
}
function qt(t) {
	clearTimeout(Ot),
		(Ot = setTimeout(() => {
			Ut(t);
		}, 20));
}
function Ct(t, e = { noscroll: !1, replaceState: !1 }) {
	const n = St(new URL(t, At(document)));
	return n
		? (vt[e.replaceState ? 'replaceState' : 'pushState']({ id: yt }, '', t),
		  Lt(n, null, e.noscroll))
		: ((location.href = t), new Promise(() => {}));
}
const Tt = 'undefined' != typeof __SAPPER__ && __SAPPER__;
let kt,
	Bt,
	It,
	Jt = !1,
	Kt = [],
	Mt = '{}';
const Vt = {
	page: (function(t) {
		const e = Z(t);
		let n = !0;
		return {
			notify: function() {
				(n = !0), e.update(t => t);
			},
			set: function(t) {
				(n = !1), e.set(t);
			},
			subscribe: function(t) {
				let r;
				return e.subscribe(e => {
					(void 0 === r || (n && e !== r)) && t((r = e));
				});
			},
		};
	})({}),
	preloading: Z(null),
	session: Z(Tt && Tt.session),
};
let Dt, Ht, Yt;
function zt(t, e) {
	const { error: n } = t;
	return Object.assign({ error: n }, e);
}
function Ft(t) {
	return gt(this, void 0, void 0, function*() {
		kt && Vt.preloading.set(!0);
		const e = (function(t) {
				return jt && jt.href === t.href ? jt.promise : Wt(t);
			})(t),
			n = (Bt = {}),
			r = yield e,
			{ redirect: o } = r;
		if (n === Bt)
			if (o) yield Ct(o.location, { replaceState: !0 });
			else {
				const { props: e, branch: n } = r;
				yield Gt(n, e, zt(e, t.page));
			}
	});
}
function Gt(t, e, n) {
	return gt(this, void 0, void 0, function*() {
		Vt.page.set(n),
			Vt.preloading.set(!1),
			kt
				? kt.$set(e)
				: ((e.stores = {
						page: { subscribe: Vt.page.subscribe },
						preloading: { subscribe: Vt.preloading.subscribe },
						session: Vt.session,
				  }),
				  (e.level0 = { props: yield It }),
				  (e.notify = Vt.page.notify),
				  (kt = new pt({ target: Yt, props: e, hydrate: !0 }))),
			(Kt = t),
			(Mt = JSON.stringify(n.query)),
			(Jt = !0),
			(Ht = !1);
	});
}
function Wt(t) {
	return gt(this, void 0, void 0, function*() {
		const { route: e, page: n } = t,
			r = n.path.split('/').filter(Boolean);
		let o = null;
		const s = { error: null, status: 200, segments: [r[0]] },
			i = {
				fetch: (t, e) => fetch(t, e),
				redirect: (t, e) => {
					if (o && (o.statusCode !== t || o.location !== e))
						throw new Error('Conflicting redirects');
					o = { statusCode: t, location: e };
				},
				error: (t, e) => {
					(s.error = 'string' == typeof e ? new Error(e) : e), (s.status = t);
				},
			};
		if (!It) {
			const t = () => ({});
			It =
				Tt.preloaded[0] ||
				t.call(i, { host: n.host, path: n.path, query: n.query, params: {} }, Dt);
		}
		let c,
			a = 1;
		try {
			const o = JSON.stringify(n.query),
				l = e.pattern.exec(n.path);
			let u = !1;
			c = yield Promise.all(
				e.parts.map((e, c) =>
					gt(this, void 0, void 0, function*() {
						const f = r[c];
						if (
							((function(t, e, n, r) {
								if (r !== Mt) return !0;
								const o = Kt[t];
								return (
									!!o &&
									(e !== o.segment ||
										!(
											!o.match ||
											JSON.stringify(o.match.slice(1, t + 2)) ===
												JSON.stringify(n.slice(1, t + 2))
										) ||
										void 0)
								);
							})(c, f, l, o) && (u = !0),
							(s.segments[a] = r[c + 1]),
							!e)
						)
							return { segment: f };
						const p = a++;
						if (!Ht && !u && Kt[c] && Kt[c].part === e.i) return Kt[c];
						u = !1;
						const { default: d, preload: h } = yield ht[e.i].js();
						let m;
						return (
							(m =
								Jt || !Tt.preloaded[c + 1]
									? h
										? yield h.call(
												i,
												{
													host: n.host,
													path: n.path,
													query: n.query,
													params: e.params ? e.params(t.match) : {},
												},
												Dt
										  )
										: {}
									: Tt.preloaded[c + 1]),
							(s['level' + p] = {
								component: d,
								props: m,
								segment: f,
								match: l,
								part: e.i,
							})
						);
					})
				)
			);
		} catch (t) {
			(s.error = t), (s.status = 500), (c = []);
		}
		return { redirect: o, props: s, branch: c };
	});
}
var Xt, Qt, Zt;
Vt.session.subscribe(t =>
	gt(void 0, void 0, void 0, function*() {
		if (((Dt = t), !Jt)) return;
		Ht = !0;
		const e = St(new URL(location.href)),
			n = (Bt = {}),
			{ redirect: r, props: o, branch: s } = yield Wt(e);
		n === Bt &&
			(r
				? yield Ct(r.location, { replaceState: !0 })
				: yield Gt(s, o, zt(o, e.page)));
	})
),
	(Xt = { target: document.querySelector('#sapper') }),
	(Qt = Xt.target),
	(Yt = Qt),
	(Zt = Tt.baseUrl),
	(xt = Zt),
	(wt = Ft),
	'scrollRestoration' in vt && (vt.scrollRestoration = 'manual'),
	addEventListener('beforeunload', () => {
		vt.scrollRestoration = 'auto';
	}),
	addEventListener('load', () => {
		vt.scrollRestoration = 'manual';
	}),
	addEventListener('click', Rt),
	addEventListener('popstate', Pt),
	addEventListener('touchstart', Ut),
	addEventListener('mousemove', qt),
	Tt.error
		? Promise.resolve().then(() =>
				(function() {
					const { host: t, pathname: e, search: n } = location,
						{ session: r, preloaded: o, status: s, error: i } = Tt;
					It || (It = o && o[0]);
					const c = {
							error: i,
							status: s,
							session: r,
							level0: { props: It },
							level1: { props: { status: s, error: i }, component: it },
							segments: o,
						},
						a = Et(n);
					Gt([], c, { host: t, path: e, query: a, params: {}, error: i });
				})()
		  )
		: Promise.resolve().then(() => {
				const { hash: t, href: e } = location;
				vt.replaceState({ id: bt }, '', e);
				const n = St(new URL(location.href));
				if (n) return Lt(n, bt, !0, t);
		  });
export {
	X as S,
	$ as a,
	g as b,
	y as c,
	f as d,
	p as e,
	x as f,
	u as g,
	W as i,
	t as n,
	i as s,
};
