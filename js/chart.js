/**
 * Meridian Research — Equity chart
 * Draws the account equity comparison from js/equity-data.js as inline SVG on a
 * log scale, with a crosshair tooltip that reads every series at one date.
 * The annual table next to the chart is its table view.
 */

(function () {
    'use strict';

    const data = window.MERIDIAN_EQUITY;
    const plot = document.getElementById('equity-chart');
    if (!data || !plot) return;

    const NS = 'http://www.w3.org/2000/svg';
    const dates = data.dates.map(d => new Date(d + 'T00:00:00Z'));
    const runs = data.strategy;
    const passive = data.passive;
    const count = dates.length;

    const Y_MIN = 80000;
    const Y_MAX = 1200000;
    const Y_TICKS = [100000, 200000, 500000, 1000000];
    const margin = { top: 12, right: 92, bottom: 26, left: 48 };

    const t0 = dates[0].getTime();
    const t1 = dates[count - 1].getTime();

    let frame = null;
    let geometry = null;
    let hoverIndex = -1;

    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.hidden = true;
    plot.appendChild(tooltip);

    function el(name, attrs, parent) {
        const node = document.createElementNS(NS, name);
        for (const key in attrs) node.setAttribute(key, attrs[key]);
        if (parent) parent.appendChild(node);
        return node;
    }

    function money(value) {
        if (value >= 1000000) {
            const millions = value / 1000000;
            return '$' + (Number.isInteger(millions) ? millions : millions.toFixed(2)) + 'M';
        }
        return '$' + Math.round(value / 1000) + 'k';
    }

    function dateLabel(d) {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    }

    function render() {
        const width = plot.clientWidth;
        if (!width) return;
        const height = Math.round(Math.min(380, Math.max(240, width * 0.5)));
        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;

        const x = t => margin.left + ((t - t0) / (t1 - t0)) * innerW;
        const y = v => margin.top + innerH - ((Math.log(v) - Math.log(Y_MIN)) / (Math.log(Y_MAX) - Math.log(Y_MIN))) * innerH;
        geometry = { x, y, width, height, innerW };

        const old = plot.querySelector('svg');
        if (old) old.remove();

        const svg = el('svg', {
            width: width,
            height: height,
            viewBox: '0 0 ' + width + ' ' + height,
            role: 'img',
            'aria-label': 'Account equity on a log scale, five strategy runs against passive long, 2013 to 2024'
        });

        const grid = el('g', { class: 'grid' }, svg);
        const axis = el('g', { class: 'axis' }, svg);
        Y_TICKS.forEach(v => {
            const yy = y(v);
            el('line', { x1: margin.left, x2: width - margin.right, y1: yy, y2: yy }, grid);
            const label = el('text', { x: margin.left - 8, y: yy + 4, 'text-anchor': 'end' }, axis);
            label.textContent = money(v);
        });

        const firstYear = dates[0].getUTCFullYear() + 1;
        const lastYear = dates[count - 1].getUTCFullYear();
        const step = innerW < 420 ? 2 : 1;
        for (let year = firstYear; year <= lastYear; year += step) {
            const t = Date.UTC(year, 0, 1);
            const xx = x(t);
            const label = el('text', { x: xx, y: height - 8, 'text-anchor': 'middle' }, axis);
            label.textContent = String(year);
        }

        const lines = el('g', {}, svg);
        const path = series => series.map((v, i) => (i ? 'L' : 'M') + x(dates[i].getTime()).toFixed(1) + ' ' + y(v).toFixed(1)).join('');
        runs.forEach(series => el('path', { class: 'line-strategy', d: path(series) }, lines));
        el('path', { class: 'line-passive', d: path(passive) }, lines);

        const dots = el('g', {}, svg);
        const xEnd = x(t1);
        runs.forEach(series => el('circle', { class: 'end-dot', cx: xEnd, cy: y(series[count - 1]), r: 4, fill: 'var(--color-accent)' }, dots));
        el('circle', { class: 'end-dot', cx: xEnd, cy: y(passive[count - 1]), r: 4, fill: 'var(--color-passive)' }, dots);

        const finals = runs.map(s => s[count - 1]);
        const strategyMid = y(Math.exp(finals.reduce((a, v) => a + Math.log(v), 0) / finals.length));
        const labels = el('g', {}, svg);
        const strategyLabel = el('text', { class: 'end-label', x: xEnd + 10, y: strategyMid + 4 }, labels);
        strategyLabel.textContent = 'Strategy';
        const passiveLabel = el('text', { class: 'end-label', x: xEnd + 10, y: y(passive[count - 1]) + 4 }, labels);
        passiveLabel.textContent = 'Passive long';

        const hover = el('g', { class: 'hover', visibility: 'hidden' }, svg);
        el('line', { class: 'crosshair', y1: margin.top, y2: margin.top + innerH }, hover);
        runs.forEach(() => el('circle', { class: 'hover-dot', r: 4, fill: 'var(--color-accent)' }, hover));
        el('circle', { class: 'hover-dot', r: 4, fill: 'var(--color-passive)' }, hover);

        plot.insertBefore(svg, tooltip);
        if (hoverIndex >= 0) showIndex(hoverIndex);
    }

    function nearestIndex(clientX) {
        const rect = plot.getBoundingClientRect();
        const t = t0 + ((clientX - rect.left - margin.left) / geometry.innerW) * (t1 - t0);
        let lo = 0;
        let hi = count - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (dates[mid].getTime() < t) lo = mid + 1; else hi = mid;
        }
        if (lo > 0 && t - dates[lo - 1].getTime() < dates[lo].getTime() - t) lo -= 1;
        return lo;
    }

    function addRow(color, value, label) {
        const row = document.createElement('div');
        row.className = 'tt-row';
        const key = document.createElement('span');
        key.className = 'tt-key';
        key.style.background = color;
        const strong = document.createElement('span');
        strong.className = 'tt-value';
        strong.textContent = value;
        const text = document.createElement('span');
        text.textContent = label;
        row.appendChild(key);
        row.appendChild(strong);
        row.appendChild(text);
        tooltip.appendChild(row);
    }

    function showIndex(i) {
        if (!geometry) return;
        hoverIndex = i;
        const svg = plot.querySelector('svg');
        const hover = svg.querySelector('.hover');
        const xx = geometry.x(dates[i].getTime());
        hover.setAttribute('visibility', 'visible');
        const line = hover.querySelector('line');
        line.setAttribute('x1', xx);
        line.setAttribute('x2', xx);
        const circles = hover.querySelectorAll('circle');
        runs.forEach((series, k) => {
            circles[k].setAttribute('cx', xx);
            circles[k].setAttribute('cy', geometry.y(series[i]));
        });
        circles[runs.length].setAttribute('cx', xx);
        circles[runs.length].setAttribute('cy', geometry.y(passive[i]));

        const values = runs.map(s => s[i]);
        tooltip.textContent = '';
        const date = document.createElement('div');
        date.className = 'tt-date';
        date.textContent = dateLabel(dates[i]);
        tooltip.appendChild(date);
        addRow('var(--color-accent)', money(Math.min.apply(null, values)) + ' to ' + money(Math.max.apply(null, values)), 'Strategy, five runs');
        addRow('var(--color-passive)', money(passive[i]), 'Passive long');
        tooltip.hidden = false;

        const tipW = tooltip.offsetWidth;
        const left = xx + 14 + tipW > geometry.width ? xx - 14 - tipW : xx + 14;
        tooltip.style.left = left + 'px';
        tooltip.style.top = margin.top + 'px';
    }

    function hide() {
        hoverIndex = -1;
        tooltip.hidden = true;
        const hover = plot.querySelector('svg .hover');
        if (hover) hover.setAttribute('visibility', 'hidden');
    }

    plot.addEventListener('pointermove', e => showIndex(nearestIndex(e.clientX)));
    plot.addEventListener('pointerleave', hide);
    plot.addEventListener('focus', () => showIndex(hoverIndex >= 0 ? hoverIndex : count - 1));
    plot.addEventListener('blur', hide);
    plot.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const stepSize = e.shiftKey ? 26 : 1;
            const next = e.key === 'ArrowLeft' ? hoverIndex - stepSize : hoverIndex + stepSize;
            showIndex(Math.max(0, Math.min(count - 1, next)));
            e.preventDefault();
        } else if (e.key === 'Escape') {
            hide();
        }
    });

    window.addEventListener('resize', () => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(render);
    });

    render();
})();
