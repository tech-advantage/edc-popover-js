import { container, Lifecycle } from 'tsyringe';

export function provideService<T>(token: new (...args: any[]) => T, lifecycle = Lifecycle.Singleton): T {
    if (container.isRegistered(token)) {
        return container.resolve<T>(token);
    }
    container.register<T>(token, { useClass: token }, { lifecycle });
    return container.resolve<T>(token);
}

export function mock<T>(type: new(...args: any[]) => T, object: any = {}): T {
    const entity: T = new type();
    Object.assign(entity, object);
    return entity;
}

/**
 * Mock a documentation helper
 *
 */
export function mockHelper(): any {
    return {
        label: 'MyTitle',
        description: 'MyDescription',
        articles: [
            {
                label: 'articleLabel1',
                url: 'articleUrl1'
            }
        ],
        links: [
            {
                id: 7,
                label: 'linkLabel1',
                url: 'linkUrl1'
            }
        ],
        language: 'en',
        exportId: 'resolvedPluginId'
    };
}

export const createStoryContainer = (width = '100%', height = '60px', justifyContent = 'space-between', dark?: boolean): HTMLDivElement => {
    const container = document.createElement('div');
    container.style.width = width;
    container.style.height = height;
    container.style.display = 'flex';
    container.style.justifyContent = justifyContent;
    container.style.alignItems = 'center';
    container.style.margin = 'auto 5px';
    if (dark) {
        container.style.backgroundColor = '#999';
    }
    return container;
};
