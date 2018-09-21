import {rootdb, user} from './root';
import {uuid} from '../utils';

const users = rootdb.get('users');

interface ICreateUserArgs {
    username: string;
    password: string;
    email: string;
    avatarHash: string;
}

interface IUpdateUserDataArgs {
    password?: string;
    email?: string;
    avatarHash?: string;
}

// getters
export const getUserById = async (userId: string) => {
    const node = await users.get(userId).then();
    return node.put;
};
export const getAllUsers = (filterFunc?: any) => users.map(filterFunc);
export const getUserFriendById = (userId: string, friendId: string) => getUserById(userId).get('friends').get(friendId);
export const getUserFriends = (userId: string, filterFunc?: any) => users.get(userId).get('friends').map(filterFunc);

// setters
export const createUser = (args: ICreateUserArgs) => {
    const {username, password, email, avatarHash} = args;
    return user.create(username, password).get('details').put({email, avatarHash}).then();
}
export const setUserFriend = (userId: string, friendId: string) => {
    const user = getUserById(userId);
    const friend = getUserById(friendId);

    user.get('friends').set(friend);
}
export const updateUserData = (userId: string, args: IUpdateUserDataArgs) => getUserById(userId).put(args);

// other
export const removeUserFriend = (userObj: GunInstance, friendObj: GunInstance) => userObj.unset(friendObj);