import { UnitOfWork } from '../infrastructure/UnitOfWork';

const loadInfra = async ([]: any) => {
    // do nothing
};

export default async (): Promise<void> => {
    await loadInfra([
        UnitOfWork,
    ]);
};
