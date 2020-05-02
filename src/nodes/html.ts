import Node from './node';
import NodeType from './type';
import TextNode from './text';
import Matcher from '../matcher';
import arr_back from '../back';
import Style from './style';
import { decodeHTML } from 'entities';
import { Options, parse } from './parse';

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

export type InsertPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';

const kBlockElements = {
	div: true,
	p: true,
	// ul: true,
	// ol: true,
	li: true,
	// table: true,
	// tr: true,
	td: true,
	section: true,
	br: true,
};

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
	private _attrs: Attributes;
	private _rawAttrs: RawAttributes;
	private rawAttrs: string;
	public _id: string;
	public classNames = [] as string[];
	public style: Style;
	public parentElement: HTMLElement = null;
	public parentNode: Node = null;

	/**
	 * Node Type declaration.
	 */
	public nodeType = NodeType.ELEMENT_NODE;

	/**
	 * Creates an instance of HTMLElement.
	 * @param tagName       tag name of node
	 * @param keyAttrs      id and class attribute
	 * @param rawAttrs      attributes in string
	 * @param parentNode    parent of current element
	 *
	 * @memberof HTMLElement
	 */
	public constructor(tagName: string, keyAttrs: KeyAttributes, rawAttrs?: string, parentNode?: Node) {
		super(parentNode);
		this.rawAttrs = rawAttrs || '';
		this.tagName = tagName || '';
		this.childNodes = [];
		if (keyAttrs.id) {
			this.id = keyAttrs.id;
		}
		if (keyAttrs.class) {
			this.classNames = keyAttrs.class.split(/\s+/);
		}
		this.style = new Style(this);
	}

	get className() {
		const names = this.classNames;
		if (names) {
			return names.join(' ');
		}
		return '';
	}

	set className(names) {
		if (names) {
			this.classNames = names.split(' ');
		}
	}

	/**
	 * Get escpaed (as-it) text value of current node and its children.
	 * @return {string} text content
	 */
	public get rawText() {
		return this.childNodes.reduce((pre, cur) => {
			return pre += cur.rawText;
		}, '');
	}

	/**
	 * Get unescaped text value of current node and its children.
	 * @return {string} text content
	 */
	public get text() {
		return decodeHTML(this.rawText);
	}

	public get textContent() {
		return this.text;
	}

	public get id() {
		return this.getAttribute('id') || '';
	}

	public set id(str) {
		this.setAttribute('id', str);
	}

	public get href() {
		return this.getAttribute('href') || '';
	}

	public set href(str) {
		this.setAttribute('href', str);
	}

	public get src() {
		return this.getAttribute('src') || '';
	}

	public set src(str) {
		this.setAttribute('src', str);
	}

	public get nodeName() {
		return this.tagName;
	}

	public get localName() {
		return this.tagName.toLowerCase();
	}

	public get title() {
		const node = this.getElementsByTagName('title')[0];
		return (node && node.textContent) || '';
	}

	public get documentElement() {
		return this.getElementsByTagName('html')[0];
	}

	public get ownerDocument() {
		// todo: fix later
		return this;
	}

	public get head() {
		return this.getElementsByTagName('head')[0];
	}

	public get body() {
		return this.getElementsByTagName('body')[0];
	}

	/**
	 * Get structured Text (with '\n' etc.)
	 * @return {string} structured text
	 */
	public get structuredText() {
		let currentBlock = [] as string[];
		const blocks = [currentBlock];

		function dfs(node: Node) {
			if (node.nodeType === NodeType.ELEMENT_NODE) {
				if (kBlockElements[(node as HTMLElement).tagName]) {
					if (currentBlock.length > 0) {
						blocks.push(currentBlock = []);
					}
					node.childNodes.forEach(dfs);
					if (currentBlock.length > 0) {
						blocks.push(currentBlock = []);
					}
				} else {
					node.childNodes.forEach(dfs);
				}
			} else if (node.nodeType === NodeType.TEXT_NODE) {
				if ((node as TextNode).isWhitespace) {
					// Whitespace node, postponed output
					(currentBlock as any).prependWhitespace = true;
				} else {
					let text = node.text;
					if ((currentBlock as any).prependWhitespace) {
						text = ' ' + text;
						(currentBlock as any).prependWhitespace = false;
					}
					currentBlock.push(text);
				}
			}
		}

		dfs(this);
		return blocks
			.map(function (block) {
				// Normalize each line's whitespace
				return block.join('').trim().replace(/\s{2,}/g, ' ');
			})
			.join('\n').replace(/\s+$/, '');	// trimRight;
	}

	public toString() {
		const tag = this.tagName;
		if (tag) {
			const is_void = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag);
			const attrs = this.rawAttrs ? ' ' + this.rawAttrs : '';
			if (is_void) {
				return `<${tag}${attrs}>`;
			} else {
				return `<${tag}${attrs}>${this.innerHTML}</${tag}>`;
			}
		} else {
			return this.innerHTML;
		}
	}

	public get innerHTML() {
		return this.childNodes.map((child) => {
			return child.toString();
		}).join('');
	}

	public set innerHTML(html) {
		this.set_content(html);
	}

	public set_content(content: string | Node | Node[], options = {} as Options) {
		if (content instanceof Node) {
			content = [content];
		} else if (typeof content == 'string') {
			const r = parse(content, options);
			content = r.childNodes.length ? r.childNodes : [new TextNode(content, this)];
		}
		this.childNodes = content;
	}

	/**
	 * Creates a new Text node.
	 * @return {string} structured text
	 */
	public createElement(tagName: string): HTMLElement {
		return new HTMLElement(tagName, {});
	}

	/**
	 * Creates a new Text node.
	 * @return {string} structured text
	 */
	public createTextNode(data: string): TextNode {
		return new TextNode(data);
	}

	public get outerHTML() {
		return this.toString();
	}

	/**
	 * Trim element from right (in block) after seeing pattern in a TextNode.
	 * @param  {RegExp} pattern pattern to find
	 * @return {HTMLElement}    reference to current node
	 */
	public trimRight(pattern: RegExp) {
		for (let i = 0; i < this.childNodes.length; i++) {
			const childNode = this.childNodes[i];
			if (childNode.nodeType === NodeType.ELEMENT_NODE) {
				(childNode as HTMLElement).trimRight(pattern);
			} else {
				const index = childNode.rawText.search(pattern);
				if (index > -1) {
					childNode.rawText = childNode.rawText.substr(0, index);
					// trim all following nodes.
					this.childNodes.length = i + 1;
				}
			}
		}
		return this;
	}

	/**
	 * Get DOM structure
	 * @return {string} strucutre
	 */
	public get structure() {
		const res = [] as string[];
		let indention = 0;

		function write(str: string) {
			res.push('  '.repeat(indention) + str);
		}

		function dfs(node: HTMLElement) {
			const idStr = node.id ? ('#' + node.id) : '';
			const classStr = node.classNames.length ? ('.' + node.classNames.join('.')) : '';
			write(node.tagName + idStr + classStr);
			indention++;
			node.childNodes.forEach((childNode) => {
				if (childNode.nodeType === NodeType.ELEMENT_NODE) {
					dfs(childNode as HTMLElement);
				} else if (childNode.nodeType === NodeType.TEXT_NODE) {
					if (!(childNode as TextNode).isWhitespace)
						write('#text');
				}
			});
			indention--;
		}

		dfs(this);
		return res.join('\n');
	}

	/**
	 * Remove whitespaces in this sub tree.
	 * @return {HTMLElement} pointer to this
	 */
	public removeWhitespace() {
		let o = 0;
		this.childNodes.forEach((node) => {
			if (node.nodeType === NodeType.TEXT_NODE) {
				if ((node as TextNode).isWhitespace) {
					return;
				}
				node.rawText = node.rawText.trim();
			} else if (node.nodeType === NodeType.ELEMENT_NODE) {
				(node as HTMLElement).removeWhitespace();
			}
			this.childNodes[o++] = node;
		});
		this.childNodes.length = o;
		return this;
	}

	/**
	 * HTMLCollection of elements with the given tag name.
	 * @param  {tagName} tagName is a string representing the name of the elements.
	 * @return {HTMLElement[]} matching elements
	 */
	public getElementsByTagName(tagName: string): HTMLElement[] {
		// return this.querySelectorAll(tagName)
		let result = this.querySelectorAll(tagName);
		if (result.length > 0) {
			return result;
		}
		result = this.querySelectorAll(tagName.toUpperCase());
		if (result.length > 0) {
			return result;
		}
		return result;
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
			matcher = new Matcher(selector);
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
			matcher = new Matcher(selector);
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

	/**
	 * Get attributes
	 * @return {Object} parsed and unescaped attributes
	 */
	public get attributes() {
		if (this._attrs) {
			return this._attrs;
		}
		this._attrs = {};
		const attrs = this.rawAttributes;
		for (const key in attrs) {
			const val = attrs[key] || '';
			this._attrs[key] = decodeHTML(val);
		}
		return this._attrs;
	}

	/**
	 * Get escaped (as-it) attributes
	 * @return {Object} parsed attributes
	 */
	public get rawAttributes() {
		if (this._rawAttrs)
			return this._rawAttrs;
		const attrs = {} as RawAttributes;
		if (this.rawAttrs) {
			const re = /\b([a-z][a-z0-9\-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig;
			let match: RegExpExecArray;
			while (match = re.exec(this.rawAttrs)) {
				attrs[match[1]] = match[2] || match[3] || match[4] || null;
			}
		}
		this._rawAttrs = attrs;
		return attrs;
	}

	public removeAttribute(key: string) {
		const attrs = this.rawAttributes;
		delete attrs[key];
		// Update this.attribute
		if (this._attrs) {
			delete this._attrs[key];
		}
		// Update rawString
		this.rawAttrs = Object.keys(attrs).map((name) => {
			const val = JSON.stringify(attrs[name]);
			if (val === undefined || val === 'null') {
				return name;
			} else {
				return name + '=' + val;
			}
		}).join(' ');
	}

	public hasAttribute(key: string) {
		return key in this.attributes;
	}

	/**
	 * Get an attribute
	 * @return {string} value of the attribute
	 */
	public getAttribute(key: string) {
		return this.attributes[key];
	}

	/**
	 * Set an attribute value to the HTMLElement
	 * @param {string} key The attribute name
	 * @param {string} value The value to set, or null / undefined to remove an attribute
	 */
	public setAttribute(key: string, value: string) {
		if (arguments.length < 2) {
			throw new Error('Failed to execute \'setAttribute\' on \'Element\'');
		}
		const attrs = this.rawAttributes;
		attrs[key] = String(value);
		if (this._attrs) {
			this._attrs[key] = decodeHTML(attrs[key]);
		}
		// Update rawString
		this.rawAttrs = Object.keys(attrs).map((name) => {
			const val = JSON.stringify(attrs[name]);
			if (val === undefined || val === 'null') {
				return name;
			} else {
				return name + '=' + val;
			}
		}).join(' ');
	}

	/**
	 * Replace all the attributes of the HTMLElement by the provided attributes
	 * @param {Attributes} attributes the new attribute set
	 */
	public setAttributes(attributes: Attributes) {
		// Invalidate current this.attributes
		if (this._attrs) {
			delete this._attrs;
		}
		// Invalidate current this.rawAttributes
		if (this._rawAttrs) {
			delete this._rawAttrs;
		}
		// Update rawString
		this.rawAttrs = Object.keys(attributes).map((name) => {
			const val = attributes[name];
			if (val === undefined || val === null) {
				return name;
			} else {
				return name + '=' + JSON.stringify(String(val));
			}
		}).join(' ');
	}

	public insertAdjacentHTML(where: InsertPosition, html: string) {
		if (arguments.length < 2) {
			throw new Error('2 arguments required');
		}
		const p = parse(html) as HTMLElement;
		if (where === 'afterend') {
			p.childNodes.forEach((n) => {
				(this.parentNode as HTMLElement).appendChild(n);
			});
		} else if (where === 'afterbegin') {
			this.childNodes.unshift(...p.childNodes);
		} else if (where === 'beforeend') {
			p.childNodes.forEach((n) => {
				this.appendChild(n);
			});
		} else if (where === 'beforebegin') {
			(this.parentNode as HTMLElement).childNodes.unshift(...p.childNodes);
		} else {
			throw new Error(`The value provided ('${where}') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'`);
		}
		if (!where || html === undefined || html === null) {
			return;
		}
	}
}
