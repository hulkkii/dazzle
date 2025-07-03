const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// setup file
const { configure } = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

configure({ adapter: new Adapter() });

const { document } = (new JSDOM('')).window;
global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;
window.localStorage = window.sessionStorage = {
  getItem(key) {
    return this[key];
  },
  setItem(key, value) {
    this[key] = value;
  },
  removeItem(key) {
    this[key] = undefined;
  },
};
