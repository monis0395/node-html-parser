var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("back", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function arr_back(arr) {
        return arr[arr.length - 1];
    }
    exports.default = arr_back;
});
define("nodes/type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NodeType;
    (function (NodeType) {
        NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
        NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
        NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    })(NodeType || (NodeType = {}));
    exports.default = NodeType;
});
define("nodes/node", ["require", "exports", "nodes/type", "back"], function (require, exports, type_1, back_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    type_1 = __importDefault(type_1);
    back_1 = __importDefault(back_1);
    /**
     * Node Class as base class for TextNode and HTMLElement.
     */
    var Node = /** @class */ (function () {
        function Node(ownerDocument) {
            this.childNodes = [];
            this.children = [];
            this.parentNode = null;
            this.nextSibling = null;
            this.previousSibling = null;
            this.nextElementSibling = null;
            this.previousElementSibling = null;
            this._ownerDocument = ownerDocument || null;
        }
        Object.defineProperty(Node.prototype, "ownerDocument", {
            get: function () {
                return this._ownerDocument;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "firstChild", {
            /**
             * Get first child node
             * @return {Node} first child node
             */
            get: function () {
                return this.childNodes[0] || null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "firstElementChild", {
            /**
             * Get first child element
             * @return {Node} first child element
             */
            get: function () {
                return this.children[0] || null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "lastChild", {
            /**
             * Get last child node
             * @return {Node} last child node
             */
            get: function () {
                return back_1.default(this.childNodes) || null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "lastElementChild", {
            /**
             * Get last child element
             * @return {Node} last child element
             */
            get: function () {
                return back_1.default(this.children) || null;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Remove Child element from childNodes array
         * @param {HTMLElement} child     node to remove
         */
        Node.prototype.removeChild = function (child) {
            var childIndex = this.childNodes.indexOf(child);
            if (childIndex === -1) {
                throw new Error('removeChild: node not found');
            }
            child.parentNode = null;
            var previousSibling = child.previousSibling || null;
            var nextSibling = child.nextSibling || null;
            if (previousSibling) {
                previousSibling.nextSibling = nextSibling;
            }
            if (nextSibling) {
                nextSibling.previousSibling = previousSibling;
            }
            if (child.nodeType === type_1.default.ELEMENT_NODE) {
                var previousElementSibling = child.previousElementSibling || null;
                var nextElementSibling = child.nextElementSibling || null;
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
        };
        /**
         * Append a child node to childNodes
         * @param  {Node} node node to append
         * @return {Node}      node appended
         */
        Node.prototype.appendChild = function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            var lastNode = this.lastChild;
            if (lastNode) {
                lastNode.nextSibling = node;
            }
            node.previousSibling = lastNode;
            node.nextSibling = null;
            var lastElement = this.lastElementChild;
            node.previousElementSibling = lastElement;
            node.nextElementSibling = null;
            if (node.nodeType === type_1.default.ELEMENT_NODE) {
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
            node._ownerDocument = this.ownerDocument;
            return node;
        };
        /**
         * Exchanges given child with new child
         * @param {HTMLElement} oldNode     node to exchange
         * @param {HTMLElement} newNode     new node
         */
        Node.prototype.exchangeChild = function (oldNode, newNode) {
            var childIndex = this.childNodes.indexOf(oldNode);
            if (childIndex === -1) {
                console.warn('replaceChild: node not found');
            }
            this.childNodes[childIndex] = newNode;
            var previousSibling = oldNode.previousSibling || null;
            var nextSibling = oldNode.nextSibling || null;
            newNode.previousSibling = previousSibling;
            newNode.nextSibling = nextSibling;
            if (previousSibling) {
                previousSibling.nextSibling = newNode;
            }
            if (nextSibling) {
                nextSibling.previousSibling = newNode;
            }
            var previousElementSibling = oldNode.previousElementSibling || null;
            var nextElementSibling = oldNode.nextElementSibling || null;
            newNode.previousElementSibling = previousElementSibling;
            newNode.nextElementSibling = nextElementSibling;
            if (newNode.nodeType === type_1.default.ELEMENT_NODE) {
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
                var index = this.children.indexOf(oldNode);
                if (index !== -1) {
                    this.children[index] = newNode;
                }
            }
            newNode.parentNode = oldNode.parentNode;
            newNode._ownerDocument = this.ownerDocument;
        };
        /**
         * Exchanges given child with new child
         * @param {HTMLElement} oldNode     node to exchange
         * @param {HTMLElement} newNode     new node
         */
        Node.prototype.replaceChild = function (oldNode, newNode) {
            this.exchangeChild(oldNode, newNode);
            return oldNode;
        };
        return Node;
    }());
    exports.default = Node;
    for (var nodeType in type_1.default) {
        Node[nodeType] = Node.prototype[nodeType] = type_1.default[nodeType];
    }
});
define("nodes/comment", ["require", "exports", "nodes/node", "nodes/type"], function (require, exports, node_1, type_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    node_1 = __importDefault(node_1);
    type_2 = __importDefault(type_2);
    var CommentNode = /** @class */ (function (_super) {
        __extends(CommentNode, _super);
        function CommentNode(value, ownerDocument) {
            var _this = _super.call(this, ownerDocument) || this;
            /**
             * Node Type declaration.
             * @type {Number}
             */
            _this.nodeType = type_2.default.COMMENT_NODE;
            _this.rawText = value;
            return _this;
        }
        Object.defineProperty(CommentNode.prototype, "text", {
            /**
             * Get unescaped text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return this.rawText;
            },
            enumerable: false,
            configurable: true
        });
        CommentNode.prototype.toString = function () {
            return "<!--" + this.rawText + "-->";
        };
        return CommentNode;
    }(node_1.default));
    exports.default = CommentNode;
});
define("nodes/text", ["require", "exports", "nodes/type", "nodes/node"], function (require, exports, type_3, node_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    type_3 = __importDefault(type_3);
    node_2 = __importDefault(node_2);
    /**
     * TextNode to contain a text element in DOM tree.
     * @param {string} value [description]
     */
    var TextNode = /** @class */ (function (_super) {
        __extends(TextNode, _super);
        function TextNode(value, ownerDocument) {
            var _this = _super.call(this, ownerDocument) || this;
            /**
             * Node Type declaration.
             * @type {Number}
             */
            _this.nodeType = type_3.default.TEXT_NODE;
            _this.rawText = value;
            return _this;
        }
        Object.defineProperty(TextNode.prototype, "text", {
            /**
             * Get unescaped text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return this.rawText;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextNode.prototype, "isWhitespace", {
            /**
             * Detect if the node contains only white space.
             * @return {bool}
             */
            get: function () {
                return /^(\s|&nbsp;)*$/.test(this.rawText);
            },
            enumerable: false,
            configurable: true
        });
        TextNode.prototype.toString = function () {
            return this.text;
        };
        return TextNode;
    }(node_2.default));
    exports.default = TextNode;
});
define("nodes/style", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * TextNode to contain a text element in DOM tree.
     * @param {string} value [description]
     */
    var Style = /** @class */ (function () {
        function Style(node) {
            this.node = node;
        }
        Style.prototype.getStyle = function (styleName) {
            var attr = this.node.getAttribute('style');
            if (!attr)
                return undefined;
            var styles = attr.split(';');
            for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                var style = styles_1[_i];
                var _a = style.split(':'), name = _a[0], value = _a[1];
                if (name === styleName)
                    return value.trim();
            }
            return undefined;
        };
        Style.prototype.setStyle = function (styleName, styleValue) {
            var value = this.node.getAttribute('style') || '';
            var index = 0;
            do {
                var next = value.indexOf(';', index) + 1;
                var length = next - index - 1;
                var style = (length > 0 ? value.substr(index, length) : value.substr(index));
                if (style.substr(0, style.indexOf(':')).trim() === styleName) {
                    value = value.substr(0, index).trim() + (next ? ' ' + value.substr(next).trim() : '');
                    break;
                }
                index = next;
            } while (index);
            value += ' ' + styleName + ': ' + styleValue + ';';
            this.node.setAttribute('style', value.trim());
        };
        return Style;
    }());
    exports.default = Style;
    // When a style is set in JS, map it to the corresponding CSS attribute
    var styleMap = {
        'alignmentBaseline': 'alignment-baseline',
        'background': 'background',
        'backgroundAttachment': 'background-attachment',
        'backgroundClip': 'background-clip',
        'backgroundColor': 'background-color',
        'backgroundImage': 'background-image',
        'backgroundOrigin': 'background-origin',
        'backgroundPosition': 'background-position',
        'backgroundPositionX': 'background-position-x',
        'backgroundPositionY': 'background-position-y',
        'backgroundRepeat': 'background-repeat',
        'backgroundRepeatX': 'background-repeat-x',
        'backgroundRepeatY': 'background-repeat-y',
        'backgroundSize': 'background-size',
        'baselineShift': 'baseline-shift',
        'border': 'border',
        'borderBottom': 'border-bottom',
        'borderBottomColor': 'border-bottom-color',
        'borderBottomLeftRadius': 'border-bottom-left-radius',
        'borderBottomRightRadius': 'border-bottom-right-radius',
        'borderBottomStyle': 'border-bottom-style',
        'borderBottomWidth': 'border-bottom-width',
        'borderCollapse': 'border-collapse',
        'borderColor': 'border-color',
        'borderImage': 'border-image',
        'borderImageOutset': 'border-image-outset',
        'borderImageRepeat': 'border-image-repeat',
        'borderImageSlice': 'border-image-slice',
        'borderImageSource': 'border-image-source',
        'borderImageWidth': 'border-image-width',
        'borderLeft': 'border-left',
        'borderLeftColor': 'border-left-color',
        'borderLeftStyle': 'border-left-style',
        'borderLeftWidth': 'border-left-width',
        'borderRadius': 'border-radius',
        'borderRight': 'border-right',
        'borderRightColor': 'border-right-color',
        'borderRightStyle': 'border-right-style',
        'borderRightWidth': 'border-right-width',
        'borderSpacing': 'border-spacing',
        'borderStyle': 'border-style',
        'borderTop': 'border-top',
        'borderTopColor': 'border-top-color',
        'borderTopLeftRadius': 'border-top-left-radius',
        'borderTopRightRadius': 'border-top-right-radius',
        'borderTopStyle': 'border-top-style',
        'borderTopWidth': 'border-top-width',
        'borderWidth': 'border-width',
        'bottom': 'bottom',
        'boxShadow': 'box-shadow',
        'boxSizing': 'box-sizing',
        'captionSide': 'caption-side',
        'clear': 'clear',
        'clip': 'clip',
        'clipPath': 'clip-path',
        'clipRule': 'clip-rule',
        'color': 'color',
        'colorInterpolation': 'color-interpolation',
        'colorInterpolationFilters': 'color-interpolation-filters',
        'colorProfile': 'color-profile',
        'colorRendering': 'color-rendering',
        'content': 'content',
        'counterIncrement': 'counter-increment',
        'counterReset': 'counter-reset',
        'cursor': 'cursor',
        'direction': 'direction',
        'display': 'display',
        'dominantBaseline': 'dominant-baseline',
        'emptyCells': 'empty-cells',
        'enableBackground': 'enable-background',
        'fill': 'fill',
        'fillOpacity': 'fill-opacity',
        'fillRule': 'fill-rule',
        'filter': 'filter',
        'cssFloat': 'float',
        'floodColor': 'flood-color',
        'floodOpacity': 'flood-opacity',
        'font': 'font',
        'fontFamily': 'font-family',
        'fontSize': 'font-size',
        'fontStretch': 'font-stretch',
        'fontStyle': 'font-style',
        'fontVariant': 'font-variant',
        'fontWeight': 'font-weight',
        'glyphOrientationHorizontal': 'glyph-orientation-horizontal',
        'glyphOrientationVertical': 'glyph-orientation-vertical',
        'height': 'height',
        'imageRendering': 'image-rendering',
        'kerning': 'kerning',
        'left': 'left',
        'letterSpacing': 'letter-spacing',
        'lightingColor': 'lighting-color',
        'lineHeight': 'line-height',
        'listStyle': 'list-style',
        'listStyleImage': 'list-style-image',
        'listStylePosition': 'list-style-position',
        'listStyleType': 'list-style-type',
        'margin': 'margin',
        'marginBottom': 'margin-bottom',
        'marginLeft': 'margin-left',
        'marginRight': 'margin-right',
        'marginTop': 'margin-top',
        'marker': 'marker',
        'markerEnd': 'marker-end',
        'markerMid': 'marker-mid',
        'markerStart': 'marker-start',
        'mask': 'mask',
        'maxHeight': 'max-height',
        'maxWidth': 'max-width',
        'minHeight': 'min-height',
        'minWidth': 'min-width',
        'opacity': 'opacity',
        'orphans': 'orphans',
        'outline': 'outline',
        'outlineColor': 'outline-color',
        'outlineOffset': 'outline-offset',
        'outlineStyle': 'outline-style',
        'outlineWidth': 'outline-width',
        'overflow': 'overflow',
        'overflowX': 'overflow-x',
        'overflowY': 'overflow-y',
        'padding': 'padding',
        'paddingBottom': 'padding-bottom',
        'paddingLeft': 'padding-left',
        'paddingRight': 'padding-right',
        'paddingTop': 'padding-top',
        'page': 'page',
        'pageBreakAfter': 'page-break-after',
        'pageBreakBefore': 'page-break-before',
        'pageBreakInside': 'page-break-inside',
        'pointerEvents': 'pointer-events',
        'position': 'position',
        'quotes': 'quotes',
        'resize': 'resize',
        'right': 'right',
        'shapeRendering': 'shape-rendering',
        'size': 'size',
        'speak': 'speak',
        'src': 'src',
        'stopColor': 'stop-color',
        'stopOpacity': 'stop-opacity',
        'stroke': 'stroke',
        'strokeDasharray': 'stroke-dasharray',
        'strokeDashoffset': 'stroke-dashoffset',
        'strokeLinecap': 'stroke-linecap',
        'strokeLinejoin': 'stroke-linejoin',
        'strokeMiterlimit': 'stroke-miterlimit',
        'strokeOpacity': 'stroke-opacity',
        'strokeWidth': 'stroke-width',
        'tableLayout': 'table-layout',
        'textAlign': 'text-align',
        'textAnchor': 'text-anchor',
        'textDecoration': 'text-decoration',
        'textIndent': 'text-indent',
        'textLineThrough': 'text-line-through',
        'textLineThroughColor': 'text-line-through-color',
        'textLineThroughMode': 'text-line-through-mode',
        'textLineThroughStyle': 'text-line-through-style',
        'textLineThroughWidth': 'text-line-through-width',
        'textOverflow': 'text-overflow',
        'textOverline': 'text-overline',
        'textOverlineColor': 'text-overline-color',
        'textOverlineMode': 'text-overline-mode',
        'textOverlineStyle': 'text-overline-style',
        'textOverlineWidth': 'text-overline-width',
        'textRendering': 'text-rendering',
        'textShadow': 'text-shadow',
        'textTransform': 'text-transform',
        'textUnderline': 'text-underline',
        'textUnderlineColor': 'text-underline-color',
        'textUnderlineMode': 'text-underline-mode',
        'textUnderlineStyle': 'text-underline-style',
        'textUnderlineWidth': 'text-underline-width',
        'top': 'top',
        'unicodeBidi': 'unicode-bidi',
        'unicodeRange': 'unicode-range',
        'vectorEffect': 'vector-effect',
        'verticalAlign': 'vertical-align',
        'visibility': 'visibility',
        'whiteSpace': 'white-space',
        'widows': 'widows',
        'width': 'width',
        'wordBreak': 'word-break',
        'wordSpacing': 'word-spacing',
        'wordWrap': 'word-wrap',
        'writingMode': 'writing-mode',
        'zIndex': 'z-index',
        'zoom': 'zoom'
    };
    var _loop_1 = function (jsName) {
        var cssName = styleMap[jsName];
        Object.defineProperty(Style, jsName, {
            get: function () {
                var style = this;
                return style.getStyle(cssName);
            },
            set: function (value) {
                var style = this;
                style.setStyle(cssName, value);
            },
            enumerable: false,
            configurable: true
        });
    };
    // For each item in styleMap, define a getter and setter on the style property.
    for (var jsName in styleMap) {
        _loop_1(jsName);
    }
});
define("matcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Cache to store generated match functions
     * @type {Object}
     */
    var pMatchFunctionCache = {};
    /**
     * Function cache
     */
    var functionCache = {
        f145: function (el, tagName, classes) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            if (el.id !== tagName.substr(1)) {
                return false;
            }
            for (var cls = classes, i = 0; i < cls.length; i++) {
                if (el.classNames.indexOf(cls[i]) === -1) {
                    return false;
                }
            }
            return true;
        },
        f45: function (el, tagName, classes) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            for (var cls = classes, i = 0; i < cls.length; i++) {
                if (el.classNames.indexOf(cls[i]) === -1) {
                    return false;
                }
            }
            return true;
        },
        f15: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            if (el.id !== tagName.substr(1)) {
                return false;
            }
            return true;
        },
        f1: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            if (el.id !== tagName.substr(1)) {
                return false;
            }
        },
        f5: function () {
            'use strict';
            return true;
        },
        f55: function (el, tagName, classes, attr_key) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = attr_key || '';
            var attrs = el.attributes;
            return attrs.hasOwnProperty(attr_key);
        },
        f245: function (el, tagName, classes, attr_key, value) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = attr_key || '';
            value = value || '';
            var attrs = el.attributes;
            return Object.keys(attrs).some(function (key) {
                var val = attrs[key];
                return key === attr_key && val === value;
            });
            // for (let cls = classes, i = 0; i < cls.length; i++) {if (el.classNames.indexOf(cls[i]) === -1){ return false;}}
            // return true;
        },
        f25: function (el, tagName, classes, attr_key, value) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = attr_key || '';
            value = value || '';
            var attrs = el.attributes;
            return Object.keys(attrs).some(function (key) {
                var val = attrs[key];
                return key === attr_key && val === value;
            });
            // return true;
        },
        f2: function (el, tagName, classes, attr_key, value) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = attr_key || '';
            value = value || '';
            var attrs = el.attributes;
            return Object.keys(attrs).some(function (key) {
                var val = attrs[key];
                return key === attr_key && val === value;
            });
        },
        f345: function (el, tagName, classes) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            if (el.tag !== tagName) {
                return false;
            }
            for (var cls = classes, i = 0; i < cls.length; i++) {
                if (el.classNames.indexOf(cls[i]) === -1) {
                    return false;
                }
            }
            return true;
        },
        f35: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            return el.tag === tagName;
        },
        f3: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            if (el.tag !== tagName) {
                return false;
            }
        }
    };
    /**
     * Matcher class to make CSS match
     *
     * @class Matcher
     */
    var Matcher = /** @class */ (function () {
        /**
         * Creates an instance of Matcher.
         * @param {string} selector
         *
         * @memberof Matcher
         */
        function Matcher(selector) {
            this.nextMatch = 0;
            functionCache.f5 = functionCache.f5;
            this.matchers = selector.split(' ').map(function (matcher) {
                if (pMatchFunctionCache[matcher])
                    return pMatchFunctionCache[matcher];
                var parts = matcher.split('.');
                var tagName = parts[0];
                var classes = parts.slice(1).sort();
                // let source = '"use strict";';
                var function_name = 'f';
                var attr_key = '';
                var value = '';
                if (tagName && tagName !== '*') {
                    var reg = void 0;
                    if (tagName.startsWith('#')) {
                        // source += 'if (el.id != ' + JSON.stringify(tagName.substr(1)) + ') return false;';// 1
                        function_name += '1';
                    }
                    else {
                        reg = /^\[\s*(\S+)\s*(=|!=)\s*((((["'])([^\6]*)\6))|(\S*?))\]\s*/.exec(tagName);
                        if (reg) {
                            attr_key = reg[1];
                            var method = reg[2];
                            if (method !== '=' && method !== '!=') {
                                throw new Error('Selector not supported, Expect [key${op}value].op must be =,!=');
                            }
                            if (method === '=') {
                                method = '==';
                            }
                            value = reg[7] || reg[8];
                            // source += `let attrs = el.attributes;for (let key in attrs){const val = attrs[key]; if (key == "${attr_key}" && val == "${value}"){return true;}} return false;`;// 2
                            function_name += '2';
                        }
                        else if (reg = /^\[(.*?)\]/.exec(tagName)) {
                            attr_key = reg[1];
                            function_name += '5';
                        }
                        else {
                            // source += 'if (el.tag != ' + JSON.stringify(tagName) + ') return false;';// 3
                            function_name += '3';
                        }
                    }
                }
                if (classes.length > 0) {
                    // source += 'for (let cls = ' + JSON.stringify(classes) + ', i = 0; i < cls.length; i++) if (el.classNames.indexOf(cls[i]) === -1) return false;';// 4
                    function_name += '4';
                }
                // source += 'return true;';// 5
                function_name += '5';
                var obj = {
                    func: functionCache[function_name],
                    tagName: tagName || '',
                    classes: classes || '',
                    attr_key: attr_key || '',
                    value: value || ''
                };
                // source = source || '';
                return pMatchFunctionCache[matcher] = obj;
            });
        }
        /**
         * Trying to advance match pointer
         * @param  {HTMLElement} el element to make the match
         * @return {bool}           true when pointer advanced.
         */
        Matcher.prototype.advance = function (el) {
            if (this.nextMatch < this.matchers.length &&
                this.matchers[this.nextMatch].func(el, this.matchers[this.nextMatch].tagName, this.matchers[this.nextMatch].classes, this.matchers[this.nextMatch].attr_key, this.matchers[this.nextMatch].value)) {
                this.nextMatch++;
                return true;
            }
            return false;
        };
        /**
         * Rewind the match pointer
         */
        Matcher.prototype.rewind = function () {
            this.nextMatch--;
        };
        Object.defineProperty(Matcher.prototype, "matched", {
            /**
             * Trying to determine if match made.
             * @return {bool} true when the match is made
             */
            get: function () {
                return this.nextMatch === this.matchers.length;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Rest match pointer.
         * @return {[type]} [description]
         */
        Matcher.prototype.reset = function () {
            this.nextMatch = 0;
        };
        /**
         * flush cache to free memory
         */
        Matcher.prototype.flushCache = function () {
            pMatchFunctionCache = {};
        };
        return Matcher;
    }());
    exports.default = Matcher;
});
define("nodes/html", ["require", "exports", "he", "nodes/node", "nodes/type", "nodes/text", "nodes/style", "matcher", "back", "nodes/comment", "url"], function (require, exports, he_1, node_3, type_4, text_1, style_1, matcher_1, back_2, comment_1, url_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = void 0;
    node_3 = __importDefault(node_3);
    type_4 = __importDefault(type_4);
    text_1 = __importDefault(text_1);
    style_1 = __importDefault(style_1);
    matcher_1 = __importDefault(matcher_1);
    back_2 = __importDefault(back_2);
    comment_1 = __importDefault(comment_1);
    var kBlockElements = {
        div: true,
        p: true,
        // ul: true,
        // ol: true,
        li: true,
        // table: true,
        // tr: true,
        td: true,
        section: true,
        br: true
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
    var HTMLElement = /** @class */ (function (_super) {
        __extends(HTMLElement, _super);
        /**
         * Creates an instance of HTMLElement.
         * @param tag			Name of the Tag
         * @param keyAttrs		id and class attribute
         * @param [rawAttrs]	attributes in string
         * @param options		Options passed while parsing
         * @param ownerDocument	owner of the document
         *
         * @memberof HTMLElement
         */
        function HTMLElement(tag, keyAttrs, rawAttrs, options, ownerDocument) {
            var _this = _super.call(this, ownerDocument) || this;
            _this._baseURI = '';
            _this.rawAttrs = '';
            _this.classNames = [];
            _this.parentNode = null;
            /**
             * Node Type declaration.
             */
            _this.nodeType = type_4.default.ELEMENT_NODE;
            _this.tag = tag || '';
            _this.rawAttrs = rawAttrs || '';
            _this.options = options || {};
            _this.childNodes = [];
            if (keyAttrs.id) {
                _this._id = keyAttrs.id;
            }
            if (keyAttrs.class) {
                _this.classNames = keyAttrs.class.split(/\s+/);
            }
            _this.style = new style_1.default(_this);
            return _this;
        }
        Object.defineProperty(HTMLElement.prototype, "className", {
            get: function () {
                var names = this.classNames;
                if (names) {
                    return names.join(' ');
                }
                return '';
            },
            set: function (names) {
                if (names) {
                    this.classNames = names.split(' ');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "rawText", {
            /**
             * Get escpaed (as-it) text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return this.childNodes.reduce(function (pre, cur) {
                    return pre += cur.rawText;
                }, '');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "text", {
            /**
             * Get unescaped text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return he_1.decode(this.rawText);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "textContent", {
            get: function () {
                return this.text;
            },
            set: function (text) {
                this.set_content(text);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "id", {
            get: function () {
                return this._id || this.getAttribute('id') || '';
            },
            set: function (str) {
                this._id = str;
                this.setAttribute('id', str);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "href", {
            get: function () {
                return this.getAttribute('href') || '';
            },
            set: function (str) {
                this.setAttribute('href', str);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "src", {
            get: function () {
                return this.getAttribute('src') || '';
            },
            set: function (str) {
                this.setAttribute('src', str);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "nodeName", {
            get: function () {
                return this.tag;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "localName", {
            get: function () {
                return this.tag.toLowerCase();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "tagName", {
            /**
             * Get tag value as per options.
             * @return {string} text content
             */
            get: function () {
                if (this.options.upperCaseTagName) {
                    return this.tag.toUpperCase();
                }
                return this.tag;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "documentURI", {
            get: function () {
                return this.options.url;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "baseURI", {
            /**
             * Document Methods
             */
            get: function () {
                if (this._baseURI || this._baseURI === '') {
                    return this._baseURI;
                }
                this._baseURI = this.documentURI;
                var baseElements = this.getElementsByTagName('base');
                var href = baseElements[0] && baseElements[0].getAttribute('href');
                if (href) {
                    try {
                        this._baseURI = (new url_1.URL(href, this._baseURI)).href;
                    }
                    catch (ex) { /* Just fall back to documentURI */
                    }
                }
                return this._baseURI;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Creates a new Text node.
         * @return {string} structured text
         */
        HTMLElement.prototype.createElement = function (tagName) {
            return new HTMLElement(tagName, {}, '', this.options, this.ownerDocument);
        };
        /**
         * Creates a new Text node.
         * @return {string} structured text
         */
        HTMLElement.prototype.createTextNode = function (data) {
            return new text_1.default(data, this.ownerDocument);
        };
        Object.defineProperty(HTMLElement.prototype, "title", {
            get: function () {
                var node = this.getElementsByTagName('title')[0];
                return (node && node.textContent) || '';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "documentElement", {
            get: function () {
                return this;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "head", {
            get: function () {
                return this.getElementsByTagName('head')[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "body", {
            get: function () {
                return this.getElementsByTagName('body')[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "structuredText", {
            /**
             * Get structured Text (with '\n' etc.)
             * @return {string} structured text
             */
            get: function () {
                var currentBlock = [];
                var blocks = [currentBlock];
                function dfs(node) {
                    if (node.nodeType === type_4.default.ELEMENT_NODE) {
                        if (kBlockElements[node.tag]) {
                            if (currentBlock.length > 0) {
                                blocks.push(currentBlock = []);
                            }
                            node.childNodes.forEach(dfs);
                            if (currentBlock.length > 0) {
                                blocks.push(currentBlock = []);
                            }
                        }
                        else {
                            node.childNodes.forEach(dfs);
                        }
                    }
                    else if (node.nodeType === type_4.default.TEXT_NODE) {
                        if (node.isWhitespace) {
                            // Whitespace node, postponed output
                            currentBlock.prependWhitespace = true;
                        }
                        else {
                            var text = node.text;
                            if (currentBlock.prependWhitespace) {
                                text = ' ' + text;
                                currentBlock.prependWhitespace = false;
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
                    .join('\n').replace(/\s+$/, ''); // trimRight;
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.toString = function () {
            var tag = this.tag;
            if (tag) {
                var is_void = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag);
                var attrs = this.rawAttrs ? ' ' + this.rawAttrs : '';
                if (is_void) {
                    return "<" + tag + attrs + ">";
                }
                else {
                    return "<" + tag + attrs + ">" + this.innerHTML + "</" + tag + ">";
                }
            }
            else {
                return this.innerHTML;
            }
        };
        Object.defineProperty(HTMLElement.prototype, "innerHTML", {
            get: function () {
                return this.childNodes.map(function (child) {
                    return child.toString();
                }).join('');
            },
            set: function (html) {
                this.set_content(html, this.options);
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.set_content = function (content, options) {
            if (options === void 0) { options = this.options; }
            if (content instanceof node_3.default) {
                content = [content];
            }
            else if (typeof content == 'string') {
                var r = parse(content, options);
                content = r.childNodes.length ? r.childNodes : [new text_1.default(content, this.ownerDocument)];
                this.children = r.children;
            }
            this.childNodes = content;
            for (var i = this.childNodes.length; --i >= 0;) {
                this.childNodes[i].parentNode = this;
            }
        };
        Object.defineProperty(HTMLElement.prototype, "outerHTML", {
            get: function () {
                return this.toString();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Trim element from right (in block) after seeing pattern in a TextNode.
         * @param  {RegExp} pattern pattern to find
         * @return {HTMLElement}    reference to current node
         */
        HTMLElement.prototype.trimRight = function (pattern) {
            for (var i = 0; i < this.childNodes.length; i++) {
                var childNode = this.childNodes[i];
                if (childNode.nodeType === type_4.default.ELEMENT_NODE) {
                    childNode.trimRight(pattern);
                }
                else {
                    var index = childNode.rawText.search(pattern);
                    if (index > -1) {
                        childNode.rawText = childNode.rawText.substr(0, index);
                        // trim all following nodes.
                        this.childNodes.length = i + 1;
                    }
                }
            }
            return this;
        };
        Object.defineProperty(HTMLElement.prototype, "structure", {
            /**
             * Get DOM structure
             * @return {string} strucutre
             */
            get: function () {
                var res = [];
                var indention = 0;
                function write(str) {
                    res.push('  '.repeat(indention) + str);
                }
                function dfs(node) {
                    var idStr = node.id ? ('#' + node.id) : '';
                    var classStr = node.classNames.length ? ('.' + node.classNames.join('.')) : '';
                    write(node.tag + idStr + classStr);
                    indention++;
                    node.childNodes.forEach(function (childNode) {
                        if (childNode.nodeType === type_4.default.ELEMENT_NODE) {
                            dfs(childNode);
                        }
                        else if (childNode.nodeType === type_4.default.TEXT_NODE) {
                            if (!childNode.isWhitespace)
                                write('#text');
                        }
                    });
                    indention--;
                }
                dfs(this);
                return res.join('\n');
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Remove whitespaces in this sub tree.
         * @return {HTMLElement} pointer to this
         */
        HTMLElement.prototype.removeWhitespace = function () {
            var _this = this;
            var o = 0;
            this.childNodes.forEach(function (node) {
                if (node.nodeType === type_4.default.TEXT_NODE) {
                    if (node.isWhitespace) {
                        return;
                    }
                    node.rawText = node.rawText.trim();
                }
                else if (node.nodeType === type_4.default.ELEMENT_NODE) {
                    node.removeWhitespace();
                }
                _this.childNodes[o++] = node;
            });
            for (; o < this.childNodes.length; o++) {
                var node = this.childNodes[o];
                if (node) {
                    this.removeChild(node);
                }
            }
            return this;
        };
        /**
         * HTMLCollection of elements with the given tag name.
         * @param  {tagName} tagName is a string representing the name of the elements.
         * @return {HTMLElement[]} matching elements
         */
        HTMLElement.prototype.getElementsByTagName = function (tagName) {
            // todo: think if people will pass tagName in lower or upper case?
            return this.querySelectorAll(tagName);
        };
        /**
         * Get Elements whose class property matches the specified string.
         * @param  {string} className is a string representing the class name(s) to match
         * @return {HTMLElement[]} all child elements which have all of the given class name(s)
         */
        HTMLElement.prototype.getElementsByClassName = function (className) {
            return this.querySelectorAll("." + className);
        };
        /**
         * returns an Element object representing the element whose id property matches the specified string.
         * @param  {string} id of the element to locate
         * @return {(HTMLElement | null)}  An Element matching the specified ID, or null if no matching element was found
         */
        HTMLElement.prototype.getElementById = function (id) {
            return this.querySelector("#" + id);
        };
        /**
         * Query CSS selector to find matching nodes.
         * @param  {string}         selector Simplified CSS selector
         * @param  {Matcher}        selector A Matcher instance
         * @return {HTMLElement[]}  matching elements
         */
        HTMLElement.prototype.querySelectorAll = function (selector) {
            var _this = this;
            var matcher;
            if (selector instanceof matcher_1.default) {
                matcher = selector;
                matcher.reset();
            }
            else {
                if (selector.includes(',')) {
                    var selectors = selector.split(',');
                    return Array.from(selectors.reduce(function (pre, cur) {
                        var result = _this.querySelectorAll(cur.trim());
                        return result.reduce(function (p, c) {
                            return p.add(c);
                        }, pre);
                    }, new Set()));
                }
                matcher = new matcher_1.default(selector);
            }
            var stack = [];
            return this.childNodes.reduce(function (res, cur) {
                stack.push([cur, 0, false]);
                while (stack.length) {
                    var state = back_2.default(stack); // get last element
                    var el = state[0];
                    if (state[1] === 0) {
                        // Seen for first time.
                        if (el.nodeType !== type_4.default.ELEMENT_NODE) {
                            stack.pop();
                            continue;
                        }
                        var html_el = el;
                        state[2] = matcher.advance(html_el);
                        if (state[2]) {
                            if (matcher.matched) {
                                res.push(html_el);
                                res.push.apply(res, (html_el.querySelectorAll(selector)));
                                // no need to go further.
                                matcher.rewind();
                                stack.pop();
                                continue;
                            }
                        }
                    }
                    if (state[1] < el.childNodes.length) {
                        stack.push([el.childNodes[state[1]++], 0, false]);
                    }
                    else {
                        if (state[2]) {
                            matcher.rewind();
                        }
                        stack.pop();
                    }
                }
                return res;
            }, []);
        };
        /**
         * Query CSS Selector to find matching node.
         * @param  {string}         selector Simplified CSS selector
         * @param  {Matcher}        selector A Matcher instance
         * @return {HTMLElement}    matching node
         */
        HTMLElement.prototype.querySelector = function (selector) {
            var matcher;
            if (selector instanceof matcher_1.default) {
                matcher = selector;
                matcher.reset();
            }
            else {
                matcher = new matcher_1.default(selector);
            }
            var stack = [];
            for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
                var node = _a[_i];
                stack.push([node, 0, false]);
                while (stack.length) {
                    var state = back_2.default(stack);
                    var el = state[0];
                    if (state[1] === 0) {
                        // Seen for first time.
                        if (el.nodeType !== type_4.default.ELEMENT_NODE) {
                            stack.pop();
                            continue;
                        }
                        state[2] = matcher.advance(el);
                        if (state[2]) {
                            if (matcher.matched) {
                                return el;
                            }
                        }
                    }
                    if (state[1] < el.childNodes.length) {
                        stack.push([el.childNodes[state[1]++], 0, false]);
                    }
                    else {
                        if (state[2])
                            matcher.rewind();
                        stack.pop();
                    }
                }
            }
            return null;
        };
        Object.defineProperty(HTMLElement.prototype, "attributes", {
            /**
             * Get attributes
             * @return {Object} parsed and unescaped attributes
             */
            get: function () {
                if (this._attrs) {
                    return this._attrs;
                }
                this._attrs = {};
                var attrs = this.rawAttributes;
                for (var key in attrs) {
                    var val = attrs[key] || '';
                    this._attrs[key] = he_1.decode(val);
                }
                return this._attrs;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "rawAttributes", {
            /**
             * Get escaped (as-it) attributes
             * @return {Object} parsed attributes
             */
            get: function () {
                if (this._rawAttrs)
                    return this._rawAttrs;
                var attrs = {};
                if (this.rawAttrs) {
                    var re = /\b([a-z][a-z0-9\-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig;
                    var match = void 0;
                    while (match = re.exec(this.rawAttrs)) {
                        attrs[match[1]] = match[2] || match[3] || match[4] || null;
                    }
                }
                this._rawAttrs = attrs;
                return attrs;
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.removeAttribute = function (key) {
            var attrs = this.rawAttributes;
            delete attrs[key];
            // Update this.attribute
            if (this._attrs) {
                delete this._attrs[key];
            }
            // Update rawString
            this.rawAttrs = Object.keys(attrs).map(function (name) {
                var val = JSON.stringify(attrs[name]);
                if (val === undefined || val === 'null') {
                    return name;
                }
                else {
                    return name + '=' + val;
                }
            }).join(' ');
        };
        HTMLElement.prototype.hasAttribute = function (key) {
            return key in this.attributes;
        };
        /**
         * Get an attribute
         * @return {string} value of the attribute
         */
        HTMLElement.prototype.getAttribute = function (key) {
            return this.attributes[key];
        };
        /**
         * Set an attribute value to the HTMLElement
         * @param {string} key The attribute name
         * @param {string} value The value to set, or null / undefined to remove an attribute
         */
        HTMLElement.prototype.setAttribute = function (key, value) {
            if (arguments.length < 2) {
                throw new Error('Failed to execute \'setAttribute\' on \'Element\'');
            }
            var attrs = this.rawAttributes;
            attrs[key] = String(value);
            if (this._attrs) {
                this._attrs[key] = he_1.decode(attrs[key]);
            }
            // Update rawString
            this.rawAttrs = Object.keys(attrs).map(function (name) {
                var val = JSON.stringify(attrs[name]);
                if (val === undefined || val === 'null') {
                    return name;
                }
                else {
                    return name + '=' + val;
                }
            }).join(' ');
        };
        /**
         * Replace all the attributes of the HTMLElement by the provided attributes
         * @param {Attributes} attributes the new attribute set
         */
        HTMLElement.prototype.setAttributes = function (attributes) {
            // Invalidate current this.attributes
            if (this._attrs) {
                delete this._attrs;
            }
            // Invalidate current this.rawAttributes
            if (this._rawAttrs) {
                delete this._rawAttrs;
            }
            // Update rawString
            this.rawAttrs = Object.keys(attributes).map(function (name) {
                var val = attributes[name];
                if (val === undefined || val === null) {
                    return name;
                }
                else {
                    return name + '=' + JSON.stringify(String(val));
                }
            }).join(' ');
        };
        HTMLElement.prototype.insertAdjacentHTML = function (where, html) {
            var _a, _b;
            var _this = this;
            if (arguments.length < 2) {
                throw new Error('2 arguments required');
            }
            var p = parse(html);
            if (where === 'afterend') {
                p.childNodes.forEach(function (n) {
                    _this.parentNode.appendChild(n);
                });
            }
            else if (where === 'afterbegin') {
                (_a = this.childNodes).unshift.apply(_a, p.childNodes);
            }
            else if (where === 'beforeend') {
                p.childNodes.forEach(function (n) {
                    _this.appendChild(n);
                });
            }
            else if (where === 'beforebegin') {
                (_b = this.parentNode.childNodes).unshift.apply(_b, p.childNodes);
            }
            else {
                throw new Error("The value provided ('" + where + "') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'");
            }
            if (!where || html === undefined || html === null) {
                return;
            }
        };
        return HTMLElement;
    }(node_3.default));
    exports.default = HTMLElement;
    // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
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
        source: true
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
        h6: { h6: true }
    };
    var kElementsClosedByClosing = {
        li: { ul: true, ol: true },
        a: { div: true },
        b: { div: true },
        i: { div: true },
        p: { div: true },
        td: { tr: true, table: true },
        th: { tr: true, table: true }
    };
    var kBlockTextElements = {
        script: true,
        noscript: true,
        style: true,
        pre: true
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
        var root = new HTMLElement(null, {}, '', options);
        var currentParent = root;
        var stack = [root];
        var lastTextPos = -1;
        var match;
        // https://github.com/taoqf/node-html-parser/issues/38
        data = "<" + frameflag + ">" + data + "</" + frameflag + ">";
        var _loop_2 = function () {
            if (lastTextPos > -1) {
                if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
                    // if has content
                    var text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
                    currentParent.appendChild(new text_1.default(text, root));
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
                    currentParent.appendChild(new comment_1.default(text, root));
                }
                return "continue";
            }
            if (options.lowerCaseTagName) {
                match[2] = match[2].toLowerCase();
            }
            if (!match[1]) {
                // not </ tags
                var attrs = {};
                for (var attMatch = void 0; attMatch = kAttributePattern.exec(match[3]);) {
                    attrs[attMatch[2]] = attMatch[4] || attMatch[5] || attMatch[6];
                }
                var tagName = currentParent.tag;
                if (!match[4] && kElementsClosedByOpening[tagName]) {
                    if (kElementsClosedByOpening[tagName][match[2]]) {
                        stack.pop();
                        currentParent = back_2.default(stack);
                    }
                }
                // ignore container tag we add above
                // https://github.com/taoqf/node-html-parser/issues/38
                currentParent = currentParent.appendChild(new HTMLElement(match[2], attrs, match[3], options, root));
                stack.push(currentParent);
                if (kBlockTextElements[match[2]]) {
                    // a little test to find next </script> or </style> ...
                    var closeMarkup_1 = '</' + match[2] + '>';
                    var index = (function () {
                        if (options.lowerCaseTagName) {
                            return data.toLocaleLowerCase().indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
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
                            currentParent.appendChild(new text_1.default(text, root));
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
            if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
                // </ or /> or <br> etc.
                while (true) {
                    if (currentParent.tag === match[2]) {
                        stack.pop();
                        currentParent = back_2.default(stack);
                        break;
                    }
                    else {
                        var tagName = currentParent.tag;
                        // Trying to close current tag, and move on
                        if (kElementsClosedByClosing[tagName]) {
                            if (kElementsClosedByClosing[tagName][match[2]]) {
                                stack.pop();
                                currentParent = back_2.default(stack);
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
            _loop_2();
        }
        var valid = !!(stack.length === 1);
        if (!options.noFix) {
            var response = root;
            response.valid = valid;
            var _loop_3 = function () {
                // Handle each error elements.
                var last = stack.pop();
                var oneBefore = back_2.default(stack);
                if (last.parentNode && last.parentNode.parentNode) {
                    if (last.parentNode === oneBefore && last.tag === oneBefore.tag) {
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
                _loop_3();
            }
            response.childNodes.forEach(function (node) {
                if (node instanceof HTMLElement) {
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
});
define("index", ["require", "exports", "nodes/comment", "nodes/html", "nodes/node", "nodes/text", "nodes/type"], function (require, exports, comment_2, html_1, node_4, text_2, type_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.defineProperty(exports, "CommentNode", { enumerable: true, get: function () { return comment_2.default; } });
    Object.defineProperty(exports, "HTMLElement", { enumerable: true, get: function () { return html_1.default; } });
    Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return html_1.parse; } });
    Object.defineProperty(exports, "default", { enumerable: true, get: function () { return html_1.parse; } });
    Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return node_4.default; } });
    Object.defineProperty(exports, "TextNode", { enumerable: true, get: function () { return text_2.default; } });
    Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return type_5.default; } });
});
