import { EdcPopover } from '../edc-popover';

describe('Popover test', () => {
    it('should init', () => {
        const popover = new EdcPopover();

        expect(popover).toBeDefined();
    });
});
