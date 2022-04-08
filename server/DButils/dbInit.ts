import { collectionIds } from '../constants/collectionsIds';
import { UserRole } from '../types/user';
import {createDatabase, createCollection} from './services'
import { insertUser } from './user';

export const init = async () => {
    await createDatabase();
    await createCollection(collectionIds.users);
    await insertUser('admin', '$2b$05$ou04etToRigixhRJJHAgV.VA5AT4ym1q1t1V6WsBYWEZlUPJaykNO', UserRole.Admin, '')
}

init();