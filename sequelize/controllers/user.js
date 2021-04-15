const { models } = require('..');

async function findUser (user_id) {
    // First try to find the record
   const foundUser = await models.user.findOne({where:{user_id: user_id}});
   if (foundUser) {
        return  {found: true, foundUser};
    } else {
        return {found: false}
    }
}

async function updateOrCreate (user_id, newItem) {
    // First try to find the record
   const foundItem = await models.user.findOne({user_id: user_id});
   if (!foundItem) {
        // Item not found, create a new one
        const item = await models.user.create(newItem)
        return  {item, created: true};
    }
    // Found an item, update it
    const item = await models.user.update(newItem, {where:{user_id: user_id}});
    return {item, created: false};
}

module.exports = { findUser, updateOrCreate };