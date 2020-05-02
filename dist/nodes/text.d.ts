import NodeType from './type';
import Node from './node';
/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
export default class TextNode extends Node {
    constructor(value: string, parentNode?: Node, ownerDocument?: Node);
    /**
     * Node Type declaration.
     * @type {Number}
     */
    nodeType: NodeType;
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text(): string;
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get textContent(): string;
    set textContent(text: string);
    /**
     * Detect if the node contains only white space.
     * @return {boolean}
     */
    get isWhitespace(): boolean;
    toString(): string;
}
