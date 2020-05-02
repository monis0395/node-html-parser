import Node from './node';
import NodeType from './type';
import TextNode from './text';
import HTMLElement from './html';
import Matcher from '../matcher';
import { Options } from './options';
export default class Document extends Node {
    private readonly _documentURI;
    private _baseURI;
    constructor(url?: string, parentNode?: Node, ownerDocument?: Node, options?: Options);
    nodeType: NodeType;
    toString(): string;
    hasAttribute(): boolean;
    get documentURI(): string;
    get baseURI(): string;
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    createElement(tagName: string): HTMLElement;
    /**
     * Creates a new Text node.
     * @return {string} structured text
     */
    createTextNode(data: string): TextNode;
    get title(): string;
    get documentElement(): this;
    get head(): HTMLElement;
    get body(): HTMLElement;
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
}
