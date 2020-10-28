import EdcPopover, { EdcPopoverOptions, PopoverIcon } from '../index';
import { edcConfig } from './edc-config';
import { copyDefinedProperties } from '../utils/global.utils';
import { createStoryContainer } from '../utils/test.utils';
import { DEFAULT_ICON } from '../constants/style.constant';

const booleanControl = {
    control: {
        type: 'inline-radio',
        options: [true, false]
    }
};
const HelpCustomStyle = {
    title: 'Edc custom style',
    argTypes: {
        dark: booleanControl,
        class: {
            control: {
                type: 'text'
            }
        },
        url: {
            control: {
                type: 'text'
            }
        },
        height: {
            control: {
                type: 'number'
            }
        },
        width: {
            control: {
                type: 'number'
            }
        }
    }
};
const edcLogoUrl = 'https://www.easydoccontents.com/wp-content/uploads/2016/03/edc_site_logo-1.png';
// https://iconsplace.com/wp-content/uploads/_icons/ffa500/256/png/help-icon-11-256.png
// https://www.easydoccontents.com/wp-content/uploads/2016/03/edc_site_logo-1.png
const defaultValues = { dark: false, class: DEFAULT_ICON, url: edcLogoUrl, height: 38, width: 89 };
const Template = ({ dark, class: className, url, height, width }) => {
    const iconConfig = { ...PopoverIcon.create(), class: className, url, height, width };
    const options = copyDefinedProperties<EdcPopoverOptions>(new EdcPopoverOptions(), { dark, icon: iconConfig } as any);
    const edcProperties = { mainKey:'fr.techad.edc', subKey: 'help.center', options };
    const container = createStoryContainer('200px', '120px', 'center', dark);
    const parent1 = document.createElement('div');
    EdcPopover.config(edcConfig);
    EdcPopover.create(parent1, edcProperties);
    container.appendChild(parent1);
    return container;
};

export const EdcMainKey = Template.bind({});
EdcMainKey.args = defaultValues;

export default HelpCustomStyle;
