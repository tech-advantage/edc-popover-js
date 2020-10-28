import { Animations, AnimationType, PopoverPlacement, PopoverPlacements } from 'edc-popover-utils';
import { EdcPopoverOptions } from '../class';
import EdcPopover from '../index';
import { copyDefinedProperties } from '../utils/global.utils';
import { createStoryContainer } from '../utils/test.utils';

const booleanControl = {
    control: {
        type: 'inline-radio',
        options: [true, false]
    }
};
const HelpKeys = {
    title: 'Edc popover options',
    argTypes: {
        placement: {
            control: {
                type: 'select',
                options: PopoverPlacements
            }
        },
        hideOnClick: booleanControl,
        interactive: booleanControl,
        trigger: {
            control: {
                type: 'select',
                options: ['click', 'mouseenter']
            }
        },
        displayPopover: booleanControl,
        displaySeparator: booleanControl,
        displayTitle: booleanControl,
        displayArticles: booleanControl,
        displayRelatedTopics: booleanControl,
        displayTooltip: booleanControl,
        delay: {
            control: {
                type: 'number'
            }
        },
        animation: {
            control: {
                type: 'select',
                options: Animations
            }
        },
    }
};

export default HelpKeys;

// Configuration example
const edcConfig = {
    pluginId: 'edc',
    docPath: '/doc',
    helpPath: 'https://demo.easydoccontents.com/help',
    i18nPath: './doc/i18n',
    /* you can define global options here options: { placement: 'left', ..... }
    {
      placement?: Placement;
      customClass?: string;
      appendTo?: string | HTMLElement;
     }
     */
};
const defaultValues = {
    placement: PopoverPlacement.AUTO,
    hideOnClick: true,
    interactive: true,
    trigger: 'click',
    displayPopover: true,
    displaySeparator: true,
    displayTitle: true,
    displayArticles: true,
    displayRelatedTopics: true,
    displayTooltip: true,
    delay: 0,
    animation: AnimationType.SHIFT_AWAY
};
const Template = (srcOptions: EdcPopoverOptions) => {
    const options = copyDefinedProperties<EdcPopoverOptions>(new EdcPopoverOptions(), srcOptions);
    const edcProperties = { mainKey:'fr.techad.edc', subKey: 'help.center', options };
    const container = createStoryContainer();
    const parent1 = document.createElement('div');
    const parent2 = document.createElement('div');
    container.appendChild(parent1);
    container.appendChild(parent2);
    EdcPopover.config(edcConfig);
    EdcPopover.create(parent1, edcProperties);
    EdcPopover.create(parent2, edcProperties);
    return container;
};

export const EdcOptions = Template.bind({});
EdcOptions.args = defaultValues;
