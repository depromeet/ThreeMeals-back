import { IValueObject } from '../../common/IValueObject';

export class EmoticonPosition implements IValueObject {
    positionX: number;
    positionY: number;

    constructor(positionX: number, positionY: number) {
        this.positionX = positionX;
        this.positionY = positionY;
    }
}
