import NodeType from './type';
import arr_back from '../back';
import { decode } from 'he';

/**
 * Node Class as base class for TextNode and HTMLElement.
 */
export default abstract class Node {
    nodeType: NodeType;
    childNodes = [] as Node[];
    text: string;
    rawText: string;
    parentNode: Node | null;
    nextSibling: Node | null;
    previousSibling: Node | null;
    nextElementSibling: Node | null;
    previousElementSibling: Node | null;

    abstract toString(): string;

    get children() {
        return this.childNodes.filter((node) => node.nodeType === NodeType.ELEMENT_NODE);
    }

    get childElementCount() {
        return this.childNodes.length;
    }

    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    public get textContent() {
        return decode(this.childNodes.reduce((pre, cur) => {
            return pre += cur.rawText;
        }, ''));
    }

    /**
     * Get first child node
     * @return {Node} first child node
     */
    public get firstChild() {
        return this.childNodes[0];
    }

    /**
     * Get last child node
     * @return {Node} last child node
     */
    public get lastChild() {
        return arr_back(this.childNodes);
    }

    /**
     * Get first child element
     * @return {Node} first child element
     */
    public get firstElementChild() {
        return this.childNodes.find((node) => node.nodeType === NodeType.ELEMENT_NODE);
    }

    /**
     * Get last child element
     * @return {Node} last child element
     */
    public get lastElementChild() {
        let idx;
        for (let i = this.childNodes.length - 1; i > -1; i--) {
            if (this.childNodes[i].nodeType === NodeType.ELEMENT_NODE) {
                idx = i;
                break;
            }
        }
        return this.childNodes[idx];
    }

    /**
     * Remove Child element from childNodes array
     * @param {HTMLElement} node     node to remove
     */
    public removeChild(node: Node) {
        this.childNodes = this.childNodes.filter((child) => {
            return (child !== node);
        });

        const previousSibling = node.previousSibling || null;
        const nextSibling = node.nextSibling || null;
        if (previousSibling) {
            previousSibling.nextSibling = nextSibling;
        }
        if (nextSibling) {
            nextSibling.previousSibling = previousSibling;
        }

        const previousElementSibling = node.previousElementSibling || null;
        const nextElementSibling = node.nextElementSibling || null;
        if (previousElementSibling) {
            previousElementSibling.nextElementSibling = nextElementSibling;
        }
        if (nextElementSibling) {
            nextElementSibling.previousElementSibling = previousElementSibling;
        }
    }

    /**
     * Append a child node to childNodes
     * @param  {Node} node node to append
     * @return {Node}      node appended
     */
    public appendChild<T extends Node = Node>(node: T) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        const lastNode = this.childNodes[this.childNodes.length - 1] || null;
        if (lastNode) {
            lastNode.nextSibling = node;
        }
        node.previousSibling = lastNode;
        node.nextSibling = null;

        const lastElement = this.children[this.children.length - 1] || null;
        if (lastElement && node.nodeType === NodeType.ELEMENT_NODE) {
            lastElement.nextElementSibling = node;
        }
        if (lastNode && node.nodeType === NodeType.ELEMENT_NODE) {
            lastNode.nextElementSibling = node;
        }
        node.previousElementSibling = lastElement;
        node.nextElementSibling = null;

        this.childNodes.push(node);

        node.parentNode = this;
        return node;
    }

    /**
     * Exchanges given child with new child
     * @param {HTMLElement} oldNode     node to exchange
     * @param {HTMLElement} newNode     new node
     */
    public exchangeChild(oldNode: Node, newNode: Node) {
        let idx = -1;
        for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i] === oldNode) {
                idx = i;
                break;
            }
        }
        this.childNodes[idx] = newNode;

        const previousSibling = oldNode.previousSibling || null;
        const nextSibling = oldNode.nextSibling || null;

        newNode.previousSibling = previousSibling;
        newNode.nextSibling = nextSibling;

        if (previousSibling) {
            previousSibling.nextSibling = newNode;
        }
        if (nextSibling) {
            nextSibling.previousSibling = newNode;
        }

        const previousElementSibling = oldNode.previousElementSibling || null;
        const nextElementSibling = oldNode.nextElementSibling || null;

        newNode.previousElementSibling = previousElementSibling;
        newNode.nextElementSibling = nextElementSibling;
        if (newNode.nodeType === NodeType.ELEMENT_NODE) {
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
    }

    /**
     * Exchanges given child with new child
     * @param {HTMLElement} oldNode     node to exchange
     * @param {HTMLElement} newNode     new node
     */
    public replaceChild(oldNode: Node, newNode: Node) {
        this.exchangeChild(oldNode, newNode);
        return oldNode;
    }
}
