// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
import TextNode from './text';
import CommentNode from './comment';
import arr_back from '../back';
import HTMLElement from './html';

const kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.:0-9_a-z]*)\s*([^>]*?)(\/?)>/ig;
const kAttributePattern = /(^|\s)(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
const kSelfClosingElements = {
	area: true,
	base: true,
	br: true,
	col: true,
	hr: true,
	img: true,
	input: true,
	link: true,
	meta: true,
	source: true,
};

const kElementsClosedByOpening = {
	li: { li: true },
	p: { p: true, div: true },
	b: { div: true },
	td: { td: true, th: true },
	th: { td: true, th: true },
	h1: { h1: true },
	h2: { h2: true },
	h3: { h3: true },
	h4: { h4: true },
	h5: { h5: true },
	h6: { h6: true },
};

const kElementsClosedByClosing = {
	li: { ul: true, ol: true },
	a: { div: true },
	b: { div: true },
	i: { div: true },
	p: { div: true },
	td: { tr: true, table: true },
	th: { tr: true, table: true },
};

const kBlockTextElements = {
	script: true,
	noscript: true,
	style: true,
	pre: true,
};

export interface Options {
	lowerCaseTagName?: boolean;
	upperCaseTagName?: boolean;
	noFix?: boolean;
	script?: boolean;
	style?: boolean;
	pre?: boolean;
	comment?: boolean;
}

const frameflag = 'documentfragmentcontainer';

/**
 * Parses HTML and returns a root element
 * Parse a chuck of HTML source.
 * @param  {string} data      html
 * @return {HTMLElement}      root element
 */
export function parse(data: string, options = {} as Options) {
	const root = new HTMLElement(null, {});
	let currentParent = root;
	const stack = [root];
	let lastTextPos = -1;
	let match: RegExpExecArray;
	// https://github.com/taoqf/node-html-parser/issues/38
	data = `<${frameflag}>${data}</${frameflag}>`;
	while (match = kMarkupPattern.exec(data)) {
		if (lastTextPos > -1) {
			if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
				// if has content
				const text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
				currentParent.appendChild(new TextNode(text));
			}
		}
		lastTextPos = kMarkupPattern.lastIndex;
		if (match[2] === frameflag) {
			continue;
		}
		if (match[0][1] === '!') {
			// this is a comment
			if (options.comment) {
				// Only keep what is in between <!-- and -->
				const text = data.substring(lastTextPos - 3, lastTextPos - match[0].length + 4);
				currentParent.appendChild(new CommentNode(text));
			}
			continue;
		}
		if (options.lowerCaseTagName) {
			match[2] = match[2].toLowerCase();
		}
		if (options.upperCaseTagName) {
			match[2] = match[2].toUpperCase();
		}
		if (!match[1]) {
			// not </ tags
			const attrs = {};
			for (let attMatch; attMatch = kAttributePattern.exec(match[3]);) {
				attrs[attMatch[2]] = attMatch[4] || attMatch[5] || attMatch[6];
			}

			let tagName = currentParent.tagName;
			if (options.upperCaseTagName) {
				tagName = tagName.toLowerCase();
			}
			if (!match[4] && kElementsClosedByOpening[tagName]) {
				if (kElementsClosedByOpening[tagName][match[2]]) {
					stack.pop();
					currentParent = arr_back(stack);
				}
			}
			// ignore container tag we add above
			// https://github.com/taoqf/node-html-parser/issues/38
			currentParent = currentParent.appendChild(new HTMLElement(match[2], attrs, match[3]));
			stack.push(currentParent);

			let kBlockKey = match[2];
			if (options.upperCaseTagName) {
				kBlockKey = kBlockKey.toLowerCase();
			}
			if (kBlockTextElements[kBlockKey]) {
				// a little test to find next </script> or </style> ...
				const closeMarkup = '</' + match[2] + '>';
				const index = (() => {
					if (options.lowerCaseTagName) {
						return data.toLocaleLowerCase().indexOf(closeMarkup, kMarkupPattern.lastIndex);
					} else if (options.upperCaseTagName) {
						return data.toLocaleUpperCase().indexOf(closeMarkup, kMarkupPattern.lastIndex);
					} else {
						return data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
					}
				})();
				if (options[match[2]]) {
					let text: string;
					if (index === -1) {
						// there is no matching ending for the text element.
						text = data.substr(kMarkupPattern.lastIndex);
					} else {
						text = data.substring(kMarkupPattern.lastIndex, index);
					}
					if (text.length > 0) {
						currentParent.appendChild(new TextNode(text));
					}
				}
				if (index === -1) {
					lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
				} else {
					lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
					match[1] = 'true';
				}
			}
		}

		let key = match[2];
		if (options.upperCaseTagName) {
			key = key.toLowerCase();
		}
		if (match[1] || match[4] || kSelfClosingElements[key]) {
			// </ or /> or <br> etc.
			while (true) {
				if (currentParent.tagName === match[2]) {
					stack.pop();
					currentParent = arr_back(stack);
					break;
				} else {
					let tagName = currentParent.tagName;
					if (options.upperCaseTagName) {
						tagName = tagName.toLowerCase();
					}
					// Trying to close current tag, and move on
					if (kElementsClosedByClosing[tagName]) {
						if (kElementsClosedByClosing[tagName][match[2]]) {
							stack.pop();
							currentParent = arr_back(stack);
							continue;
						}
					}
					// Use aggressive strategy to handle unmatching markups.
					break;
				}
			}
		}
	}
	type Response = (HTMLElement | TextNode) & { valid: boolean };
	const valid = !!(stack.length === 1);
	if (!options.noFix) {
		const response = root as Response;
		response.valid = valid;
		while (stack.length > 1) {
			// Handle each error elements.
			const last = stack.pop();
			const oneBefore = arr_back(stack);
			if (last.parentNode && (last.parentNode as HTMLElement).parentNode) {
				if (last.parentNode === oneBefore && last.tagName === oneBefore.tagName) {
					// Pair error case <h3> <h3> handle : Fixes to <h3> </h3>
					oneBefore.removeChild(last);
					last.childNodes.forEach((child) => {
						(oneBefore.parentNode as HTMLElement).appendChild(child);
					});
					stack.pop();
				} else {
					// Single error  <div> <h3> </div> handle: Just removes <h3>
					oneBefore.removeChild(last);
					last.childNodes.forEach((child) => {
						oneBefore.appendChild(child);
					});
				}
			} else {
				// If it's final element just skip.
			}
		}
		response.childNodes.forEach((node) => {
			if (node instanceof HTMLElement) {
				node.parentNode = null;
			}
		});
		return response;
	} else {
		const response = new TextNode(data) as Response;
		response.valid = valid;
		return response;
	}
}
