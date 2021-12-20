import { EdcPopoverOptions, EdcProperties, IconPopoverConfig, IEdcPopoverOptions } from '../class';
import { copyDefinedProperties, isFalse, parseJSON } from './global.utils';
import { EDC_HELP_CLASS_NAME, ICON_TAG_NAME, POPOVER_ATTRIBUTE_NAME } from '../constants/style.constant';
import { getCleanElement } from './dom.utils';
import { Popover } from 'edc-popover-utils';

/**
 * Prepares the popover for the trigger element, using the resolved configuration.
 *
 * Any trigger event on the target element ('click', 'mouseenter'...) will then open the popover.
 *
 * @param triggerEl the html element that will be responsible for opening the popover on event (click, hover...)
 * @param config the configuration resolved for this popover
 * @private
 */
export const createPopover = (triggerEl: HTMLElement, config: IconPopoverConfig): void => {
    if (!config || !triggerEl ) {
        return;
    }
    // Save the trigger element reference in the configuration - the popover builder will plug the popover to it
    config.target = triggerEl;
    // Create the popover instance to be associated with the trigger element
    const popover = new Popover();
    // Reuse tippy instance if it's already present
    if (triggerEl[POPOVER_ATTRIBUTE_NAME]) {
        popover.instance = triggerEl[POPOVER_ATTRIBUTE_NAME];
    }
    // If any input property resolved into not showing the popover, skip the last step
    if (isFalse(config.disablePopover)) {
        // Build the popover that will be shown on click/event
        popover.buildPopover(config);
    } else {
        // Make sure any previous instance is removed, so the popover won't show on click
        popover.removeExistingPopover();
    }
};

/**
 * Checks if parent element already contains a trigger child element.
 * If so, removes all classes and style from this child element, and returns it
 *
 * If no child element was found, creates a new one, appends it to the parent element, and returns it
 *
 *  In case of missing popover properties, removes any present child from the parent and return null
 *
 * @param parent the parent html element, container for the trigger element
 * @param props the mandatory properties for the trigger element
 */
export const prepareTriggerElement = (parent: HTMLElement, props: EdcProperties): HTMLElement | null => {
    if (!parent) {
        return null;
    }
    // Check for any existing trigger element in the given parent element, using the generic class name
    const child: HTMLSpanElement | null = parent.querySelector<HTMLSpanElement>(`.${EDC_HELP_CLASS_NAME}`);

    // If properties are missing, return null
    if (!props) {
        // Remove previous child before leaving
        if (child) {
            parent.removeChild(child);
        }
        return null;
    }
    // Prepare the trigger element
    // Clean the child element if it exists or get a new span
    const trigger: HTMLSpanElement = getCleanElement(child, ICON_TAG_NAME);
    if (!child) {
        // Set the trigger as the parent container child
        parent.appendChild(trigger);
    }
    return trigger;
};

/**
 * Resolves the popover properties, combining given properties and dom element attributes properties
 *
 * First checks and parses the properties set as data- attributes in the parent element
 * Overrides with properties defined in the props parameter
 *
 * @param parent the parent element that will contain the popover trigger element
 * @param props the given properties to override for this parent
 * @private
 */
export const resolveEdcProperties = (parent: HTMLElement, props: EdcProperties | null | undefined = null): EdcProperties | null => {
    if (!parent || !parent.dataset) {
        return props;
    }
    // Start with any data stored in parent as DOM data attribute
    const { mainKey, subKey, pluginId, lang, options: optionsStr } = parent.dataset;

    if (!mainKey || mainKey === 'null' || !subKey || subKey === 'null') {
        return props;
    }

    let optionsFromElement = parseJSON<EdcPopoverOptions>(optionsStr);
    if (optionsFromElement) {
        optionsFromElement = copyDefinedProperties<EdcPopoverOptions>(new EdcPopoverOptions(), optionsFromElement);
    }
    // Reassemble the inputs retrieved from the dom element data properties into a new EdcProperties
    const propsFromElement: EdcProperties = new EdcProperties(mainKey, subKey, pluginId, lang, optionsFromElement);
    // Override with values from props parameter
    const properties = copyDefinedProperties<EdcProperties>(propsFromElement, props);
    // If both are present, resolve options between the properties passed in the template and the ones from the parameters
    if (properties && optionsFromElement && props) {
        properties.options = copyDefinedProperties<IEdcPopoverOptions>(optionsFromElement, props.options);
    }
    return properties;
};
