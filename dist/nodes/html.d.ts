import Node from './node';
import NodeType from './type';
import TextNode from './text';
import Matcher from '../matcher';
import Style from './style';
export interface KeyAttributes {
    id?: string;
    class?: string;
}
export interface Attributes {
    [key: string]: string;
}
export interface RawAttributes {
    [key: string]: string;
}
export declare type InsertPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree
 *   structure provided (no parentNode, nextSibling,
 *   previousSibling etc).
 * @class HTMLElement
 * @extends {Node}
 */
export default class HTMLElement extends Node {
    tagName: string;
    private rawAttrs;
    parentNode: Node;
    private _attrs;
    private _rawAttrs;
    _id: string;
    classNames: string[];
    style: Style;
    /**
     * Node Type declaration.
     */
    nodeType: NodeType;
    /**
     * Creates an instance of HTMLElement.
     * @param keyAttrs      id and class attribute
     * @param [rawAttrs]    attributes in string
     *
     * @memberof HTMLElement
     */
    constructor(tagName: string, keyAttrs: KeyAttributes, rawAttrs?: string, parentNode?: Node);
    /**
     * Remove Child element from childNodes array
     * @param {HTMLElement} node     node to remove
     */
    removeChild(node: Node): void;
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
    /**
     * Get escpaed (as-it) text value of current node and its children.
     * @return {string} text content
     */
    get rawText(): string;
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
    get className(): string;
    set className(names: string);
    get id(): string;
    set id(str: string);
    get href(): string;
    set href(str: string);
    get src(): string;
    set src(str: string);
    get nodeName(): string;
    get localName(): string;
    get title(): string;
    get documentElement(): HTMLElement;
    get head(): HTMLElement;
    get body(): HTMLElement;
    /**
     * Get structured Text (with '\n' etc.)
     * @return {string} structured text
     */
    get structuredText(): string;
    toString(): string;
    get innerHTML(): string;
    set_content(content: string | Node | Node[], options?: Options): void;
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    createTextNode(data: string): TextNode;
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    createElement(tagName: string): HTMLElement;
    get outerHTML(): string;
    /**
     * Trim element from right (in block) after seeing pattern in a TextNode.
     * @param  {RegExp} pattern pattern to find
     * @return {HTMLElement}    reference to current node
     */
    trimRight(pattern: RegExp): this;
    /**
     * Get DOM structure
     * @return {string} strucutre
     */
    get structure(): string;
    /**
     * Remove whitespaces in this sub tree.
     * @return {HTMLElement} pointer to this
     */
    removeWhitespace(): this;
    /**
     * HTMLCollection of elements with the given tag name.
     * @param  {tagName} tagName is a string representing the name of the elements.
     * @return {HTMLElement[]} matching elements
     */
    getElementsByTagName(tagName: string): HTMLElement[];
    /**
     * Get Elements whose class property matches the specified string.
     * @param  {string} className is a string representing the class name(s) to match
     * @return {HTMLElement[]} all child elements which have all of the given class name(s)
     */
    getElementsByClassName(className: string): HTMLElement[];
    /**
     * returns an Element object representing the element whose id property matches the specified string.
     * @param  {string} id of the element to locate
     * @return {(HTMLElement | null)}  An Element matching the specified ID, or null if no matching element was found
     */
    getElementById(id: string): HTMLElement | null;
    /**
     * Query CSS selector to find matching nodes.
     * @param  {string}         selector Simplified CSS selector
     * @param  {Matcher}        selector A Matcher instance
     * @return {HTMLElement[]}  matching elements
     */
    querySelectorAll(selector: string | Matcher): HTMLElement[];
    /**
     * Query CSS Selector to find matching node.
     * @param  {string}         selector Simplified CSS selector
     * @param  {Matcher}        selector A Matcher instance
     * @return {HTMLElement}    matching node
     */
    querySelector(selector: string | Matcher): HTMLElement;
    /**
     * Append a child node to childNodes
     * @param  {Node} node node to append
     * @return {Node}      node appended
     */
    appendChild<T extends Node = Node>(node: T): T;
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
     * Get attributes
     * @return {Object} parsed and unescaped attributes
     */
    get attributes(): Attributes;
    /**
     * Get escaped (as-it) attributes
     * @return {Object} parsed attributes
     */
    get rawAttributes(): RawAttributes;
    removeAttribute(key: string): void;
    hasAttribute(key: string): boolean;
    /**
     * Get an attribute
     * @return {string} value of the attribute
     */
    getAttribute(key: string): string;
    /**
     * Set an attribute value to the HTMLElement
     * @param {string} key The attribute name
     * @param {string} value The value to set, or null / undefined to remove an attribute
     */
    setAttribute(key: string, value: string): void;
    /**
     * Replace all the attributes of the HTMLElement by the provided attributes
     * @param {Attributes} attributes the new attribute set
     */
    setAttributes(attributes: Attributes): void;
    insertAdjacentHTML(where: InsertPosition, html: string): void;
}
export interface Options {
    lowerCaseTagName?: boolean;
    noFix?: boolean;
    script?: boolean;
    style?: boolean;
    pre?: boolean;
    comment?: boolean;
}
/**
 * Parses HTML and returns a root element
 * Parse a chuck of HTML source.
 * @param  {string} data      html
 * @return {HTMLElement}      root element
 */
export declare function parse(data: string, options?: Options): (TextNode & {
    valid: boolean;
}) | (HTMLElement & {
    valid: boolean;
});
