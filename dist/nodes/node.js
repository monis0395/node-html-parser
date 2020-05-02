"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = __importDefault(require("./type"));
var back_1 = __importDefault(require("../back"));
/**
 * Node Class as base class for TextNode and HTMLElement.
 */
var Node = /** @class */ (function () {
    // Node Types
    // ELEMENT_NODE= 1;
    // ATTRIBUTE_NODE= 2;
    // TEXT_NODE= 3;
    // CDATA_SECTION_NODE= 4;
    // ENTITY_REFERENCE_NODE= 5;
    // ENTITY_NODE= 6;
    // PROCESSING_INSTRUCTION_NODE= 7;
    // COMMENT_NODE= 8;
    // DOCUMENT_NODE= 9;
    // DOCUMENT_TYPE_NODE= 10;
    // DOCUMENT_FRAGMENT_NODE= 11;
    // NOTATION_NODE= 12;
    function Node(parentNode) {
        this.childNodes = [];
        this.children = [];
        this.parentNode = null;
        this.parentElement = null;
        this.nextSibling = null;
        this.previousSibling = null;
        this.nextElementSibling = null;
        this.previousElementSibling = null;
        this.tagName = '';
        this.parentNode = parentNode || null;
        if (this.parentNode && this.parentNode.nodeType === type_1.default.ELEMENT_NODE) {
            this.parentElement = this.parentNode;
        }
    }
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
    Object.defineProperty(Node.prototype, "firstElementChild", {
        /**
         * Get first child element
         * @return {Node} first child element
         */
        get: function () {
            return this.children[0] || null;
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
    Object.defineProperty(Node.prototype, "lastElementChild", {
        /**
         * Get last child element
         * @return {Node} last child element
         */
        get: function () {
            return back_1.default(this.children) || null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Remove Child element from childNodes array
     * @param {HTMLElement} child     node to remove
     */
    Node.prototype.removeChild = function (child) {
        var childIndex = this.childNodes.indexOf(child);
        child.parentNode = null;
        var previousSibling = child.previousSibling || null;
        var nextSibling = child.nextSibling || null;
        if (previousSibling) {
            previousSibling.nextSibling = nextSibling;
        }
        if (nextSibling) {
            nextSibling.previousSibling = previousSibling;
        }
        if (child.nodeType === type_1.default.ELEMENT_NODE) {
            var previousElementSibling = child.previousElementSibling || null;
            var nextElementSibling = child.nextElementSibling || null;
            if (previousElementSibling) {
                previousElementSibling.nextElementSibling = nextElementSibling;
            }
            if (nextElementSibling) {
                nextElementSibling.previousElementSibling = previousElementSibling;
            }
            this.children.splice(this.children.indexOf(child), 1);
        }
        child.previousSibling = child.nextSibling = null;
        child.previousElementSibling = child.nextElementSibling = null;
        return this.childNodes.splice(childIndex, 1);
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
        var lastNode = this.lastChild;
        if (lastNode) {
            lastNode.nextSibling = node;
        }
        node.previousSibling = lastNode;
        node.nextSibling = null;
        var lastElement = this.lastElementChild;
        node.previousElementSibling = lastElement;
        node.nextElementSibling = null;
        if (node.nodeType === type_1.default.ELEMENT_NODE) {
            this.children.push(node);
            if (lastElement) {
                lastElement.nextElementSibling = node;
            }
            if (lastNode) {
                lastNode.nextElementSibling = node;
            }
        }
        this.childNodes.push(node);
        node.parentNode = this;
        if (this.nodeType === type_1.default.ELEMENT_NODE) {
            node.parentElement = node.parentNode;
        }
        else {
            node.parentElement = this.parentElement;
        }
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
