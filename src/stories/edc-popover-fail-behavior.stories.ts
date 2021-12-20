import { EdcPopoverOptions, FailBehavior } from '../class';
import EdcPopover from '../index';
import { IconBehavior, PopoverBehavior } from '../class/fail-behavior';
import { edcConfig } from './edc-config';

const HelpFailBehavior = {
    title: 'Edc popover fail behavior',
    argTypes: {
        icon: {
            control: {
                type: 'select',
                options: Object.values(IconBehavior)
            }
        },
        popover: {
            control: {
                type: 'select',
                options: Object.values(PopoverBehavior)
            }
        }
    }
};

export default HelpFailBehavior;

const defaultValues = { icon: IconBehavior.SHOWN, popover: PopoverBehavior.FRIENDLY_MSG  };
const Template = ({ icon, popover }) => {
    const options = new EdcPopoverOptions();
    options.failBehavior = { ...new FailBehavior(), icon, popover };
    const edcProperties = { mainKey: 'fr.techad.edc', subKey: 'error.subkey', options };
    const container = document.createElement('div');
    EdcPopover.config(edcConfig);
    EdcPopover.create(container, edcProperties);
    return container;
};

export const EdcHelpFailBehavior = Template.bind({}) as any;
EdcHelpFailBehavior.args = defaultValues;
