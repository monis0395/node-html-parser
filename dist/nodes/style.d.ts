import HTMLElement from './html';
/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
export default class Style {
    private node;
    constructor(node: HTMLElement);
    getStyle(styleName: string): string;
    setStyle(styleName: string, styleValue: string): void;
}
