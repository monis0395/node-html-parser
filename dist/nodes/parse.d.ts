import TextNode from './text';
import HTMLElement from './html';
export interface Options {
    lowerCaseTagName?: boolean;
    upperCaseTagName?: boolean;
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
