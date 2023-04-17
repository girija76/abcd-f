var __shimport__ = (function(n) {
	'use strict';
	function t() {
		for (var n = 0, t = 0, r = arguments.length; t < r; t++)
			n += arguments[t].length;
		var e = Array(n),
			u = 0;
		for (t = 0; t < r; t++)
			for (var a = arguments[t], o = 0, i = a.length; o < i; o++, u++) e[u] = a[o];
		return e;
	}
	function r(n, t) {
		for (var r = n.length; r--; ) if (n[r].name === t) return n[r].as;
	}
	var e = /\b(case|default|delete|do|else|in|instanceof|new|return|throw|typeof|void)\s*$/,
		u = /(^|\{|\(|\[\.|;|,|<|>|<=|>=|==|!=|===|!==|\+|-|\*\%|<<|>>|>>>|&|\||\^|!|~|&&|\|\||\?|:|=|\+=|-=|\*=|%=|<<=|>>=|>>>=|&=|\|=|\^=|\/=|\/)\s*$/,
		a = /(\}|\)|\+\+|--)\s*$/,
		o = /[{}()[.;,<>=+\-*%&|\^!~?:/]/,
		i = /[a-zA-Z_$0-9]/,
		f = {
			' ': 1,
			'\t': 1,
			'\n': 1,
			'\r': 1,
			'\f': 1,
			'\v': 1,
			' ': 1,
			'\u2028': 1,
			'\u2029': 1,
		};
	function s(n) {
		return n in f;
	}
	function c(n) {
		return "'" === n || '"' === n;
	}
	var l = /^\*\s+as\s+(\w+)$/,
		d = /(\w+)\s*,\s*\*\s*as\s*(\w+)$/,
		p = /(\w+)\s*,\s*{(.+)}$/;
	function v(n) {
		return n
			? n.split(',').map(function(n) {
					var t = n.trim().split(/[^\S]+/),
						r = t[0];
					return { name: r, as: t[2] || r };
			  })
			: [];
	}
	function m(n, t) {
		for (var e = t, u = (t += 6); n[t] && s(n[t]); ) t += 1;
		for (; n[t] && !c(n[t]); ) t += 1;
		for (var a = t, o = (t += 1); n[t] && !c(n[t]); ) t += 1;
		var i = t++;
		return (function(n, t, e, u, a) {
			var o = r(u, '*') || r(u, 'default');
			return {
				start: t,
				end: e,
				source: a,
				name: o,
				toString: function(r) {
					var o = r.get(a);
					return (
						u
							.sort(function(n, t) {
								return 'default' === n.name ? 1 : 'default' === t.name ? -1 : void 0;
							})
							.map(function(n) {
								return '*' === n.name
									? null
									: 'default' === n.name && n.as === o
									? n.as + ' = ' + o + '.default;'
									: 'var ' + n.as + ' = ' + o + '.' + n.name + ';';
							})
							.join(' ') +
						' /*' +
						n.slice(t, e) +
						'*/'
					).trim();
				},
			};
		})(
			n,
			e,
			t,
			(function(n) {
				var t = l.exec(n);
				return t
					? [{ name: '*', as: t[1] }]
					: (t = d.exec(n))
					? [
							{ name: 'default', as: t[1] },
							{ name: '*', as: t[2] },
					  ]
					: (t = p.exec(n))
					? [{ name: 'default', as: t[1] }].concat(v(t[2].trim()))
					: '{' === n[0]
					? v(n.slice(1, -1).trim())
					: n
					? [{ name: 'default', as: n }]
					: [];
			})(
				n
					.slice(u, a)
					.replace(/from\s*$/, '')
					.trim()
			),
			n.slice(o, i)
		);
	}
	var h = /^import\s*\.\s*meta\s*\.\s*url/;
	function _(n, t) {
		var r = t;
		for (t += 6; n[t] && s(n[t]); ) t += 1;
		var e = t;
		if ('{' === n[t]) {
			for (; '}' !== n[t]; ) t += 1;
			for (var u = (t += 1), a = null; s(n[t]); ) t += 1;
			if (/^from[\s\n'"]/.test(n.slice(t, t + 5))) {
				for (t += 4; s(n[t]); ) t += 1;
				for (; n[t] && !c(n[t]); ) t += 1;
				for (var i = (t += 1); n[t] && !c(n[t]); ) t += 1;
				(a = n.slice(i, t)), (t += 1);
			}
			return (function(n, t, r, e, u, a) {
				var o = v(n.slice(r + 1, e - 1).trim());
				return {
					start: t,
					end: u,
					source: a,
					toString: function(r) {
						var e = r.get(a);
						return (
							o
								.map(function(n) {
									return (
										'__exports.' + n.as + ' = ' + (e ? e + '.' + n.name : n.name) + '; '
									);
								})
								.join('') +
							'/*' +
							n.slice(t, u) +
							'*/'
						);
					},
				};
			})(n, r, e, u, t, a);
		}
		if ('*' === n[t]) {
			for (t += 1; s(n[t]); ) t += 1;
			for (t += 4; n[t] && !c(n[t]); ) t += 1;
			for (i = t += 1; n[t] && !c(n[t]); ) t += 1;
			var f = t++;
			return (function(n, t, r, e) {
				return {
					start: t,
					end: r,
					source: e,
					toString: function(u) {
						return (
							'Object.assign(__exports, ' + u.get(e) + '); /*' + n.slice(t, r) + '*/'
						);
					},
				};
			})(n, r, t, n.slice(i, f));
		}
		return /^default\b/.test(n.slice(t, t + 8))
			? (function(n, t, r) {
					var e = /^\s*(?:(class)(\s+extends|\s*{)|(function)\s*\()/.exec(
						n.slice(r)
					);
					if (e) {
						r += e[0].length;
						var u = '__default_export';
						return {
							start: t,
							end: r,
							name: u,
							as: 'default',
							toString: function() {
								return e[1] ? 'class ' + u + e[2] : 'function ' + u + '(';
							},
						};
					}
					return {
						start: t,
						end: r,
						toString: function() {
							return '__exports.default =';
						},
					};
			  })(n, r, e + 7)
			: (function(n, t, r) {
					for (var e = r; n[r] && /\S/.test(n[r]); ) r += 1;
					for (; n[r] && !/\S/.test(n[r]); ) r += 1;
					for (var u = r; n[r] && !o.test(n[r]) && !s(n[r]); ) r += 1;
					var a = r;
					return {
						start: t,
						end: e,
						name: n.slice(u, a),
						toString: function() {
							return '';
						},
					};
			  })(n, r, e);
	}
	function g(n, t) {
		var r,
			f = !0,
			c = !1,
			l = [],
			d = -1,
			p = {},
			v = {},
			g = 0,
			x = [],
			w = [],
			S = [],
			$ = [];
		function y() {
			if (')' === n[d]) {
				for (var t = p[d]; s(n[t - 1]); ) t -= 1;
				return !/(if|while)$/.test(n.slice(t - 5, t));
			}
			return !0;
		}
		for (
			var b = {
					pattern: /(?:(\()|(\))|({)|(})|(")|(')|(\/\/)|(\/\*)|(\/)|(`)|(import)|(export)|(\+\+|--))/g,
					handlers: [
						function(n) {
							(d = n), (v[g++] = n);
						},
						function(n) {
							(d = n), (p[n] = v[--g]);
						},
						function(n) {
							(d = n), l.push(b);
						},
						function(n) {
							return (d = n), l.pop();
						},
						function(n) {
							return l.push(b), A;
						},
						function(n) {
							return l.push(b), E;
						},
						function(n) {
							return O;
						},
						function(n) {
							return k;
						},
						function(t) {
							for (var r = t; r > 0 && s(n[r - 1]); ) r -= 1;
							if (r > 0) {
								var c = r;
								if (o.test(n[c - 1])) for (; c > 0 && o.test(n[c - 1]); ) c -= 1;
								else for (; c > 0 && i.test(n[c - 1]); ) c -= 1;
								var l = n.slice(c, r);
								f = !!l && (e.test(l) || u.test(l) || (a.test(l) && !y()));
							} else f = !0;
							return R;
						},
						function(n) {
							return z;
						},
						function(r) {
							if (0 === r || s(n[r - 1]) || o.test(n[r - 1])) {
								var e = r + 6,
									u = void 0;
								do {
									u = n[e++];
								} while (s(u));
								var a = e > r + 7;
								if (/^['"{*]$/.test(u) || (a && /^[a-zA-Z_$]$/.test(u))) {
									var i = m(n, r);
									x.push(i), (N = i.end);
								} else if ('(' === u) {
									var f = (function(n) {
										return {
											start: n,
											end: n + 6,
											toString: function() {
												return '__import';
											},
										};
									})(r);
									w.push(f), (N = f.end);
								} else if ('.' === u) {
									var c = (function(n, t, r) {
										var e = h.exec(n.slice(t));
										if (e)
											return {
												start: t,
												end: t + e[0].length,
												toString: function() {
													return JSON.stringify('' + r);
												},
											};
									})(n, r, t);
									c && (S.push(c), (N = c.end));
								}
							}
						},
						function(t) {
							if (
								(0 === t || s(n[t - 1]) || o.test(n[t - 1])) &&
								/export[\s\n{]/.test(n.slice(t, t + 7))
							) {
								var r = _(n, t);
								$.push(r), (N = r.end);
							}
						},
						function(t) {
							c = !c && '+' === n[t - 1];
						},
					],
				},
				R = {
					pattern: /(?:(\[)|(\\)|(.))/g,
					handlers: [
						function(n) {
							return f ? j : b;
						},
						function(n) {
							return (r = U), L;
						},
						function(n) {
							return f && !c ? U : b;
						},
					],
				},
				U = {
					pattern: /(?:(\[)|(\\)|(\/))/g,
					handlers: [
						function() {
							return j;
						},
						function() {
							return (r = U), L;
						},
						function() {
							return b;
						},
					],
				},
				j = {
					pattern: /(?:(\])|(\\))/g,
					handlers: [
						function() {
							return U;
						},
						function() {
							return (r = j), L;
						},
					],
				},
				A = {
					pattern: /(?:(\\)|("))/g,
					handlers: [
						function() {
							return (r = A), L;
						},
						function() {
							return l.pop();
						},
					],
				},
				E = {
					pattern: /(?:(\\)|('))/g,
					handlers: [
						function() {
							return (r = E), L;
						},
						function() {
							return l.pop();
						},
					],
				},
				L = {
					pattern: /(.)/g,
					handlers: [
						function() {
							return r;
						},
					],
				},
				z = {
					pattern: /(?:(\${)|(\\)|(`))/g,
					handlers: [
						function() {
							return l.push(z), b;
						},
						function() {
							return (r = z), L;
						},
						function() {
							return b;
						},
					],
				},
				O = {
					pattern: /((?:\n|$))/g,
					handlers: [
						function() {
							return b;
						},
					],
				},
				k = {
					pattern: /(\*\/)/g,
					handlers: [
						function() {
							return b;
						},
					],
				},
				I = b,
				N = 0;
			N < n.length;

		) {
			I.pattern.lastIndex = N;
			var P = I.pattern.exec(n);
			if (!P) {
				if (l.length > 0 || I !== b) throw new Error('Unexpected end of file');
				break;
			}
			N = P.index + P[0].length;
			for (var Z = 1; Z < P.length; Z += 1)
				if (P[Z]) {
					I = I.handlers[Z - 1](P.index) || I;
					break;
				}
		}
		return [x, w, S, $];
	}
	function x(n, r) {
		var e = g(n, r),
			u = e[0],
			a = e[1],
			o = e[2],
			i = e[3],
			f = new Map();
		u.forEach(function(n) {
			f.has(n.source) || f.set(n.source, n.name || '__dep_' + f.size);
		}),
			i.forEach(function(n) {
				n.source &&
					(f.has(n.source) || f.set(n.source, n.name || '__dep_' + f.size));
			});
		for (
			var s =
					"__shimport__.define('" +
					r +
					"', [" +
					Array.from(f.keys())
						.map(function(n) {
							return "'" + n + "'";
						})
						.join(', ') +
					'], function(' +
					['__import', '__exports'].concat(Array.from(f.values())).join(', ') +
					'){ ',
				c = t(u, a, o, i).sort(function(n, t) {
					return n.start - t.start;
				}),
				l = 0,
				d = 0;
			d < c.length;
			d += 1
		) {
			var p = c[d];
			(s += n.slice(l, p.start) + p.toString(f)), (l = p.end);
		}
		return (
			(s += n.slice(l)),
			i.forEach(function(n) {
				n.name && (s += '\n__exports.' + (n.as || n.name) + ' = ' + n.name + ';');
			}),
			(s += '\n});\n//# sourceURL=' + r)
		);
	}
	var w = {};
	function S(n) {
		return (
			w[n] ||
			(w[n] = fetch(n)
				.then(function(n) {
					return n.text();
				})
				.then(function(t) {
					return (
						(r = x(t, n)),
						'undefined' != typeof document && 'undefined' != typeof URL
							? new Promise(function(n) {
									var t = '__shimport__' + $++,
										e = new Blob([t + '=' + r], { type: 'application/javascript' }),
										u = document.createElement('script');
									(u.src = URL.createObjectURL(e)),
										(u.onload = function() {
											n(window[t]), delete window[t];
										}),
										document.head.appendChild(u);
							  })
							: (0, eval)(r)
					);
					var r;
				}))
		);
	}
	var $ = 1;
	if ('undefined' != typeof document) {
		var y = document.querySelector('[data-main]');
		y && S(new URL(y.getAttribute('data-main'), document.baseURI));
	}
	return (
		(n.VERSION = '2.0.4'),
		(n.define = function(n, r, e) {
			var u = function(t) {
				return S(new URL(t, n));
			};
			return Promise.all(r.map(u)).then(function(n) {
				var r = {};
				return e.apply(void 0, t([u, r], n)), r;
			});
		}),
		(n.load = S),
		(n.transform = x),
		n
	);
})({});
