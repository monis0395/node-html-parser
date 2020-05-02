"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = __importDefault(require("./type"));
var back_1 = __importDefault(require("../back"));
var he_1 = require("he");
/**
 * Node Class as base class for TextNode and HTMLElement.
 */
var Node = /** @class */ (function () {
    function Node() {
        this.childNodes = [];
        this.tagName = '';
    }
    Object.defineProperty(Node.prototype, "children", {
        get: function () {
            return this.childNodes.filter(function (node) { return node.nodeType === type_1.default.ELEMENT_NODE; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "childElementCount", {
        get: function () {
            return this.childNodes.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "textContent", {
        /**
         * Get unescaped text value of current node and its children.
         * @return {string} text content
         */
        get: function () {
            return he_1.decode(this.childNodes.reduce(function (pre, cur) {
                return pre += cur.rawText;
            }, ''));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "firstChild", {
        /**
         * Get first child node
         * @return {Node} first child node
         */
        get: function () {
            return this.childNodes[0] || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "lastChild", {
        /**
         * Get last child node
         * @return {Node} last child node
         */
        get: function () {
            return back_1.default(this.childNodes) || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "firstElementChild", {
        /**
         * Get first child element
         * @return {Node} first child element
         */
        get: function () {
            return this.childNodes.find(function (node) { return node.nodeType === type_1.default.ELEMENT_NODE; }) || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "lastElementChild", {
        /**
         * Get last child element
         * @return {Node} last child element
         */
        get: function () {
            var idx;
            for (var i = this.childNodes.length - 1; i > -1; i--) {
                if (this.childNodes[i].nodeType === type_1.default.ELEMENT_NODE) {
                    idx = i;
                    break;
                }
            }
            return this.childNodes[idx] || null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Remove Child element from childNodes array
     * @param {HTMLElement} node     node to remove
     */
    Node.prototype.removeChild = function (node) {
        var len = this.childNodes.length;
        for (var i = 0; i < len; i++) {
            if (this.childNodes[i] === node) {
                // dont not use array.filter
                // this is necessary to handle pass by reference cases
                this.childNodes.splice(i, 1);
                break;
            }
        }
        var previousSibling = node.previousSibling || null;
        var nextSibling = node.nextSibling || null;
        if (previousSibling) {
            previousSibling.nextSibling = nextSibling;
        }
        if (nextSibling) {
            nextSibling.previousSibling = previousSibling;
        }
        var previousElementSibling = node.previousElementSibling || null;
        var nextElementSibling = node.nextElementSibling || null;
        if (previousElementSibling) {
            previousElementSibling.nextElementSibling = nextElementSibling;
        }
        if (nextElementSibling) {
            nextElementSibling.previousElementSibling = previousElementSibling;
        }
    };
    /**
     * Append a child node to childNodes
     * @param  {Node} node node to append
     * @return {Node}      node appended
     */
    Node.prototype.appendChild = function (node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        var lastNode = this.childNodes[this.childNodes.length - 1] || null;
        if (lastNode) {
            lastNode.nextSibling = node;
        }
        node.previousSibling = lastNode;
        node.nextSibling = null;
        var lastElement = this.children[this.children.length - 1] || null;
        if (lastElement && node.nodeType === type_1.default.ELEMENT_NODE) {
            lastElement.nextElementSibling = node;
        }
        if (lastNode && node.nodeType === type_1.default.ELEMENT_NODE) {
            lastNode.nextElementSibling = node;
        }
        node.previousElementSibling = lastElement;
        node.nextElementSibling = null;
        this.childNodes.push(node);
        node.parentNode = this;
        return node;
    };
    /**
     * Exchanges given child with new child
     * @param {HTMLElement} oldNode     node to exchange
     * @param {HTMLElement} newNode     new node
     */
    Node.prototype.exchangeChild = function (oldNode, newNode) {
        var idx = -1;
        for (var i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i] === oldNode) {
                idx = i;
                break;
            }
        }
        this.childNodes[idx] = newNode;
        var previousSibling = oldNode.previousSibling || null;
        var nextSibling = oldNode.nextSibling || null;
        newNode.previousSibling = previousSibling;
        newNode.nextSibling = nextSibling;
        if (previousSibling) {
            previousSibling.nextSibling = newNode;
        }
        if (nextSibling) {
            nextSibling.previousSibling = newNode;
        }
        var previousElementSibling = oldNode.previousElementSibling || null;
        var nextElementSibling = oldNode.nextElementSibling || null;
        newNode.previousElementSibling = previousElementSibling;
        newNode.nextElementSibling = nextElementSibling;
        if (newNode.nodeType === type_1.default.ELEMENT_NODE) {
            if (previousSibling) {
                previousSibling.nextElementSibling = newNode;
            }
            if (nextSibling) {
                nextSibling.previousElementSibling = newNode;
            }
            if (previousElementSibling) {
                previousElementSibling.nextElementSibling = newNode;
            }
            if (nextSibling) {
                nextSibling.previousElementSibling = newNode;
            }
        }
    };
    /**
     * Exchanges given child with new child
     * @param {HTMLElement} oldNode     node to exchange
     * @param {HTMLElement} newNode     new node
     */
    Node.prototype.replaceChild = function (oldNode, newNode) {
        this.exchangeChild(oldNode, newNode);
        return oldNode;
    };
    return Node;
}());
exports.default = Node;
