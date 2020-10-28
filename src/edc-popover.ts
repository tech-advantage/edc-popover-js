import { EdcProperties } from './class/edc-properties';
import { container } from 'tsyringe';
import { EdcPopoverConfiguration } from './config/edc-popover-configuration';
import { EDC_HELP_CONTAINER_CLASS_NAME } from './constants/style.constant';
import { HelpConfigService } from './services/help-config.service';
import { IconPopoverConfig } from './class/icon-popover-config';
import { PopoverConfigurationHandler } from './config/popover-configuration.handler';
import { createPopover, prepareTriggerElement, resolveEdcProperties } from './utils/edc-popover.utils';
import { addClassesFromString, addElementClasses, addElementStyle } from './utils/dom.utils';

/**
 * Entry point for creating new popovers
 *
 * Singleton class, will be generated when setting the configuration
 *
 * Once the configuration is provided, there are 2 ways for creating popovers
 *
 *  1.Single mode
 *      with EdcPopover.create(parent, props?) : will create a single popover for the given parent element
 *
 *  2.Global mode
 *      with EdcPopover.createAll(cssClassName, props?) will generate one popover for all the html elements in the dom using the given css class name
 *
 * Created popovers will be shown on click, or any other trigger mode specified in the options - check the readme for more information
 *
 */
export class EdcPopover {
    private static instance: EdcPopover;

    private readonly helpConfigService: HelpConfigService;
    private readonly configHandler: PopoverConfigurationHandler;

    private constructor(private config: EdcPopoverConfiguration) {
        this.configHandler = container.resolve(PopoverConfigurationHandler);
        this.configHandler.setConfig(config);

        this.helpConfigService = container.resolve(HelpConfigService);
    }

    /**
     * Stores the configuration object. Must be called before creating any popover.
     *
     * Initializes the edc popover instance if it was not defined.
     *
     * Can be used to update the configuration.
     * New configuration will only affect the next popovers, not the ones already created.
     *
     * @param config the configuration object that will be used when generating a new popover element
     */
    static config(config: EdcPopoverConfiguration): void {
        if (!EdcPopover.instance) {
            EdcPopover.instance = new EdcPopover(config);
        } else {
            // Set the new configuration to be used with the next popovers
            EdcPopover.instance.configHandler.setConfig(config);
        }
    }

    /**
     * Creates a popover for the given parent element, with the given properties.
     *
     * Properties can be defined both at the parent element level (data-x attributes) or passed in here as a second parameter.
     *
     * Checks if any property is defined in the parent element data properties
     * (data-main-key, data-sub-key, data-export-id, data-lang, data-options),
     * and combine both sources (props from parameters will override the one from the dom element properties).
     *
     * 5 properties can be defined as element attributes. If you consider the given parent element:
     * <div class="edc-help"
     *      data-main-key="main.key"
     *      data-sub-key="sub.key"
     *      data-plugin-id="otherPluginId"
     *      data-lang="fr"
     *      data-option='{ "placement": "right" }'
     * </div>
     *
     * (note that mainKey and subKey are mandatory, so they must be present either at the element level or in the given props)
     * Any property defined as data attribute will be overwritten by the properties passed in within the props parameter
     *
     * @param parent the reference of the dom element that will contain the popover trigger (the icon)
     * @param props the properties to override any dom data property with
     */
    static create(parent: HTMLElement, props?: EdcProperties): void {
        if (!EdcPopover.instance) {
            throw new Error('No Edc popover configuration found, please provide your configuration using EdcPopover.config(yourConfiguration)');
        }
        if (!parent) {
            return null;
        }
        EdcPopover.instance.appendTrigger(parent, resolveEdcProperties(parent, props));
    }

    /**
     * Creates all popovers for the parent containers with the given class name
     *
     * Finds all the element having this class name, and appends a popover to each one of them.
     * Will combine the data set in each dom element (data-main-key, data-sub-key, data-export-id, data-lang, data-options)
     * @param className the name of the class to identify all the parent elements to use
     * @param props
     */
    static createAll(className?: string, props?: EdcProperties): void {
        if (!EdcPopover.instance) {
            throw new Error('No configuration found, please provide your configuration using EdcPopover.config(configuration)');
        }
        let popoverClass = className;
        if (!popoverClass || !popoverClass.trim().length) {
            popoverClass = EDC_HELP_CONTAINER_CLASS_NAME;
        }
        const popoversContainers: HTMLCollectionOf<Element> = document.getElementsByClassName(popoverClass);
        if (!popoversContainers || !popoversContainers.length) {
            // No popover container were found with resolved class name
            return;
        }
        let parent;
        for (let i = 0; i < popoversContainers.length; i++) {
            parent = popoversContainers[i];
            EdcPopover.instance.appendTrigger(parent, resolveEdcProperties(parent, props));
        }
    }

    /**
     * Returns the global popover current configuration
     */
    static getConfig(): EdcPopoverConfiguration {
        return EdcPopover.instance.configHandler.getConfig();
    }

    /**
     * Appends to the given parent the element that will trigger the popover.
     * If a trigger already exists for this parent, retrieves and updates it.
     * Else provides a new element.
     *
     * @param parent the container element for the trigger element
     * @param props the properties to use for the popover trigger element
     * @private
     */
    private appendTrigger(parent: HTMLElement, props: EdcProperties): void {
        if (!props) {
            return;
        }
        // Prepare the properties for the new popover element
        const { mainKey, subKey, pluginId, lang, options } = props;
        // Call the configuration builder and create the popover from the resolved configuration
        EdcPopover.instance.helpConfigService.buildPopoverConfig(mainKey, subKey, pluginId, lang, options)
            .then((config: IconPopoverConfig) => EdcPopover.instance.loadPopover(parent, props, config));
    }

    /**
     * Prepares the popover for the trigger element, using the resolved configuration.
     *
     * Any trigger event on the target element ('click', 'mouseenter'...) will then open the popover.
     *
     * @param parent the parent element containing the trigger element (icon)
     * @param props The properties for the popover (main key, sub key, options..)
     * @param config the configuration resolved for this popover, based on global configuration and specific properties
     * @private
     */
    private loadPopover(parent: HTMLElement, props: EdcProperties, config: IconPopoverConfig): void {
        if (!config || !parent) {
            return;
        }
        const triggerEl: HTMLElement = prepareTriggerElement(parent, props);
        if (!triggerEl || !props) {
            // Could not generate a new trigger element, parent or props missing.
            return;
        }
        this.addElementStyle(parent, triggerEl, config);
        createPopover(triggerEl, config);
    }

    /**
     * Adds the css classes to the popover elements
     *
     * Inserts a generic class for the parent
     * Adds a generic class for the trigger, plus specific classes corresponding to its properties (icon class, error mode...)
     * Specify style rules for the trigger if options set an image file for the icon
     *
     * @param parent the parent element containing the trigger element (icon)
     * @param triggerEl the html element that will be responsible for opening the popover on event (click, hover...)
     * @param config the configuration resolved for this popover, based on global configuration and specific properties
     * @private
     */
    private addElementStyle(parent: HTMLElement, triggerEl: HTMLSpanElement, config: IconPopoverConfig): void {
        // Add the generic class to the parent container
        addClassesFromString(parent, EDC_HELP_CONTAINER_CLASS_NAME);
        // Add the classes resolved from the configuration builder from the input properties
        addElementClasses(triggerEl, EdcPopover.instance.helpConfigService.getIconClasses(config));
        // If icon is loading the image from an url, add the corresponding style to the trigger element
        addElementStyle(triggerEl, config.iconConfig.imageStyle);
    }

}
