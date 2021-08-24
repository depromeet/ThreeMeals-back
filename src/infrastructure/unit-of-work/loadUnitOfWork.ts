import { TypeOrmUnitOfWork } from './TypeOrmUnitOfWork';

const loadUnitOfWork = async ([]: any) => {
    // do nothing
};

export default async (): Promise<void> => {
    await loadUnitOfWork([
        TypeOrmUnitOfWork,
    ]);
};
