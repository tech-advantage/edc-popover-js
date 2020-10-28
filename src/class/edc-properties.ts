import { IEdcPopoverOptions } from './edc-popover-options.interface';

/**
 * Properties for a given popover
 *
 * mainKey: The main key of the contextual help
 * subKey: The sub key of the contextual help
 * pluginId: The identifier of the target plugin documentation export (allows to use a documentation export different
 *          from the one defined in the global configuration)
 * lang: The lang to use for this popover
 * options: The options to use for this popover
 *
 */
export class EdcProperties {

    constructor(public mainKey: string,
                public subKey: string,
                public pluginId?: string,
                public lang?: string,
                public options?: IEdcPopoverOptions) {
    }
}
