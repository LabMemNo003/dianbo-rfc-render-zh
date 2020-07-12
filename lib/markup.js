'use strict';

const T = require('./template');

module.exports = Markup;

function Markup(debug) {
    if (!!debug && !Markup.debugged) {
        Markup.debugged = true;
        if (debug === true) {
            T(true);
        } else if (typeof (debug) === 'string') {
            if (debug.includes('u')) Markup.debug.url = true;
            if (debug.includes('c')) Markup.debug.tpl = true;
            if (debug.includes('t')) Markup.debug.tab = true;
            T(Markup.debug.tpl);
        } else {
            Markup.debug = debug;
            T(debug.tpl);
        }
    }
    return Markup;
}

Markup.debug = {};

Markup.do = (text) => {
    // The order matters
    text = Markup.norm(text);
    text = Markup.hr(text);

    text = T.escapeHtml(text);
    text = T.iteDec(text);
    text = '<pre>' + text + '</pre>';

    return text;
};

// Text normalize
Markup.normalize = Markup.norm = (text) => {
    // Remove empty lines at the beginning of text
    text = text.replace(/^([ \t]*\n)*/, '');
    // Remove empty lines at the end of text
    text = text.replace(/([ \t\f]*\n)*$/, '');
    // Remove white spaces at the end of each line
    text = text.replace(/[ \t]+$/mg, '');

    return text;
};

// Markup horizontal lines as page break
Markup.horizon = Markup.hr = (text) => {
    // Insert horizontal lines after \f
    return text.replace(/(?:\f)()/g, T.enc(T.hr));
};
