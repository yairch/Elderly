const DButils = require('./DButils')
const {collectionIds} = require('./constants/collections')

const init = async () => {
    await DButils.createDatabase();
    await DButils.createCollection(collectionIds.users);
}

init();