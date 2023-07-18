/**
 * Converts a string to use kebab case
 */
function convertToKebabCase(str: string) {
    return str.replace(
        /[A-Z]+(?![a-z])|[A-Z]/g,
        (subs, ofs) => (ofs ? "-" : "") + subs.toLowerCase()
    );
}

/**
 * Creates a HTML element tree
 */
export function html(
    tagName: string,
    attributes: { [key: string]: any },
    ...children: any
) {
    attributes = attributes || {};
    children = children || [];

    const element =
        tagName == "fragment" ? document.createDocumentFragment() : document.createElement(tagName);

    if (tagName !== "fragment") {
        for (const [key, value] of Object.entries(attributes)) {
            (element as HTMLElement)
                .setAttribute(
                    convertToKebabCase(key),
                    value
                );
        }
    }

    for (const child of children) {
        if (child instanceof HTMLElement) element.appendChild(child);
        else if (typeof child === "string") {
            const text = document.createTextNode(child);

            element.appendChild(text);
        }
    }

    return element;
}