"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
var text_1 = __importDefault(require("./text"));
var comment_1 = __importDefault(require("./comment"));
var back_1 = __importDefault(require("../back"));
var html_1 = __importDefault(require("./html"));
var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.:0-9_a-z]*)\s*([^>]*?)(\/?)>/ig;
var kAttributePattern = /(^|\s)(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
var kSelfClosingElements = {
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
var kElementsClosedByOpening = {
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
var kElementsClosedByClosing = {
    li: { ul: true, ol: true },
    a: { div: true },
    b: { div: true },
    i: { div: true },
    p: { div: true },
    td: { tr: true, table: true },
    th: { tr: true, table: true },
};
var kBlockTextElements = {
    script: true,
    noscript: true,
    style: true,
    pre: true,
};
var frameflag = 'documentfragmentcontainer';
/**
 * Parses HTML and returns a root element
 * Parse a chuck of HTML source.
 * @param  {string} data      html
 * @return {HTMLElement}      root element
 */
function parse(data, options) {
    if (options === void 0) { options = {}; }
    var root = new html_1.default(null, {});
    var currentParent = root;
    var stack = [root];
    var lastTextPos = -1;
    var match;
    // https://github.com/taoqf/node-html-parser/issues/38
    data = "<" + frameflag + ">" + data + "</" + frameflag + ">";
    var _loop_1 = function () {
        if (lastTextPos > -1) {
            if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
                // if has content
                var text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
                currentParent.appendChild(new text_1.default(text));
            }
        }
        lastTextPos = kMarkupPattern.lastIndex;
        if (match[2] === frameflag) {
            return "continue";
        }
        if (match[0][1] === '!') {
            // this is a comment
            if (options.comment) {
                // Only keep what is in between <!-- and -->
                var text = data.substring(lastTextPos - 3, lastTextPos - match[0].length + 4);
                currentParent.appendChild(new comment_1.default(text));
            }
            return "continue";
        }
        if (options.lowerCaseTagName) {
            match[2] = match[2].toLowerCase();
        }
        if (options.upperCaseTagName) {
            match[2] = match[2].toUpperCase();
        }
        if (!match[1]) {
            // not </ tags
            var attrs = {};
            for (var attMatch = void 0; attMatch = kAttributePattern.exec(match[3]);) {
                attrs[attMatch[2]] = attMatch[4] || attMatch[5] || attMatch[6];
            }
            var tagName = currentParent.tagName;
            if (options.upperCaseTagName) {
                tagName = tagName.toLowerCase();
            }
            if (!match[4] && kElementsClosedByOpening[tagName]) {
                if (kElementsClosedByOpening[tagName][match[2]]) {
                    stack.pop();
                    currentParent = back_1.default(stack);
                }
            }
            // ignore container tag we add above
            // https://github.com/taoqf/node-html-parser/issues/38
            currentParent = currentParent.appendChild(new html_1.default(match[2], attrs, match[3]));
            stack.push(currentParent);
            var kBlockKey = match[2];
            if (options.upperCaseTagName) {
                kBlockKey = kBlockKey.toLowerCase();
            }
            if (kBlockTextElements[kBlockKey]) {
                // a little test to find next </script> or </style> ...
                var closeMarkup_1 = '</' + match[2] + '>';
                var index = (function () {
                    if (options.lowerCaseTagName) {
                        return data.toLocaleLowerCase().indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
                    }
                    else if (options.upperCaseTagName) {
                        return data.toLocaleUpperCase().indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
                    }
                    else {
                        return data.indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
                    }
                })();
                if (options[match[2]]) {
                    var text = void 0;
                    if (index === -1) {
                        // there is no matching ending for the text element.
                        text = data.substr(kMarkupPattern.lastIndex);
                    }
                    else {
                        text = data.substring(kMarkupPattern.lastIndex, index);
                    }
                    if (text.length > 0) {
                        currentParent.appendChild(new text_1.default(text));
                    }
                }
                if (index === -1) {
                    lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
                }
                else {
                    lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup_1.length;
                    match[1] = 'true';
                }
            }
        }
        var key = match[2];
        if (options.upperCaseTagName) {
            key = key.toLowerCase();
        }
        if (match[1] || match[4] || kSelfClosingElements[key]) {
            // </ or /> or <br> etc.
            while (true) {
                if (currentParent.tagName === match[2]) {
                    stack.pop();
                    currentParent = back_1.default(stack);
                    break;
                }
                else {
                    var tagName = currentParent.tagName;
                    if (options.upperCaseTagName) {
                        tagName = tagName.toLowerCase();
                    }
                    // Trying to close current tag, and move on
                    if (kElementsClosedByClosing[tagName]) {
                        if (kElementsClosedByClosing[tagName][match[2]]) {
                            stack.pop();
                            currentParent = back_1.default(stack);
                            continue;
                        }
                    }
                    // Use aggressive strategy to handle unmatching markups.
                    break;
                }
            }
        }
    };
    while (match = kMarkupPattern.exec(data)) {
        _loop_1();
    }
    var valid = !!(stack.length === 1);
    if (!options.noFix) {
        var response = root;
        response.valid = valid;
        var _loop_2 = function () {
            // Handle each error elements.
            var last = stack.pop();
            var oneBefore = back_1.default(stack);
            if (last.parentNode && last.parentNode.parentNode) {
                if (last.parentNode === oneBefore && last.tagName === oneBefore.tagName) {
                    // Pair error case <h3> <h3> handle : Fixes to <h3> </h3>
                    oneBefore.removeChild(last);
                    last.childNodes.forEach(function (child) {
                        oneBefore.parentNode.appendChild(child);
                    });
                    stack.pop();
                }
                else {
                    // Single error  <div> <h3> </div> handle: Just removes <h3>
                    oneBefore.removeChild(last);
                    last.childNodes.forEach(function (child) {
                        oneBefore.appendChild(child);
                    });
                }
            }
            else {
                // If it's final element just skip.
            }
        };
        while (stack.length > 1) {
            _loop_2();
        }
        response.childNodes.forEach(function (node) {
            if (node instanceof html_1.default) {
                node.parentNode = null;
            }
        });
        return response;
    }
    else {
        var response = new text_1.default(data);
        response.valid = valid;
        return response;
    }
}
exports.parse = parse;
