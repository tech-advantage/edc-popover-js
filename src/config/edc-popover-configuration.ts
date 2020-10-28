import { IEdcPopoverOptions } from '../class/edc-popover-options.interface';

/**
 * Popover global configuration, to provide when importing the edc help module
 *
 *    pluginId: URL to the help web app.
 *    helpPath: URL to the HTTP served export.
 *    docPath: Export plugin name for the edc documentation.
 *    i18nDirName: Path to the i18n files, containing the labels
 *    options: Popover global options, to apply to all popovers
 *
 */
export class EdcPopoverConfiguration {
  constructor(public pluginId?: string,
              public helpPath?: string,
              public docPath?: string,
              public i18nDirName?: string,
              public options?: IEdcPopoverOptions) {
  }
}
