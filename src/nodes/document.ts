import Node from './node';
import NodeType from './type';
import TextNode from './text';
import HTMLElement from './html';
import Matcher from '../matcher';
import arr_back from '../back';
import { Options } from './options';
import { URL } from 'url';

export default class Document extends Node {
	private readonly _documentURI: string | undefined;
	private _baseURI: string;

	constructor(url?: string, parentNode?: Node, ownerDocument?: Node, options?: Options) {
		super(parentNode, ownerDocument, options);
		this._documentURI = url;
	}

	nodeType = NodeType.DOCUMENT_NODE;

	public toString() {
		return this.childNodes.map((child) => child.toString()).join('');
	}

	public hasAttribute() {
		return false;
	}

	get documentURI() {
		return this._documentURI
	}

	get baseURI() {
		if (this._baseURI || this._baseURI === '') {
			return this._baseURI;
		}
		this._baseURI = this._documentURI;
		const baseElements = this.getElementsByTagName('base');
		const href = baseElements[0] && baseElements[0].getAttribute('href');
		if (href) {
			try {
				this._baseURI = (new URL(href, this._baseURI)).href;
			} catch (ex) {/* Just fall back to documentURI */
			}
		}
		return this._baseURI
	}

	/**
	 * Creates a new Text node.
	 * @return {string} structured text
	 */
	public createElement(tagName: string): HTMLElement {
		return new HTMLElement(tagName, {}, '', null, this.ownerDocument, this.options);
	}

	/**
	 * Creates a new Text node.
	 * @return {string} structured text
	 */
	public createTextNode(data: string): TextNode {
		return new TextNode(data, null, this.ownerDocument);
	}

	public get title() {
		const node = this.getElementsByTagName('title')[0];
		return (node && node.textContent) || '';
	}

	public get documentElement() {
		return this;
	}

	public get head() {
		return this.getElementsByTagName('head')[0];
	}

	public get body() {
		return this.getElementsByTagName('body')[0];
	}

	/**
	 * HTMLCollection of elements with the given tag name.
	 * @param  {tagName} tagName is a string representing the name of the elements.
	 * @return {HTMLElement[]} matching elements
	 */
	public getElementsByTagName(tagName: string): HTMLElement[] {
		if (this.options.upperCaseTagName) {
			tagName = tagName.toUpperCase();
		}
		return this.querySelectorAll(tagName);
	}

	/**
	 * Get Elements whose class property matches the specified string.
	 * @param  {string} className is a string representing the class name(s) to match
	 * @return {HTMLElement[]} all child elements which have all of the given class name(s)
	 */
	public getElementsByClassName(className: string): HTMLElement[] {
		return this.querySelectorAll(`.${className}`);
	}

	/**
	 * returns an Element object representing the element whose id property matches the specified string.
	 * @param  {string} id of the element to locate
	 * @return {(HTMLElement | null)}  An Element matching the specified ID, or null if no matching element was found
	 */
	public getElementById(id: string): HTMLElement | null {
		return this.querySelector(`#${id}`);
	}

	/**
	 * Query CSS selector to find matching nodes.
	 * @param  {string}         selector Simplified CSS selector
	 * @param  {Matcher}        selector A Matcher instance
	 * @return {HTMLElement[]}  matching elements
	 */
	public querySelectorAll(selector: string | Matcher): HTMLElement[] {
		let matcher: Matcher;
		if (selector instanceof Matcher) {
			matcher = selector;
			matcher.reset();
		} else {
			if (selector.includes(',')) {
				const selectors = selector.split(',');
				return Array.from(selectors.reduce((pre, cur) => {
					const result = this.querySelectorAll(cur.trim());
					return result.reduce((p, c) => {
						return p.add(c);
					}, pre);
				}, new Set<HTMLElement>()));
			}
			matcher = new Matcher(selector, this.options);
		}

		interface IStack {
			0: Node;	// node
			1: number;	// children
			2: boolean;	// found flag
		}

		const stack = [] as IStack[];
		return this.childNodes.reduce((res, cur) => {
			stack.push([cur, 0, false]);
			while (stack.length) {
				const state = arr_back(stack);	// get last element
				const el = state[0];
				if (state[1] === 0) {
					// Seen for first time.
					if (el.nodeType !== NodeType.ELEMENT_NODE) {
						stack.pop();
						continue;
					}
					const html_el = el as HTMLElement;
					state[2] = matcher.advance(html_el);
					if (state[2]) {
						if (matcher.matched) {
							res.push(html_el);
							res.push(...(html_el.querySelectorAll(selector)));
							// no need to go further.
							matcher.rewind();
							stack.pop();
							continue;
						}
					}
				}
				if (state[1] < el.childNodes.length) {
					stack.push([el.childNodes[state[1]++], 0, false]);
				} else {
					if (state[2]) {
						matcher.rewind();
					}
					stack.pop();
				}
			}
			return res;
		}, [] as HTMLElement[]);
	}

	/**
	 * Query CSS Selector to find matching node.
	 * @param  {string}         selector Simplified CSS selector
	 * @param  {Matcher}        selector A Matcher instance
	 * @return {HTMLElement}    matching node
	 */
	public querySelector(selector: string | Matcher) {
		let matcher: Matcher;
		if (selector instanceof Matcher) {
			matcher = selector;
			matcher.reset();
		} else {
			matcher = new Matcher(selector, this.options);
		}
		const stack = [] as { 0: Node; 1: 0 | 1; 2: boolean }[];
		for (const node of this.childNodes) {
			stack.push([node, 0, false]);
			while (stack.length) {
				const state = arr_back(stack);
				const el = state[0];
				if (state[1] === 0) {
					// Seen for first time.
					if (el.nodeType !== NodeType.ELEMENT_NODE) {
						stack.pop();
						continue;
					}
					state[2] = matcher.advance(el as HTMLElement);
					if (state[2]) {
						if (matcher.matched) {
							return el as HTMLElement;
						}
					}
				}
				if (state[1] < el.childNodes.length) {
					stack.push([el.childNodes[state[1]++], 0, false]);
				} else {
					if (state[2])
						matcher.rewind();
					stack.pop();
				}
			}
		}
		return null;
	}

}
