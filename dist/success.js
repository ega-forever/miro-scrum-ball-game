/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
const parseQuery = (queryString) => {
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = [pairs[i].substr(0, pairs[i].indexOf('=')), pairs[i].substr(pairs[i].indexOf('=') + 1)];
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
};
const data = parseQuery(location.hash.indexOf('#') === 0 ? location.hash.substr(1) : location.hash);
const state = JSON.parse(data.state);
location.href = state.board;

/******/ })()
;