import { IEdcPopoverOptions } from '../class/edc-popover-options.interface';
import { EdcPopoverConfiguration } from './edc-popover-configuration';
import { EdcPopoverOptions } from '../class/edc-popover-options';
import { singleton } from 'tsyringe';

@singleton()
class PopoverConfigurationHandler {
    private config: EdcPopoverConfiguration;
    constructor() {
        this.config = new EdcPopoverConfiguration();
    }

    getConfig(): EdcPopoverConfiguration {
        return this.config;
    }

    setConfig(config: EdcPopoverConfiguration): void {
        this.config = config;
    }

    getPluginId(): string {
        return (this.config && this.config.pluginId) ? this.config.pluginId : '';
    }

    getHelpPath(): string {
        return (this.config && this.config.helpPath) ? this.config.helpPath : '';
    }

    getDocPath(): string {
        return (this.config && this.config.docPath) ? this.config.docPath : '';
    }

    getI18nPath(): string {
        return (this.config && this.config.i18nDirName) ? this.config.i18nDirName : '';
    }

    getPopoverOptions(): IEdcPopoverOptions {
        return (this.config && this.config.options) ? this.config.options : new EdcPopoverOptions();
    }

}

export { PopoverConfigurationHandler };
