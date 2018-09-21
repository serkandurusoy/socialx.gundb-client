import {rootdb} from './root';
import {uuid} from '../utils';

const comments = rootdb.get('comments');

interface ICreateComment {
    text: string;
    time: Date;
    tags?: string[];
}

// getters
export const getCommentById = (commentId: string) => comments.get(commentId);
export const getPostComments = (postObj: GunInstance) => postObj.get('comments');
export const getCommentReplys = (commentObj: GunInstance) => commentObj.get('comments');
export const getAllComments = (filterFunc?: any) => comments.map(filterFunc);
export const getAllUserComments = (userObj: GunInstance, filterFunc?: any) => userObj.get('comments').map(filterFunc);

// setters
export const createCommentOnPost = (postObj: GunInstance, args: ICreateComment) => {
    const commentId = uuid();
    const comment = comments.get(commentId).put(args);

    getPostComments(postObj).get(commentId).set(comment);
    return comment;
}

export const createCommentReply = (commentObj: GunInstance, args: ICreateComment) => {
    const commentId = uuid();
    const comment = comments.get(commentId).put(args);

    getCommentReplys(commentObj).get(commentId).set(comment);
    return comment;
}

// other
export const deleteCommentFromPost = (postObj: GunInstance, commentObj: GunInstance) => {
    comments.unset(commentObj);
    getPostComments(postObj).unset(commentObj);
}

export const deleteCommentReply = (commentObj: GunInstance, replyObj: GunInstance) => {
    comments.unset(replyObj);
    getCommentReplys(commentObj).unset(replyObj);
}