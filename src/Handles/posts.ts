import {rootdb} from './root';
import {uuid} from '../utils';

// const posts = rootdb.get('posts');

interface ICreateUserPostArgs {
    title: string;
    text?: string;
    location?: string;
    image_hash?: string;
    optimized_image_hash?: string;
}

mapPostsToState = (state, post) => {...state, ...data}

// getters
export const getPostById = (posts, postId: string, cb) => posts.get(postId).load(({_, data}) => cb(data));
export const getAllPosts = (filterFunc?: any) => posts.map(filterFunc);
export const getUserPosts = (userObj: GunInstance) => userObj.get('posts');
export const getAllUserPosts = (userObj: GunInstance, filterFunc?: any) => userObj.get('posts').map(filterFunc);
export const getAllUsersFriendsPosts = (friendsObj: GunInstance, filterFunc?: any) => friendsObj.get('posts').map(filterFunc);

// setters
export const createUserPost = (userObj: GunInstance, args: ICreateUserPostArgs) => {
    const postId = uuid();
    const post = posts.get(postId).put(args);

    getUserPosts(userObj).put({postId: })
    return post;
}

// other
export const deleteUserPost = (userObj: GunInstance, postObj: GunInstance) => {
    userObj.unset(postObj);
    posts.unset(postObj);
}