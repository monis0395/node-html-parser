"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var type_1 = __importDefault(require("./type"));
var text_1 = __importDefault(require("./text"));
var html_1 = __importDefault(require("./html"));
var matcher_1 = __importDefault(require("../matcher"));
var back_1 = __importDefault(require("../back"));
var url_1 = require("url");
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(url, parentNode, ownerDocument, options) {
        var _this = _super.call(this, parentNode, ownerDocument, options) || this;
        _this.nodeType = type_1.default.DOCUMENT_NODE;
        _this._documentURI = url;
        return _this;
    }
    Document.prototype.toString = function () {
        return this.childNodes.map(function (child) { return child.toString(); }).join('');
    };
    Document.prototype.hasAttribute = function () {
        return false;
    };
    Document.prototype.getAttribute = function () {
        return '';
    };
    Object.defineProperty(Document.prototype, "documentURI", {
        get: function () {
            return this._documentURI;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "baseURI", {
        get: function () {
            if (this._baseURI || this._baseURI === '') {
                return this._baseURI;
            }
            this._baseURI = this._documentURI;
            var baseElements = this.getElementsByTagName('base');
            var href = baseElements[0] && baseElements[0].getAttribute('href');
            if (href) {
                try {
                    this._baseURI = (new url_1.URL(href, this._baseURI)).href;
                }
                catch (ex) { /* Just fall back to documentURI */
                }
            }
            return this._baseURI;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    Document.prototype.createElement = function (tagName) {
        return new html_1.default(tagName, {}, '', null, this.ownerDocument, this.options);
    };
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    Document.prototype.createTextNode = function (data) {
        return new text_1.default(data, null, this.ownerDocument);
    };
    Object.defineProperty(Document.prototype, "title", {
        get: function () {
            var node = this.getElementsByTagName('title')[0];
            return (node && node.textContent) || '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "documentElement", {
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "head", {
        get: function () {
            return this.getElementsByTagName('head')[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "body", {
        get: function () {
            return this.getElementsByTagName('body')[0];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * HTMLCollection of elements with the given tag name.
     * @param  {tagName} tagName is a string representing the name of the elements.
     * @return {HTMLElement[]} matching elements
     */
    Document.prototype.getElementsByTagName = function (tagName) {
        if (this.options.upperCaseTagName) {
            tagName = tagName.toUpperCase();
        }
        return this.querySelectorAll(tagName);
    };
    /**
     * Get Elements whose class property matches the specified string.
     * @param  {string} className is a string representing the class name(s) to match
     * @return {HTMLElement[]} all child elements which have all of the given class name(s)
     */
    Document.prototype.getElementsByClassName = function (className) {
        return this.querySelectorAll("." + className);
    };
    /**
     * returns an Element object representing the element whose id property matches the specified string.
     * @param  {string} id of the element to locate
     * @return {(HTMLElement | null)}  An Element matching the specified ID, or null if no matching element was found
     */
    Document.prototype.getElementById = function (id) {
        return this.querySelector("#" + id);
    };
    /**
     * Query CSS selector to find matching nodes.
     * @param  {string}         selector Simplified CSS selector
     * @param  {Matcher}        selector A Matcher instance
     * @return {HTMLElement[]}  matching elements
     */
    Document.prototype.querySelectorAll = function (selector) {
        var _this = this;
        var matcher;
        if (selector instanceof matcher_1.default) {
            matcher = selector;
            matcher.reset();
        }
        else {
            if (selector.includes(',')) {
                var selectors = selector.split(',');
                return Array.from(selectors.reduce(function (pre, cur) {
                    var result = _this.querySelectorAll(cur.trim());
                    return result.reduce(function (p, c) {
                        return p.add(c);
                    }, pre);
                }, new Set()));
            }
            matcher = new matcher_1.default(selector, this.options);
        }
        var stack = [];
        return this.childNodes.reduce(function (res, cur) {
            stack.push([cur, 0, false]);
            while (stack.length) {
                var state = back_1.default(stack); // get last element
                var el = state[0];
                if (state[1] === 0) {
                    // Seen for first time.
                    if (el.nodeType !== type_1.default.ELEMENT_NODE) {
                        stack.pop();
                        continue;
                    }
                    var html_el = el;
                    state[2] = matcher.advance(html_el);
                    if (state[2]) {
                        if (matcher.matched) {
                            res.push(html_el);
                            res.push.apply(res, (html_el.querySelectorAll(selector)));
                            // no need to go further.
                            matcher.rewind();
                            stack.pop();
                            continue;
                        }
                    }
                }
                if (state[1] < el.childNodes.length) {
                    stack.push([el.childNodes[state[1]++], 0, false]);
                }
                else {
                    if (state[2]) {
                        matcher.rewind();
                    }
                    stack.pop();
                }
            }
            return res;
        }, []);
    };
    /**
     * Query CSS Selector to find matching node.
     * @param  {string}         selector Simplified CSS selector
     * @param  {Matcher}        selector A Matcher instance
     * @return {HTMLElement}    matching node
     */
    Document.prototype.querySelector = function (selector) {
        var matcher;
        if (selector instanceof matcher_1.default) {
            matcher = selector;
            matcher.reset();
        }
        else {
            matcher = new matcher_1.default(selector, this.options);
        }
        var stack = [];
        for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
            var node = _a[_i];
            stack.push([node, 0, false]);
            while (stack.length) {
                var state = back_1.default(stack);
                var el = state[0];
                if (state[1] === 0) {
                    // Seen for first time.
                    if (el.nodeType !== type_1.default.ELEMENT_NODE) {
                        stack.pop();
                        continue;
                    }
                    state[2] = matcher.advance(el);
                    if (state[2]) {
                        if (matcher.matched) {
                            return el;
                        }
                    }
                }
                if (state[1] < el.childNodes.length) {
                    stack.push([el.childNodes[state[1]++], 0, false]);
                }
                else {
                    if (state[2])
                        matcher.rewind();
                    stack.pop();
                }
            }
        }
        return null;
    };
    return Document;
}(node_1.default));
exports.default = Document;
