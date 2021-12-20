import { EdcPopover } from '../edc-popover';
import { HelpConfigService } from '../services/help-config.service';
import { EdcProperties, IconPopoverConfig } from '../class';
import { Helper } from 'edc-client-js';
import { provideService } from '../utils/test.utils';
import { EdcPopoverConfiguration } from '../config';
import { EDC_HELP_CLASS_NAME, EDC_HELP_CONTAINER_CLASS_NAME } from '../constants/style.constant';
import { removeElementsByClass } from '../utils/dom.utils';
import { PopoverPlacement } from 'edc-popover-utils';

jest.mock('edc-client-js', () => {
    return {
            EdcClient: class {
                getHelper = jest.fn().mockImplementation(() => Promise.resolve({} as Helper));
            }
        };
});

const iconPopoverConfig: IconPopoverConfig = new IconPopoverConfig();
jest.mock('../services/help-config.service', () => ({
    HelpConfigService: class {
        buildPopoverConfig = jest.fn().mockImplementation(() => {
            return Promise.resolve(iconPopoverConfig);
        });
        getIconClasses = jest.fn().mockImplementation(() => {
            return [EDC_HELP_CLASS_NAME, 'some-icon-class'];
        });
    }
}));

describe('Popover test', () => {
    let mockedConfigService: HelpConfigService;
    const edcConfig: EdcPopoverConfiguration = new EdcPopoverConfiguration(
        'edc',
        '/doc',
        'https://demo.easydoccontents.com/help',
        './doc/i18n'
    );
    beforeEach(() => {
        mockedConfigService = provideService(HelpConfigService);
        removeElementsByClass(EDC_HELP_CONTAINER_CLASS_NAME);
        EdcPopover.config(edcConfig);
    });

    beforeEach(() => {
        (mockedConfigService.buildPopoverConfig as any).mockClear();
    });

    const mockParentElement = (mainKey: string | null | undefined,
                               subKey: string | null | undefined,
                               exportId?: string | null | undefined,
                               lang?: string | null | undefined,
                               options?: string | null | undefined,
                               className?: string | null | undefined) => {
        const parent = document.createElement('div');

        if (mainKey) {
            parent.setAttribute('data-main-key', mainKey);
        }
        if (subKey) {
            parent.setAttribute('data-sub-key', subKey);
        }
        if (exportId) {
            parent.setAttribute('data-plugin-id', exportId);
            parent.setAttribute('data-options', '{"placement": "top", "dark": true}');
        }
        if (lang) {
            parent.setAttribute('data-lang', lang);
            parent.setAttribute('data-options', '{"placement": "top", "dark": true}');
        }
        if (options) {
            parent.setAttribute('data-options', options);
        }
        parent.classList.add(className || EDC_HELP_CONTAINER_CLASS_NAME);

        return parent;
    };

    const checkParent = (parent: HTMLElement) => {
        const popoverTrigger = <HTMLElement>parent.firstChild;
        expect(parent.childNodes.length).toBe(1);
        expect(popoverTrigger.tagName).toEqual('SPAN');
        expect(popoverTrigger.classList).toContainEqual(EDC_HELP_CLASS_NAME);
    }

    describe('Popover create', () => {

        it('should create a Popover', () => {
            // Given we have a simple config

            // When instantiating the main edcPopover
            const storedConfig = EdcPopover.getConfig();

            // Then popover should be defined
            expect(storedConfig).toBeDefined();
        });
        it('should append the trigger to the parent', async () => {
            // Given we have a simple config
            const parent = document.createElement('div');
            document.body.appendChild(parent);
            const edcProperties = new EdcProperties('fr.techad.edc', 'documentation_type');

            // When creating the main edcPopover
            await EdcPopover.create(parent, edcProperties);

            // Then it should add the class and append the trigger to the parent element
            expect(parent.classList).toContain('edc-help');
            expect(mockedConfigService.buildPopoverConfig).toHaveBeenCalled();
            const trigger: HTMLSpanElement = document.getElementsByClassName('edc-help-icon')[0] as HTMLSpanElement;
            expect(trigger.onclick).toBeDefined();
        });
        it('should get main key and sub key from element attributes', () => {
            // Given the parent element has the data-main-key and data-sub-key attributes
            const parent = mockParentElement('my-main-key', 'my-sub-key');

            // When creating the popover
            EdcPopover.create(parent);

            expect(mockedConfigService.buildPopoverConfig).toHaveBeenCalledWith('my-main-key', 'my-sub-key', undefined, undefined, null);

        });
        it('should get options from element attributes', () => {
            // Given the parent element has the data-main-key and data-sub-key attributes
            const parent = mockParentElement('my-main-key',
                'my-sub-key',
                'my-other-documentation-export-id',
                'ru',
                '{"placement": "top", "dark": true}'
            );

            // When creating the popover
            EdcPopover.create(parent);

            expect(mockedConfigService.buildPopoverConfig)
                .toHaveBeenCalledWith('my-main-key',
                    'my-sub-key',
                    'my-other-documentation-export-id',
                    'ru',
                    expect.objectContaining({
                        placement: 'top',
                        dark: true
                    }));
        });

        // Invalid inputs
        // MainKey, subKey
        it('should not break if main key or sub key are missing', () => {
            // Given the parent element has the data-main-key and data-sub-key attributes
            const parentMainKeyInvalid = mockParentElement('', 'my-sub-key');
            const parentSubKeyInvalid = mockParentElement('my-main-key', '');

            EdcPopover.create(parentMainKeyInvalid);
            EdcPopover.create(parentSubKeyInvalid);
            expect(mockedConfigService.buildPopoverConfig).toBeCalledTimes(0);
        });
        // Options
        it('should not break if options format is not correct', () => {
            // Given the parent element has the data-main-key and data-sub-key attributes
            const invalidJson = '{placement: "top"}';
            const parentOptionsInvalid = mockParentElement('my-main-key', 'my-sub-key', '', '', invalidJson);
            const parentOptionsNull = mockParentElement('my-main-key', 'my-sub-key', '', '', '');
            const parentOptionsUndefined = mockParentElement('my-main-key', 'my-sub-key');

            EdcPopover.create(parentOptionsInvalid);
            EdcPopover.create(parentOptionsNull);
            EdcPopover.create(parentOptionsUndefined);
            expect(mockedConfigService.buildPopoverConfig).toBeCalledTimes(3);
            expect(mockedConfigService.buildPopoverConfig)
                .toHaveBeenCalledWith('my-main-key', 'my-sub-key', undefined, undefined, null);
        });
    });

    describe('Popover createAll', () => {

        it('should create all Popovers with default class', async () => {
            // Given we have 3 popovers parents containers presents in the dom
            const parent1 = mockParentElement('my-main-key', 'my-sub-key1');
            const parent2 = mockParentElement('my-main-key', 'my-sub-key2');
            const parent3 = mockParentElement('my-main-key', 'my-sub-key3');
            document.body.append(parent1, parent2, parent3);

            let elementsByClassName = document.getElementsByClassName(EDC_HELP_CONTAINER_CLASS_NAME);
            expect(elementsByClassName.length).toBe(3);

            await EdcPopover.createAll();

            [parent1, parent2, parent3].forEach(checkParent);

            let triggerCollection = document.getElementsByClassName(EDC_HELP_CLASS_NAME);
            expect(triggerCollection.length).toBe(3);
            expect(mockedConfigService.buildPopoverConfig).toBeCalledTimes(3);
        });

        it('should create all Popovers with given class', async () => {
            // Given we have 3 popovers parents containers presents in the dom
            const parent1 = mockParentElement('my-main-key', 'my-sub-key1', '', '', '', 'custom-class');
            const parent2 = mockParentElement('my-main-key', 'my-sub-key2', '', '', '', 'custom-class');
            const parent3 = mockParentElement('my-main-key', 'my-sub-key3', '', '', '', 'custom-class');
            // And two other div with different class name
            const parentWithDefaultClass = mockParentElement('my-main-key', 'my-sub-key3');
            const parentWithAnotherClass = mockParentElement('my-main-key', 'my-sub-key3', '', '', '', 'custom-class-2');
            // All injected into the body
            document.body.append(parent1, parent2, parent3, parentWithDefaultClass, parentWithAnotherClass);

            await EdcPopover.createAll('custom-class');

            // All the parents with the specific class name should have been provided with a popover trigger span child
            [parent1, parent2, parent3].forEach(checkParent);
            // The parents with the default class and other classes should not
            expect(parentWithDefaultClass.hasChildNodes()).toBeFalsy();
            expect(parentWithAnotherClass.hasChildNodes()).toBeFalsy();

            // There should be exactly as many popover triggers in the dom as parents with the given class name
            let triggerCollection = document.getElementsByClassName(EDC_HELP_CLASS_NAME);
            expect(triggerCollection.length).toBe(3);
            expect(mockedConfigService.buildPopoverConfig).toBeCalledTimes(3);
        });

        it('create all should not break if one of the parent is not valid', async () => {
            // Given we have 3 popovers parents containers presents in the dom
            const parent1 = mockParentElement('my-main-key', 'my-sub-key1', '', '', '', 'custom-class');
            const parentWithWrongKey = mockParentElement('', 'my-sub-key2', '', '', '', 'custom-class');
            const parentWithWrongOptions = mockParentElement('', 'my-sub-key2', '', '', '{notAValidJSON}', 'custom-class');
            const parent2 = mockParentElement('my-main-key', 'my-sub-key3', '', '', '', 'custom-class');

            // All injected into the body
            document.body.append(parent1, parentWithWrongKey, parentWithWrongOptions, parent2);

            await EdcPopover.createAll('custom-class');

            // All the valid parents should have been provided with a popover trigger span child
            [parent1, parent2].forEach(checkParent);
            // The parents with the wrong key and the wrong option format should not
            expect(parentWithWrongKey.hasChildNodes()).toBeFalsy();
            expect(parentWithWrongOptions.hasChildNodes()).toBeFalsy();

            // There should be exactly as many popover triggers in the dom as parents with valid attributes
            let triggerCollection = document.getElementsByClassName(EDC_HELP_CLASS_NAME);
            expect(triggerCollection.length).toBe(2);
            expect(mockedConfigService.buildPopoverConfig).toBeCalledTimes(2);
        });
    });

    describe('EdcPopover config', () => {
        it('should update options when updating the configuration', () => {
            // Given we have no global options defined
            expect(EdcPopover.getConfig().options).toBeUndefined();

            // When we update the global configuration with some options
            const configWithOptions = { ...edcConfig, options: { trigger: 'mouseenter' } };
            EdcPopover.config(configWithOptions);

            // Then it should be saved for the popover instance
            expect(EdcPopover.getConfig().options).toStrictEqual({ trigger: 'mouseenter' });
        });
    });

    describe('Options hierarchy - template dom element properties vs parameter properties', () => {
        it('should let parameter options override element data attributes options', () => {
            // Given we have a parent container with some options defined as data properties
            const parent1 = mockParentElement('my-main-key', 'my-sub-key1', null, null, '{ "placement": "bottom", "trigger": "mouseenter" }');

            // When creating a popover passing options as parameter, with one option property defined in the element data as well (here placement)
            const props = new EdcProperties('', '', '', '', { placement: PopoverPlacement.RIGHT });
            EdcPopover.create(parent1, props);

            // Then the options should have been merged, with the parameters overriding the ones from the dom element properties
            expect(mockedConfigService.buildPopoverConfig).toHaveBeenCalledWith(
                '',
                '',
                '',
                '',
                // Placement should be right and not bottom, trigger should be equal to the data property value 'mouseenter'
                expect.objectContaining({ placement: PopoverPlacement.RIGHT, trigger: 'mouseenter' })
            );
        });
    });
});
