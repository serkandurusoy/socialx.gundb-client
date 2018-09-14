import {rootdb} from './root';
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
export const getUserById = (userId: string) => users.get(userId);
export const getAllUsers = (filterFunc?: any) => users.map(filterFunc);
export const getUserFriendById = (userId: string, friendId: string) => getUserById(userId).get('friends').get(friendId);
export const getUserFriends = (userId: string, filterFunc?: any) => users.get(userId).get('friends').map(filterFunc);

// setters
export const createUser = (args: ICreateUserArgs, callback: any) => {
    const newId = uuid();
    return users.get(newId).put(args, callback);
}
export const setUserFriend = (userId: string, friendId: string) => {
    const user = getUserById(userId);
    const friend = getUserById(friendId);

    user.get('friends').set(friend);
}
export const updateUserData = (userId: string, args: IUpdateUserDataArgs) => getUserById(userId).put(args);

// other
export const removeUserFriend = (userObj: GunObj, friendObj: GunObj) => userObj.unset(friendObj);