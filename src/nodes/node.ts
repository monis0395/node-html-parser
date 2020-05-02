import NodeType from './type';
import arr_back from '../back';
import HTMLElement from './html';
import { Options } from './options';

/**
 * Node Class as base class for TextNode and HTMLElement.
 */
export default abstract class Node {
	nodeType: NodeType;
	childNodes = [] as Node[];
	children = [] as Node[];
	text: string;
	rawText: string;
	parentNode: Node | null = null;
	parentElement: HTMLElement | null = null;
	nextSibling: Node | null = null;
	previousSibling: Node | null = null;
	nextElementSibling: Node | null = null;
	previousElementSibling: Node | null = null;
	ogTagName = '';
	private readonly _ownerDocument: Node;
	protected options: Options;

	protected constructor(parentNode?: Node, ownerDocument?: Node, options?: Options) {
		this.parentNode = parentNode || null;
		this._ownerDocument = ownerDocument || this;
		this.options = options || {};
		if (this.parentNode && this.parentNode.nodeType === NodeType.ELEMENT_NODE) {
			this.parentElement = this.parentNode as HTMLElement;
		}
	}

	abstract toString(): string;

	public get ownerDocument() {
		return this._ownerDocument;
	}

	/**
	 * Get first child node
	 * @return {Node} first child node
	 */
	public get firstChild() {
		return this.childNodes[0] || null;
	}

	/**
	 * Get first child element
	 * @return {Node} first child element
	 */
	public get firstElementChild() {
		return this.children[0] || null;
	}

	/**
	 * Get last child node
	 * @return {Node} last child node
	 */
	public get lastChild() {
		return arr_back(this.childNodes) || null;
	}

	/**
	 * Get last child element
	 * @return {Node} last child element
	 */
	public get lastElementChild() {
		return arr_back(this.children) || null;
	}

	/**
	 * Remove Child element from childNodes array
	 * @param {HTMLElement} child     node to remove
	 */
	public removeChild(child: Node) {
		const childIndex = this.childNodes.indexOf(child);
		if (childIndex === -1) {
			throw new Error('removeChild: node not found');
		}
		child.parentNode = null;

		const previousSibling = child.previousSibling || null;
		const nextSibling = child.nextSibling || null;
		if (previousSibling) {
			previousSibling.nextSibling = nextSibling;
		}
		if (nextSibling) {
			nextSibling.previousSibling = previousSibling;
		}

		if (child.nodeType === NodeType.ELEMENT_NODE) {
			const previousElementSibling = child.previousElementSibling || null;
			const nextElementSibling = child.nextElementSibling || null;
			if (previousElementSibling) {
				previousElementSibling.nextElementSibling = nextElementSibling;
			}
			if (nextElementSibling) {
				nextElementSibling.previousElementSibling = previousElementSibling;
			}
			this.children.splice(this.children.indexOf(child), 1);
		}

		child.previousSibling = child.nextSibling = null;
		child.previousElementSibling = child.nextElementSibling = null;

		return this.childNodes.splice(childIndex, 1);
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
		const lastNode = this.lastChild;
		if (lastNode) {
			lastNode.nextSibling = node;
		}
		node.previousSibling = lastNode;
		node.nextSibling = null;

		const lastElement = this.lastElementChild;
		node.previousElementSibling = lastElement;
		node.nextElementSibling = null;
		if (node.nodeType === NodeType.ELEMENT_NODE) {
			this.children.push(node);
			if (lastElement) {
				lastElement.nextElementSibling = node;
			}
			if (lastNode) {
				lastNode.nextElementSibling = node;
			}
		}

		this.childNodes.push(node);

		node.parentNode = this;
		if (this.nodeType === NodeType.ELEMENT_NODE) {
			node.parentElement = node.parentNode as HTMLElement;
		} else {
			node.parentElement = this.parentElement;
		}
		return node;
	}

	/**
	 * Exchanges given child with new child
	 * @param {HTMLElement} oldNode     node to exchange
	 * @param {HTMLElement} newNode     new node
	 */
	public exchangeChild(oldNode: Node, newNode: Node) {
		const childIndex = this.childNodes.indexOf(oldNode);
		if (childIndex === -1) {
			console.warn('replaceChild: node not found');
		}
		this.childNodes[childIndex] = newNode;

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
			this.children.splice(this.children.indexOf(oldNode), 1);
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

for (const nodeType in NodeType) {
	Node[nodeType] = Node.prototype[nodeType] = NodeType[nodeType];
}
