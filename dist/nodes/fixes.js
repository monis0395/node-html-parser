"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixRelativeUris = void 0;
var url_1 = require("url");
var REGEXPS = {
    srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,
};
function fixRelativeUris(document) {
    var baseURI = document.baseURI;
    var documentURI = document.documentURI;
    if (!baseURI) {
        return;
    }
    function toAbsoluteURI(uri) {
        // Leave hash links alone if the base URI matches the document URI:
        if (baseURI === documentURI && uri.startsWith('#')) {
            return uri;
        }
        // Otherwise, resolve against base URI:
        try {
            return new url_1.URL(uri, baseURI).href;
        }
        catch (ex) {
            // Something went wrong, just return the original:
        }
        return uri;
    }
    var links = document.getElementsByTagName('a');
    links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href) {
            // Replace links with javascript: URIs with text content, since
            // they won't work after scripts have been removed from the page.
            if (href.startsWith('javascript:')) {
                var text = document.createTextNode(link.textContent);
                link.parentNode.replaceChild(text, link);
            }
            else {
                link.setAttribute('href', toAbsoluteURI(href));
            }
        }
    });
    var imgs = document.querySelectorAll(['img', 'picture', 'figure', 'video', 'audio', 'source'].join(','));
    imgs.forEach(function (media) {
        var src = media.getAttribute('src');
        var srcset = media.getAttribute('srcset');
        if (src) {
            media.setAttribute('src', toAbsoluteURI(src));
        }
        if (srcset) {
            var newSrcset = srcset.replace(REGEXPS.srcsetUrl, function (_, p1, p2, p3) {
                return toAbsoluteURI(p1) + (p2 || '') + p3;
            });
            media.setAttribute('srcset', newSrcset);
        }
    });
}
exports.fixRelativeUris = fixRelativeUris;
