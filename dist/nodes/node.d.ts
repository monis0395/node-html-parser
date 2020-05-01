import NodeType from './type';
/**
 * Node Class as base class for TextNode and HTMLElement.
 */
export default abstract class Node {
    nodeType: NodeType;
    childNodes: Node[];
    text: string;
    rawText: string;
    parentNode: Node | null;
    nextSibling: Node | null;
    previousSibling: Node | null;
    abstract toString(): string;
    get children(): Node[];
    get childElementCount(): number;
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get textContent(): string;
    /**
     * Get first child node
     * @return {Node} first child node
     */
    get firstChild(): Node;
    /**
     * Get last child node
     * @return {Node} last child node
     */
    get lastChild(): Node;
    /**
     * Get first child element
     * @return {Node} first child element
     */
    get firstElementChild(): Node;
    /**
     * Get last child element
     * @return {Node} last child element
     */
    get lastElementChild(): Node;
    /**
     * Remove Child element from childNodes array
     * @param {HTMLElement} node     node to remove
     */
    removeChild(node: Node): void;
    /**
     * Append a child node to childNodes
     * @param  {Node} node node to append
     * @return {Node}      node appended
     */
    appendChild<T extends Node = Node>(node: T): T;
    /**
     * Exchanges given child with new child
     * @param {HTMLElement} oldNode     node to exchange
     * @param {HTMLElement} newNode     new node
     */
    exchangeChild(oldNode: Node, newNode: Node): void;
    /**
     * Exchanges given child with new child
     * @param {HTMLElement} oldNode     node to exchange
     * @param {HTMLElement} newNode     new node
     */
    replaceChild(oldNode: Node, newNode: Node): Node;
}
