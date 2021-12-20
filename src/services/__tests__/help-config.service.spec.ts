import { mockHelper, provideService } from '../../utils/test.utils';
import { HelpService } from '../help.service';
import { HelpPopoverService } from '../help-popover.service';
import { HelpIconService } from '../help-icon.service';
import { HelpErrorService } from '../help-error.service';
import { Helper } from 'edc-client-js';
import { PopoverOptions } from 'edc-popover-utils';
import { IconPopoverConfig } from '../../class';
import { HelpConfigService } from '../help-config.service';

jest.mock('edc-client-js', () => {
    return {
        EdcClient: class {
            getHelper = jest.fn().mockImplementation(() => Promise.resolve({} as Helper));
        }
    };
});

describe('HelpConfig service test', () => {
    let helpConfigService: HelpConfigService;

    // Services
    let helpService: HelpService;
    let helpPopoverService: HelpPopoverService;
    let helpIconService: HelpIconService;
    let helpErrorService: HelpErrorService;

    // Objects
    let helper: Helper;

    beforeEach(() => {
        helpService = provideService<HelpService>(HelpService);
        helpPopoverService = provideService<HelpPopoverService>(HelpPopoverService);
        helpIconService = provideService<HelpIconService>(HelpIconService);
        helpErrorService = provideService<HelpErrorService>(HelpErrorService);
        helpConfigService = provideService<HelpConfigService>(HelpConfigService);
    });

    beforeEach(() => {
        helper = mockHelper();
    });

    // Options
    it('should set the append to option to body and placement to bottom', () => {
        // Given set the append to option to null
        const options = new PopoverOptions();
        jest.spyOn(HelpService.prototype, 'getPopoverOptions').mockImplementation(() => options);

        // When calling buildPopoverConfig requesting the content in french
        helpConfigService.buildPopoverConfig('myMainKey', 'mySubKey', 'myPluginId', 'en')
            .then((config: IconPopoverConfig) => {
                expect(config).toBeDefined();
                expect(config.options).toBeDefined();
                if (config && config.options) {
                    // Then append to option should be set as parent, via the function returning the body element
                    expect(typeof config.options.appendTo).toEqual('function');
                    // Bottom should be set from default value
                    expect(config.options.placement).toEqual('bottom');
                    expect(config.options.customClass).toBeUndefined();
                }
            });
    });
    it('should set the append to option to parent and placement to top', () => {
        // Given set the append to option to 'parent'
        const options = new PopoverOptions();
        options.appendTo = 'parent';
        jest.spyOn(HelpService.prototype, 'getPopoverOptions').mockImplementation(() => options);

        // When calling buildPopoverConfig requesting the content in french
        helpConfigService.buildPopoverConfig('myMainKey',
            'mySubKey',
            'myPluginId',
            'en',
            new PopoverOptions())
            .then((config: IconPopoverConfig) => {
                expect(config).toBeDefined();
                expect(config.options).toBeDefined();
                if (config && config.options) {
                    // Then append to option should be set as parent
                    expect(config.options.appendTo).toEqual('parent');
                    // Bottom should be set from default value
                    expect(config.options.placement).toEqual('top');
                    // Custom class should have been set to "my-custom-class"
                    expect(config.options.customClass).toEqual('my-custom-class');
                }
            });
    });
});
