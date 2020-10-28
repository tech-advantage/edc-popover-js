import { HelpPopoverService } from '../help-popover.service';
import { HelpService } from '../help.service';
import { EdcTranslationService } from '../edc-translation.service';
import { mock, mockHelper, provideService } from '../../utils/test.utils';
import { Article, Helper, Link, PopoverLabel } from 'edc-client-js';
import { DEFAULT_LABELS } from '../../translate/default-translations';
import { SYS_LANG } from '../../translate/language-codes';
import { IconPopoverConfig } from '../../class';
import { EdcClient } from 'edc-client-js';
jest.mock('edc-client-js');

describe('HelpPopover service test', () => {

    let helpPopoverService: HelpPopoverService;
    let helpService: HelpService;
    let edcTranslationService: EdcTranslationService;

    // Mock objects
    let helper: Helper;
    beforeEach(() => {
        jest.spyOn(EdcClient.prototype, 'getHelper').mockImplementation(() => Promise.resolve({}));
    });

    beforeEach(() => {
        helpService = provideService<HelpService>(HelpService);
        edcTranslationService = provideService<EdcTranslationService>(EdcTranslationService);

        helpPopoverService = provideService<HelpPopoverService>(HelpPopoverService);
    });

    beforeEach(() => {
        helper = mockHelper();
    });

    const initSpies = (helperToUse: Helper, labels: PopoverLabel = DEFAULT_LABELS.get(SYS_LANG)) => {
        jest.spyOn(HelpService.prototype, 'getHelp').mockImplementation(() => Promise.resolve(helperToUse));
        jest.spyOn(HelpService.prototype, 'getContextUrl')
            .mockImplementation((mainKey: string, subKey: string, languageCode: string, articleIndex: number) =>
            `articleUrl1/${mainKey}/${subKey}/${languageCode}/${articleIndex}/`);
        jest.spyOn(HelpService.prototype, 'getDocumentationUrl').mockImplementation((docId: number) => `linkUrl1/${docId}/`);
        jest.spyOn(EdcTranslationService.prototype, 'getPopoverLabels').mockImplementation(() => Promise.resolve(labels));
        jest.spyOn(EdcTranslationService.prototype, 'setLang').mockImplementation(() => {});
    };

    describe('addContent', () => {

        it('should add content', () => {
            // Given the helper is set with base properties
            initSpies(helper);

            // When calling addContent
            const config: IconPopoverConfig = helpPopoverService.addContent(helper, 'myMainKey', 'mySubKey', 'en');

            // Then configuration and its main attributes should be defined
            expect(config).toBeDefined();
            expect(config.content).toBeDefined();
            const { title, description, articles, links } = config.content;
            expect(HelpService.prototype.getContextUrl).toHaveBeenCalledWith('myMainKey', 'mySubKey', 'en', 0, 'resolvedPluginId');
            expect(HelpService.prototype.getContextUrl).toHaveBeenCalledTimes(1);
            expect(title).toEqual('MyTitle');
            expect(description).toEqual('MyDescription');
            expect(articles.length).toEqual(1);
            expect(articles).toContainEqual(mock(Article, {
                label: 'articleLabel1',
                url: `articleUrl1/myMainKey/mySubKey/en/0/`
            }));
            expect(links.length).toEqual(1);
            expect(HelpService.prototype.getDocumentationUrl).toHaveBeenCalledWith(7);
            expect(HelpService.prototype.getDocumentationUrl).toHaveBeenCalledTimes(1);
            expect(links).toContainEqual(mock(Link, { id: 7, label: 'linkLabel1', url: `linkUrl1/7/` }));

        });
        // Description
        it('should return configuration if description is not defined', () => {
            // Given the helper is set with no description
            helper.description = undefined;
            initSpies(helper);

            // When calling addContent
            const config: IconPopoverConfig = helpPopoverService.addContent(helper, 'mainKey', 'subKey', 'en');

            // Then configuration and its main attributes should be defined, except for description
            const { title, description, articles, links } = config.content;
            expect(title).toEqual('MyTitle');
            expect(description).toBeFalsy();
            expect(articles.length).toEqual(1);
            expect(links.length).toEqual(1);
        });
        // Articles and links
        it('should return configuration if articles and links are not defined', () => {
            // Given the helper is set with no articles and no links
            helper.articles = undefined;
            helper.links = undefined;
            initSpies(helper);

            // When calling addContent
            const config: IconPopoverConfig = helpPopoverService.addContent(helper, 'mainKey', 'subKey', 'en');

            // Then configuration and its main attributes should be defined, expect for articles and links
            const { title, description, articles, links } = config.content;
            expect(title).toEqual('MyTitle');
            expect(description).toEqual('MyDescription');
            expect(articles).toEqual([]);
            expect(links).toEqual([]);
        });

        // Language
        it('should add content', () => {
            // Given we call the helper for content in fr language but the helper came back with 'ru' as the resolved language
            helper.language = 'ru';
            initSpies(helper);

            // When calling addContent
            helpPopoverService.addContent(helper, 'myMainKey', 'mySubKey', 'en');

            // Then translation service should be updated with the resolved language
            expect(EdcTranslationService.prototype.setLang).toHaveBeenCalledWith('ru');
            expect(HelpService.prototype.getContextUrl).toHaveBeenCalledWith('myMainKey', 'mySubKey', 'ru', 0, 'resolvedPluginId');
        });
    });

    describe('addLabels', () => {

        it('should return the translated labels', () => {
            // Given a custom label is return from the translation service
            const customLabels: PopoverLabel = {
                articles: 'Plus d\'info...',
                links: 'Sujets associés',
                iconAlt: 'Aide',
                comingSoon: 'Aide contextuelle à venir.',
                errors: {
                    failedData: 'Une erreur est survenue lors de la récupération des données !' +
                        '\\nVérifiez les clés de la brique fournies au composant EdcHelp.'
                },
                content: null,
                url: '',
                exportId: ''
            };
            initSpies(helper, customLabels);
            const config: IconPopoverConfig = new IconPopoverConfig();
            // When calling addLabels
            helpPopoverService.addLabels(config)
                .then((iPConfig: IconPopoverConfig) => {
                    // Then popover labels should match
                    expect(iPConfig.labels).toEqual(customLabels);
                });
        });

    });
});
