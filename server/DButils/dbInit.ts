import { collectionIds } from '../constants/collectionsIds';
import {createDatabase, createCollection} from './services'

export const init = async () => {
    await createDatabase();
    await createCollection(collectionIds.users);
}

init();