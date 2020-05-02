import { URL } from 'url';
import Document from './document';

const REGEXPS = {
	srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,
};

export function fixRelativeUris(document: Document) {
	const baseURI = document.baseURI;
	const documentURI = document.documentURI;
	if (!baseURI) {
		return;
	}

	function toAbsoluteURI(uri: string) {
		// Leave hash links alone if the base URI matches the document URI:
		if (baseURI === documentURI && uri.startsWith('#')) {
			return uri;
		}
		// Otherwise, resolve against base URI:
		try {
			return new URL(uri, baseURI).href;
		} catch (ex) {
			// Something went wrong, just return the original:
		}
		return uri;
	}

	const links = document.getElementsByTagName('a');
	links.forEach(function (link) {
		const href = link.getAttribute('href');
		if (href) {
			// Replace links with javascript: URIs with text content, since
			// they won't work after scripts have been removed from the page.
			if (href.startsWith('javascript:')) {
				const text = document.createTextNode(link.textContent);
				link.parentNode.replaceChild(text, link);
			} else {
				link.setAttribute('href', toAbsoluteURI(href));
			}
		}
	});

	const imgs = document.querySelectorAll(['img', 'picture', 'figure', 'video', 'audio', 'source'].join(','));
	imgs.forEach(function (media) {
		const src = media.getAttribute('src');
		const srcset = media.getAttribute('srcset');
		if (src) {
			media.setAttribute('src', toAbsoluteURI(src));
		}
		if (srcset) {
			const newSrcset = srcset.replace(REGEXPS.srcsetUrl, function (_, p1, p2, p3) {
				return toAbsoluteURI(p1) + (p2 || '') + p3;
			});
			media.setAttribute('srcset', newSrcset);
		}
	});
}
