import { Container } from 'typedi';
import { JsonLogger } from '../../logger/JsonLogger';
import { Constructable } from 'typedi/types/types/constructable.type';

export function Logger() {
    return function(object: Constructable<any>, propertyName: string, index?: number) {
        const logger = new JsonLogger(object.name);
        Container.registerHandler({ object, propertyName, index, value: (containerInstance) => logger });
    };
}
