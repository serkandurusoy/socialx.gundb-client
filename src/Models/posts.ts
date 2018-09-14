import {rootdb} from './root';
import {uuid} from '../utils';

const posts = rootdb.get('posts');

interface ICreateUserPostArgs {
    title: string;
    text?: string;
    location?: string;
    image_hash?: string;
    optimized_image_hash?: string;
}

// getters
export const getPostById = (postId: string) => posts.get(postId);
export const getAllPosts = (filterFunc?: any) => posts.map(filterFunc);
export const getUserPosts = (userObj: GunObj) => userObj.get('posts');
export const getAllUserPosts = (userObj: GunObj, filterFunc?: any) => userObj.get('posts').map(filterFunc);
export const getAllUsersFriendsPosts = (friendsObj: GunObj, filterFunc?: any) => friendsObj.get('posts').map(filterFunc);

// setters
export const createUserPost = (userObj: GunObj, args: ICreateUserPostArgs) => {
    const postId = uuid();
    const post = posts.get(postId).put(args);

    getUserPosts(userObj).set(post);
    return post;
}

// other
export const deleteUserPost = (userObj: GunObj, postObj: GunObj) => {
    userObj.unset(postObj);
    posts.unset(postObj);
}