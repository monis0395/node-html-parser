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
var matcher_1 = __importDefault(require("../matcher"));
var back_1 = __importDefault(require("../back"));
var style_1 = __importDefault(require("./style"));
var entities_1 = require("entities");
var parse_1 = require("./parse");
var kBlockElements = {
    div: true,
    p: true,
    // ul: true,
    // ol: true,
    li: true,
    // table: true,
    // tr: true,
    td: true,
    section: true,
    br: true,
};
/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree
 *   structure provided (no parentNode, nextSibling,
 *   previousSibling etc).
 * @class HTMLElement
 * @extends {Node}
 */
var HTMLElement = /** @class */ (function (_super) {
    __extends(HTMLElement, _super);
    /**
     * Creates an instance of HTMLElement.
     * @param tagName       tag name of node
     * @param keyAttrs      id and class attribute
     * @param rawAttrs      attributes in string
     * @param parentNode    parent of current element
     *
     * @memberof HTMLElement
     */
    function HTMLElement(tagName, keyAttrs, rawAttrs, parentNode) {
        var _this = _super.call(this, parentNode) || this;
        _this.classNames = [];
        _this.parentElement = null;
        _this.parentNode = null;
        /**
         * Node Type declaration.
         */
        _this.nodeType = type_1.default.ELEMENT_NODE;
        _this.rawAttrs = rawAttrs || '';
        _this.tagName = tagName || '';
        _this.childNodes = [];
        if (keyAttrs.id) {
            _this.id = keyAttrs.id;
        }
        if (keyAttrs.class) {
            _this.classNames = keyAttrs.class.split(/\s+/);
        }
        _this.style = new style_1.default(_this);
        return _this;
    }
    Object.defineProperty(HTMLElement.prototype, "className", {
        get: function () {
            var names = this.classNames;
            if (names) {
                return names.join(' ');
            }
            return '';
        },
        set: function (names) {
            if (names) {
                this.classNames = names.split(' ');
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "rawText", {
        /**
         * Get escpaed (as-it) text value of current node and its children.
         * @return {string} text content
         */
        get: function () {
            return this.childNodes.reduce(function (pre, cur) {
                return pre += cur.rawText;
            }, '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "text", {
        /**
         * Get unescaped text value of current node and its children.
         * @return {string} text content
         */
        get: function () {
            return entities_1.decodeHTML(this.rawText);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "textContent", {
        get: function () {
            return this.text;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "id", {
        get: function () {
            return this.getAttribute('id') || '';
        },
        set: function (str) {
            this.setAttribute('id', str);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "href", {
        get: function () {
            return this.getAttribute('href') || '';
        },
        set: function (str) {
            this.setAttribute('href', str);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "src", {
        get: function () {
            return this.getAttribute('src') || '';
        },
        set: function (str) {
            this.setAttribute('src', str);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "nodeName", {
        get: function () {
            return this.tagName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "localName", {
        get: function () {
            return this.tagName.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "title", {
        get: function () {
            var node = this.getElementsByTagName('title')[0];
            return (node && node.textContent) || '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "documentElement", {
        get: function () {
            return this.getElementsByTagName('html')[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "ownerDocument", {
        get: function () {
            // todo: fix later
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "head", {
        get: function () {
            return this.getElementsByTagName('head')[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "body", {
        get: function () {
            return this.getElementsByTagName('body')[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "structuredText", {
        /**
         * Get structured Text (with '\n' etc.)
         * @return {string} structured text
         */
        get: function () {
            var currentBlock = [];
            var blocks = [currentBlock];
            function dfs(node) {
                if (node.nodeType === type_1.default.ELEMENT_NODE) {
                    if (kBlockElements[node.tagName]) {
                        if (currentBlock.length > 0) {
                            blocks.push(currentBlock = []);
                        }
                        node.childNodes.forEach(dfs);
                        if (currentBlock.length > 0) {
                            blocks.push(currentBlock = []);
                        }
                    }
                    else {
                        node.childNodes.forEach(dfs);
                    }
                }
                else if (node.nodeType === type_1.default.TEXT_NODE) {
                    if (node.isWhitespace) {
                        // Whitespace node, postponed output
                        currentBlock.prependWhitespace = true;
                    }
                    else {
                        var text = node.text;
                        if (currentBlock.prependWhitespace) {
                            text = ' ' + text;
                            currentBlock.prependWhitespace = false;
                        }
                        currentBlock.push(text);
                    }
                }
            }
            dfs(this);
            return blocks
                .map(function (block) {
                // Normalize each line's whitespace
                return block.join('').trim().replace(/\s{2,}/g, ' ');
            })
                .join('\n').replace(/\s+$/, ''); // trimRight;
        },
        enumerable: false,
        configurable: true
    });
    HTMLElement.prototype.toString = function () {
        var tag = this.tagName;
        if (tag) {
            var is_void = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag);
            var attrs = this.rawAttrs ? ' ' + this.rawAttrs : '';
            if (is_void) {
                return "<" + tag + attrs + ">";
            }
            else {
                return "<" + tag + attrs + ">" + this.innerHTML + "</" + tag + ">";
            }
        }
        else {
            return this.innerHTML;
        }
    };
    Object.defineProperty(HTMLElement.prototype, "innerHTML", {
        get: function () {
            return this.childNodes.map(function (child) {
                return child.toString();
            }).join('');
        },
        set: function (html) {
            this.set_content(html);
        },
        enumerable: false,
        configurable: true
    });
    HTMLElement.prototype.set_content = function (content, options) {
        if (options === void 0) { options = {}; }
        if (content instanceof node_1.default) {
            content = [content];
        }
        else if (typeof content == 'string') {
            var r = parse_1.parse(content, options);
            content = r.childNodes.length ? r.childNodes : [new text_1.default(content, this)];
        }
        this.childNodes = content;
    };
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    HTMLElement.prototype.createElement = function (tagName) {
        return new HTMLElement(tagName, {});
    };
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    HTMLElement.prototype.createTextNode = function (data) {
        return new text_1.default(data);
    };
    Object.defineProperty(HTMLElement.prototype, "outerHTML", {
        get: function () {
            return this.toString();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Trim element from right (in block) after seeing pattern in a TextNode.
     * @param  {RegExp} pattern pattern to find
     * @return {HTMLElement}    reference to current node
     */
    HTMLElement.prototype.trimRight = function (pattern) {
        for (var i = 0; i < this.childNodes.length; i++) {
            var childNode = this.childNodes[i];
            if (childNode.nodeType === type_1.default.ELEMENT_NODE) {
                childNode.trimRight(pattern);
            }
            else {
                var index = childNode.rawText.search(pattern);
                if (index > -1) {
                    childNode.rawText = childNode.rawText.substr(0, index);
                    // trim all following nodes.
                    this.childNodes.length = i + 1;
                }
            }
        }
        return this;
    };
    Object.defineProperty(HTMLElement.prototype, "structure", {
        /**
         * Get DOM structure
         * @return {string} strucutre
         */
        get: function () {
            var res = [];
            var indention = 0;
            function write(str) {
                res.push('  '.repeat(indention) + str);
            }
            function dfs(node) {
                var idStr = node.id ? ('#' + node.id) : '';
                var classStr = node.classNames.length ? ('.' + node.classNames.join('.')) : '';
                write(node.tagName + idStr + classStr);
                indention++;
                node.childNodes.forEach(function (childNode) {
                    if (childNode.nodeType === type_1.default.ELEMENT_NODE) {
                        dfs(childNode);
                    }
                    else if (childNode.nodeType === type_1.default.TEXT_NODE) {
                        if (!childNode.isWhitespace)
                            write('#text');
                    }
                });
                indention--;
            }
            dfs(this);
            return res.join('\n');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Remove whitespaces in this sub tree.
     * @return {HTMLElement} pointer to this
     */
    HTMLElement.prototype.removeWhitespace = function () {
        var _this = this;
        var o = 0;
        this.childNodes.forEach(function (node) {
            if (node.nodeType === type_1.default.TEXT_NODE) {
                if (node.isWhitespace) {
                    return;
                }
                node.rawText = node.rawText.trim();
            }
            else if (node.nodeType === type_1.default.ELEMENT_NODE) {
                node.removeWhitespace();
            }
            _this.childNodes[o++] = node;
        });
        this.childNodes.length = o;
        return this;
    };
    /**
     * HTMLCollection of elements with the given tag name.
     * @param  {tagName} tagName is a string representing the name of the elements.
     * @return {HTMLElement[]} matching elements
     */
    HTMLElement.prototype.getElementsByTagName = function (tagName) {
        // return this.querySelectorAll(tagName)
        var result = this.querySelectorAll(tagName);
        if (result.length > 0) {
            return result;
        }
        result = this.querySelectorAll(tagName.toUpperCase());
        if (result.length > 0) {
            return result;
        }
        return result;
    };
    /**
     * Get Elements whose class property matches the specified string.
     * @param  {string} className is a string representing the class name(s) to match
     * @return {HTMLElement[]} all child elements which have all of the given class name(s)
     */
    HTMLElement.prototype.getElementsByClassName = function (className) {
        return this.querySelectorAll("." + className);
    };
    /**
     * returns an Element object representing the element whose id property matches the specified string.
     * @param  {string} id of the element to locate
     * @return {(HTMLElement | null)}  An Element matching the specified ID, or null if no matching element was found
     */
    HTMLElement.prototype.getElementById = function (id) {
        return this.querySelector("#" + id);
    };
    /**
     * Query CSS selector to find matching nodes.
     * @param  {string}         selector Simplified CSS selector
     * @param  {Matcher}        selector A Matcher instance
     * @return {HTMLElement[]}  matching elements
     */
    HTMLElement.prototype.querySelectorAll = function (selector) {
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
            matcher = new matcher_1.default(selector);
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
    HTMLElement.prototype.querySelector = function (selector) {
        var matcher;
        if (selector instanceof matcher_1.default) {
            matcher = selector;
            matcher.reset();
        }
        else {
            matcher = new matcher_1.default(selector);
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
    Object.defineProperty(HTMLElement.prototype, "attributes", {
        /**
         * Get attributes
         * @return {Object} parsed and unescaped attributes
         */
        get: function () {
            if (this._attrs) {
                return this._attrs;
            }
            this._attrs = {};
            var attrs = this.rawAttributes;
            for (var key in attrs) {
                var val = attrs[key] || '';
                this._attrs[key] = entities_1.decodeHTML(val);
            }
            return this._attrs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLElement.prototype, "rawAttributes", {
        /**
         * Get escaped (as-it) attributes
         * @return {Object} parsed attributes
         */
        get: function () {
            if (this._rawAttrs)
                return this._rawAttrs;
            var attrs = {};
            if (this.rawAttrs) {
                var re = /\b([a-z][a-z0-9\-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig;
                var match = void 0;
                while (match = re.exec(this.rawAttrs)) {
                    attrs[match[1]] = match[2] || match[3] || match[4] || null;
                }
            }
            this._rawAttrs = attrs;
            return attrs;
        },
        enumerable: false,
        configurable: true
    });
    HTMLElement.prototype.removeAttribute = function (key) {
        var attrs = this.rawAttributes;
        delete attrs[key];
        // Update this.attribute
        if (this._attrs) {
            delete this._attrs[key];
        }
        // Update rawString
        this.rawAttrs = Object.keys(attrs).map(function (name) {
            var val = JSON.stringify(attrs[name]);
            if (val === undefined || val === 'null') {
                return name;
            }
            else {
                return name + '=' + val;
            }
        }).join(' ');
    };
    HTMLElement.prototype.hasAttribute = function (key) {
        return key in this.attributes;
    };
    /**
     * Get an attribute
     * @return {string} value of the attribute
     */
    HTMLElement.prototype.getAttribute = function (key) {
        return this.attributes[key];
    };
    /**
     * Set an attribute value to the HTMLElement
     * @param {string} key The attribute name
     * @param {string} value The value to set, or null / undefined to remove an attribute
     */
    HTMLElement.prototype.setAttribute = function (key, value) {
        if (arguments.length < 2) {
            throw new Error('Failed to execute \'setAttribute\' on \'Element\'');
        }
        var attrs = this.rawAttributes;
        attrs[key] = String(value);
        if (this._attrs) {
            this._attrs[key] = entities_1.decodeHTML(attrs[key]);
        }
        // Update rawString
        this.rawAttrs = Object.keys(attrs).map(function (name) {
            var val = JSON.stringify(attrs[name]);
            if (val === undefined || val === 'null') {
                return name;
            }
            else {
                return name + '=' + val;
            }
        }).join(' ');
    };
    /**
     * Replace all the attributes of the HTMLElement by the provided attributes
     * @param {Attributes} attributes the new attribute set
     */
    HTMLElement.prototype.setAttributes = function (attributes) {
        // Invalidate current this.attributes
        if (this._attrs) {
            delete this._attrs;
        }
        // Invalidate current this.rawAttributes
        if (this._rawAttrs) {
            delete this._rawAttrs;
        }
        // Update rawString
        this.rawAttrs = Object.keys(attributes).map(function (name) {
            var val = attributes[name];
            if (val === undefined || val === null) {
                return name;
            }
            else {
                return name + '=' + JSON.stringify(String(val));
            }
        }).join(' ');
    };
    HTMLElement.prototype.insertAdjacentHTML = function (where, html) {
        var _a, _b;
        var _this = this;
        if (arguments.length < 2) {
            throw new Error('2 arguments required');
        }
        var p = parse_1.parse(html);
        if (where === 'afterend') {
            p.childNodes.forEach(function (n) {
                _this.parentNode.appendChild(n);
            });
        }
        else if (where === 'afterbegin') {
            (_a = this.childNodes).unshift.apply(_a, p.childNodes);
        }
        else if (where === 'beforeend') {
            p.childNodes.forEach(function (n) {
                _this.appendChild(n);
            });
        }
        else if (where === 'beforebegin') {
            (_b = this.parentNode.childNodes).unshift.apply(_b, p.childNodes);
        }
        else {
            throw new Error("The value provided ('" + where + "') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'");
        }
        if (!where || html === undefined || html === null) {
            return;
        }
    };
    return HTMLElement;
}(node_1.default));
exports.default = HTMLElement;
