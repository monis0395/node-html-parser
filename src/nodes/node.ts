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
    }

    /**
     * Append a child node to childNodes
     * @param  {Node} node node to append
     * @return {Node}      node appended
     */
    public appendChild<T extends Node = Node>(node: T) {
        this.childNodes.push(node);
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        node.parentNode = this;
        return node;
    }
}
