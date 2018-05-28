require('babel-register')();
require('babel-polyfill');

const jsdom = require('jsdom').jsdom;

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach(property => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

const documentRef = document;

require.extensions['.scss'] = function() {
    return null;
};

require.extensions['.css'] = function() {
    return null;
};

require.extensions['.png'] = function() {
    return null;
};

require.extensions['.svg'] = function() {
    return null;
};
