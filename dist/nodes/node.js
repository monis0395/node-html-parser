"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var back_1 = __importDefault(require("../back"));
var he_1 = require("he");
/**
 * Node Class as base class for TextNode and HTMLElement.
 */
var Node = /** @class */ (function () {
    function Node() {
        this.childNodes = [];
    }
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
            return this.childNodes[0];
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
            return back_1.default(this.childNodes);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Remove Child element from childNodes array
     * @param {HTMLElement} node     node to remove
     */
    Node.prototype.removeChild = function (node) {
        this.childNodes = this.childNodes.filter(function (child) {
            return (child !== node);
        });
        var previousSibling = node.previousSibling;
        var nextSibling = node.nextSibling;
        if (previousSibling) {
            previousSibling.nextSibling = nextSibling;
        }
        if (nextSibling) {
            nextSibling.previousSibling = previousSibling;
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
        var lastNode = this.childNodes[this.childNodes.length - 1];
        lastNode.nextSibling = node;
        node.previousSibling = lastNode;
        node.nextSibling = null;
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
        var previousSibling = oldNode.previousSibling;
        var nextSibling = oldNode.nextSibling;
        newNode.previousSibling = previousSibling;
        newNode.nextSibling = nextSibling;
        if (previousSibling) {
            previousSibling.nextSibling = newNode;
        }
        if (nextSibling) {
            nextSibling.previousSibling = newNode;
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
