import NodeType from './type';
import Node from './node';

/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
export default class TextNode extends Node {
    constructor(value: string, parentNode?: Node) {
        super(parentNode);
        this.rawText = value;
    }

    /**
     * Node Type declaration.
     * @type {Number}
     */
    nodeType = NodeType.TEXT_NODE;

    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text() {
        return this.rawText;
    }

    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get textContent() {
        return this.text;
    }

    /**
     * Detect if the node contains only white space.
     * @return {bool}
     */
    get isWhitespace() {
        return /^(\s|&nbsp;)*$/.test(this.rawText);
    }

    toString() {
        return this.text;
    }
}
