'use strict';

module.exports = Tpl;

function Tpl(debug) {
    if (!!debug && !Tpl.debugged) {
        Tpl.debugged = true;
        for (let attr in Tpl) {
            if (Tpl[attr].cvt && Tpl[attr].debug) {
                const cvtr = Tpl[attr];
                cvtr.cvt = cvtr.cvt.bind(cvtr);
                cvtr.cvt = Tpl.debuglize(cvtr.cvt, cvtr.debug.color);
            }
        }
    }
    return Tpl;
}

Tpl.pattern = /tpl_.*?_tpl/sg;

Tpl.encode = Tpl.enc = (cvtr, ...args) => {
    let dataList = args;
    dataList.push(cvtr.token);
    dataList = dataList.map(item => String(item));
    dataList = dataList.map(item => Tpl.escape(item));
    dataList = dataList.map(item => item.replace(/./sg, '=$&'));
    dataList = ['tpl', ...dataList, 'tpl'];
    return dataList.join('_');
};

Tpl.decode = Tpl.dec = (match) => {
    let dataList = match.split(/(?<=[^=](?:==)*)_/g);
    dataList = dataList.slice(1, dataList.length - 1);
    dataList = dataList.map(item => item.replace(/=(.)/sg, '$1'));
    dataList = dataList.map(item => Tpl.unescape(item));
    let token = dataList.pop();
    return Tpl[token].cvt(...dataList);
};

Tpl.iterateDecode = Tpl.iteDec = (text) => {
    let cond = true;
    while (cond) {
        cond = false;
        text = text.replace(Tpl.pattern, (match) => {
            cond = true;
            return Tpl.dec(match);
        });
    }
    return text;
};

// Prevent encoded data from being escaped by html special characters.
Tpl.escape = (str) => {
    return str
        .replace(/=/g, "=eql;")
        .replace(/&/g, "=amp;")
        .replace(/</g, "=lt;")
        .replace(/>/g, "=gt;")
        .replace(/"/g, "=quot;")
        .replace(/'/g, "=#039;");
};

Tpl.unescape = (str) => {
    return str
        .replace(/=eql;/g, '=')
        .replace(/=amp;/g, '&')
        .replace(/=lt;/g, '<')
        .replace(/=gt;/g, '>')
        .replace(/=quot;/g, '"')
        .replace(/=#039;/g, "'");
};

Tpl.escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

Tpl.debuglize = (cvt, color) => {
    return (...args) => `<span style="background-color:${color};">${cvt(...args)}</span>`;
};

Tpl.hr = {
    token: 'hr',
    debug: { color: 'AliceBlue' },
    cvt: () => `<hr/>`,
};
