import { collectionIds } from '../constants/collectionsIds';
import {createDatabase, createCollection} from './services'

const init = async () => {
    await createDatabase();
    await createCollection(collectionIds.users);
}

init();