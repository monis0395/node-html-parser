import Node from './node';
import NodeType from './type';
import { Options } from './options';

export default class CommentNode extends Node {
	constructor(value: string, parentNode?: Node, options?: Options) {
		super(parentNode, options);
		this.rawText = value;
	}

	/**
	 * Node Type declaration.
	 * @type {Number}
	 */
	nodeType = NodeType.COMMENT_NODE;

	/**
	 * Get unescaped text value of current node and its children.
	 * @return {string} text content
	 */
	get text() {
		return this.rawText;
	}

	toString() {
		return `<!--${this.rawText}-->`;
	}
}
