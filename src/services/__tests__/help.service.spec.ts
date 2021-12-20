import { PopoverConfigurationHandler } from '../../config/popover-configuration.handler';
import { HelpService } from '../help.service';
import { provideService } from '../../utils/test.utils';
import { Helper } from 'edc-client-js';
import { EdcPopoverConfiguration } from '../../config';

const getHelperMock = jest.fn().mockImplementation(() => Promise.resolve({} as Helper));

jest.mock('edc-client-js', () => {
    return {
        EdcClient: class {
            getHelper = getHelperMock;
        }
    };
});
describe('Help service test', () => {
    let helpService: HelpService;
    let popoverConfigurationHandler: PopoverConfigurationHandler;

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

            expect(getHelperMock).toHaveBeenCalledWith('mainKey', 'subKey', 'edc', undefined);
        });

        it('should use "edc2" as plugin identifier', () => {
            expect(popoverConfigurationHandler.getPluginId()).toEqual('edc');

            helpService.getHelp('mainKey', 'subKey', 'edc2').then(() => {
            });

            expect(getHelperMock).toHaveBeenCalledWith('mainKey', 'subKey', 'edc2', undefined);
        });
    });
});
