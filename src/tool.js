/*! Eretek Online Araçlar #04 — CIDR Birleştirici */
ERT.def('04', {
	run: function (v, c) {
		var I = ERT.ip, list = [], msgs = [], n4 = 0, n6 = 0;
		c.lines(v.list, 20000, 'list').forEach(function (l, i) {
			var p = I.parseCidr(l.split(/[\s;,]/)[0]);
			if (p.err) { throw c.fe('list', 'rowCidr', { r: i + 1, l: l.slice(0, 60) }); }
			if (p.addr !== p.net) { msgs.push(['warn', c.t('hostBits', { l: l, n: I.fmt(p.fam, p.net) + '/' + p.len })]); }
			list.push(p); if (p.fam === 4) { n4++; } else { n6++; }
		});
		var agg = I.aggregate(list), out = agg.map(I.str);
		var sum = function (f) { return agg.filter(function (a) { return a.fam === f; }).reduce(function (s, a) { return s + (1n << BigInt(I.bits(f) - a.len)); }, 0n); };
		msgs.unshift(['ok', c.t('res', { a: list.length, b: agg.length })]);
		return { big: c.t('res', { a: list.length, b: agg.length }), msgs: msgs,
			kv: [[c.t('in4'), n4], [c.t('in6'), n6], [c.t('cov4'), sum(4).toLocaleString(c.loc)], [c.t('cov6'), sum(6).toLocaleString(c.loc)]],
			pre: { h: c.t('outH'), text: out.join('\n') }, x: { copy: out.join('\n') }, v: { out: out } };
	}
});
