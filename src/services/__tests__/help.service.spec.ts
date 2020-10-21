import { PopoverConfigurationHandler } from '../../config/popover-configuration.handler';
import { HelpService } from '../help.service';
import { provideService } from '../../utils/test.utils';
import { EdcClient } from 'edc-client-js';
import { EdcPopoverConfiguration } from '../../config';
jest.mock('edc-client-js');

describe('Help service test', () => {
    let helpService: HelpService;
    let popoverConfigurationHandler: PopoverConfigurationHandler;
    beforeEach(() => {
        jest.spyOn(EdcClient.prototype, 'getHelper').mockImplementation(() => {
            return Promise.resolve({});
        });
    });

    beforeEach(() => {
        popoverConfigurationHandler = provideService<PopoverConfigurationHandler>(PopoverConfigurationHandler);
        popoverConfigurationHandler.setConfig(new EdcPopoverConfiguration(
            'edc',
            '/doc',
            'https://demo.easydoccontents.com/help',
            './doc/i18n'
        ));
        helpService = provideService<HelpService>(HelpService);
    });

    describe('getHelp', () => {

        it('should use "edc" as plugin identifier if getHelper is called with no defined pluginId parameter', () => {
            expect(popoverConfigurationHandler.getPluginId()).toEqual('edc');

            helpService.getHelp('mainKey', 'subKey').then(() => {
            });

            expect(EdcClient.prototype.getHelper).toHaveBeenCalledWith('mainKey', 'subKey', 'edc', undefined);
        });

        it('should use "edc2" as plugin identifier', () => {
            expect(popoverConfigurationHandler.getPluginId()).toEqual('edc');

            helpService.getHelp('mainKey', 'subKey', 'edc2').then(() => {
            });

            expect(EdcClient.prototype.getHelper).toHaveBeenCalledWith('mainKey', 'subKey', 'edc2', undefined);
        });
    });
});
