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

    abstract toString(): string;

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
