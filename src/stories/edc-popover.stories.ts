import { EdcPopover } from '../edc-popover';
import { edcConfig } from './edc-config';

const HelpKeys = {
    title: 'Edc main properties',
    argTypes: {
        mainKey: { control: 'text' },
        subKey: { control: 'text' },
        lang: {
            control: {
                type: 'select',
                options: ['en', 'fr', 'ru']
            }
        }
    }
};
const defaultValues = { mainKey: 'fr.techad.edc', subKey: 'help.center' };
const Template = ({ mainKey, subKey, lang }) => {
    const edcProperties = { mainKey, subKey, lang, pluginId: 'plugin', options: null };
    const container = document.createElement('div');
    EdcPopover.config(edcConfig);
    EdcPopover.create(container, edcProperties);
    return container;
};

export const EdcMainKey = Template.bind({}) as any;
EdcMainKey.args = defaultValues;

export default HelpKeys;
