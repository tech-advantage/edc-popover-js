import { ICON_TAG_NAME } from '../constants/style.constant';

/**
 * Splits the classes contained in the given string and returns an array from those class names
 *
 * Returns an empty array if string is empty
 * @param classes the css class names
 */
export const splitClasses = (classes: string): string[] => {
    if (!classes || !classes.trim()) {
        return [];
    }
    const classSeparator = ' ';
    return classes.split(classSeparator);
};

/**
 * Receives a string containing different css classes separated by a space.
 * Split those classes and add them to the given html element
 *
 * @param element the given element
 * @param classes the string containing the classes to add, separated by a single space
 */
export const addClassesFromString = (element: Element, classes: string): void => {
    if (!element || !classes || !classes.trim()) {
        return;
    }
    splitClasses(classes).forEach((className: string) => element.classList.add(className));
};

/**
 * Adds the css class names to the given html element
 *
 * @param element the given html element
 * @param classNames the class or classes to add to the given element
 */
export const addElementClasses = (element: HTMLElement, classNames: string | string[]): void => {
    if (!element || !classNames) {
        return;
    }
    if (typeof classNames === 'string') {
        addClassesFromString(element, classNames);
        return;
    }
    if (Array.isArray(classNames)) {
        classNames.forEach((className: string) => addClassesFromString(element, className));
    }
};

/**
 * Updates the element style property from the given style object
 *
 * @param element the element to update
 * @param style the given style object
 */
export const addElementStyle = (element: HTMLElement, style: Partial<CSSStyleDeclaration> | null): void => {
    if (!element || !style) {
        return;
    }
    Object.keys(style).forEach((key: string) => {
       if (element.style.hasOwnProperty(key) && style.hasOwnProperty(key)) {
           element.style[key] = style[key];
       }
    });
};

/**
 * Removes all the elements using the given css class name
 *
 * @param className the css class name to select all the elements to remove
 */
export const removeElementsByClass = (className: string): void => {
    const elements: HTMLCollectionOf<Element>  = document.getElementsByClassName(className);
    if (!elements || !elements.length) {
        return;
    }
    while (elements.length > 0 && elements[0].parentNode) {
        // Remove current element from parent's childNodes - Child nodes are live node lists
        elements[0].parentNode.removeChild(elements[0]);
    }
};

/**
 * Removes all the class and style from the source element if it exists, and returns it
 *
 * If no source element, returns a new element
 * @param srcElement the element to process if provided
 * @param tagName the tag for the new element if source was not defined
 */
export const getCleanElement = (srcElement: HTMLElement | null | undefined, tagName = ICON_TAG_NAME): HTMLElement => {
    let el: HTMLElement;
    if (srcElement) {
        // Clear all the previous classes and style
        srcElement.removeAttribute('class');
        srcElement.removeAttribute('style');
        el = srcElement;
    } else {
        el = document.createElement(tagName);
    }
    return el;
};
