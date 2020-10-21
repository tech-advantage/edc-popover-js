import { EdcClient, Helper, PopoverLabel } from 'edc-client-js';
import { SYS_LANG } from '../translate/language-codes';
import { PopoverConfigurationHandler } from '../config/popover-configuration.handler';
import { IEdcPopoverOptions } from '../class/edc-popover-options.interface';
import { EdcPopoverOptions } from '../class/edc-popover-options';
import { container, singleton } from 'tsyringe';

@singleton()
class HelpService {

    private readonly configurationHandler: PopoverConfigurationHandler;
    private readonly edcClient: EdcClient;

    constructor() {
        this.configurationHandler = container.resolve<PopoverConfigurationHandler>(PopoverConfigurationHandler);
        this.edcClient = new EdcClient(this.configurationHandler.getDocPath(),
            this.configurationHandler.getHelpPath(),
            this.configurationHandler.getPluginId(),
            true, // Context only, don't load the whole doc
            this.configurationHandler.getI18nPath()
        );
    }

    getHelp(primaryKey: string, subKey: string, pluginId?: string, lang?: string): Promise<Helper> {
        const pluginIdentifier = pluginId || this.configurationHandler.getPluginId();
        return this.edcClient.getHelper(primaryKey, subKey, pluginIdentifier, lang);
    }

    getContextUrl(mainKey: string, subKey: string, languageCode: string, articleIndex: number, pluginId?: string): string {
        return this.edcClient.getContextWebHelpUrl(mainKey, subKey, languageCode, articleIndex, pluginId);
    }

    getDocumentationUrl(docId: number): string {
        return this.edcClient.getDocumentationWebHelpUrl(docId);
    }

    getI18nUrl(): string {
        return this.edcClient.getPopoverI18nUrl();
    }

    getPluginId(): string {
        return this.configurationHandler.getPluginId();
    }

    getPopoverOptions(): IEdcPopoverOptions {
        return this.configurationHandler.getPopoverOptions() || new EdcPopoverOptions();
    }

    getDefaultLanguage(): string {
        return (this.edcClient && this.edcClient.getDefaultLanguage && this.edcClient.getDefaultLanguage()) || SYS_LANG;
    }

    isLanguagePresent(langCode: string): boolean {
        return this.edcClient.isLanguagePresent(langCode);
    }

    getPopoverLabels(langCode: string): Promise<PopoverLabel> {
        return this.edcClient.getPopoverLabels(langCode);
    }
}

export { HelpService };
