const { models } = require("..");

async function findUser(user_id) {
    // First try to find the record
    const userData = await models.user
        .findOne({ where: { user_id: user_id } })
        .then()
        .catch((e) => {
            console.log(e);
        });
    if (userData) {
        return { found: true, userData };
    } else {
        return { found: false };
    }
}

async function updateOrCreate(user_id, newItem) {
    // First try to find the record
    const foundItem = await models.user
        .findOne({ where:{user_id: user_id }})
        .then()
        .catch((e) => {
            console.log(e);
        });
    if (!foundItem) {
        // Item not found, create a new one
        const item = await models.user.create(newItem).catch((e) => {
            console.log(e);
        });
        return { item, created: true };
    }
    // Found an item, update it
    const item = await models.user
        .update(newItem, { where: { user_id: user_id } })
        .then()
        .catch((e) => {
            console.log(e);
        });
    return { item, created: false };
}

module.exports = { findUser, updateOrCreate };
