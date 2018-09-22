import * as Gun from 'gun/gun';

import {gun, user} from './root';

interface ICreateUserArgs {
    username: string;
    password: string;
    email: string;
    avatarHash: string;
    recovery: {
        question1: string;
        question2: string;
        reminder: string;
    }
}

interface IUpdateUserDataArgs {
    password?: string;
    email?: string;
    avatarHash?: string;
}

/**
 * TODO
 * 0. add the remaining current user data on the creation? what is the remaining data?
 * 1. user data update
 * 2. adding other users as friends (this includes pending relations.. etc)
 * 3. relate user data on this (posts / comments) with the current user instance
 * 4. remove a trusted user? lol seems to be an issue since the soul is create on the other client 
 * we cannot control it unless we change our keys but that will result in everyone trusted to be removed from the whitelist
 */

/**
 * user recovery concept
 * since the user creation is done by the client and only the client knows about the details (server only stores the public cryptographic keys technically)
 * we can ask the user 3 questions to finalize the sign in process
 * example
 * 1. teacher => what was the name of your first teach
 * 2. live => where were you raised/born
 * 3. reminder => what reminds you of your password
 * then we process the data like this
 * encrypt(reminder, work(teacher, live));
 * 
 * the above is provided by gun.sea encryption
 * and what it does is that it pairs teacker + live and lock the reminder on them
 * so next time the user forgets his password, we ask these questions and they get back their reminder (notice here we are not going to return the actual password because of sec reasons / will change in the future)
 */

// getters

/**
 * private sector
 */

const getUserByAlias = (alias: string) => gun.get('alias/' + alias);

/**
 * public sector
 */

 /**
  * return the current user
  * @return ??
  */
export const getCurrentUser = () => {
    // what do we return?
    // since we want to abstract the gun instance

    // if the user is authenticate the imported 'user' instance will always be the current user
    // return user;

    // another option we have here is get the public current user which is
    // return gun.get('alias/' + user.is.alias);
}

/**
 * check if there is a user logged in
 * @return a boolean
 */
export const isUserLoggedIn = () => !!user.is;

// setters

/**
 * create a new user
 * @param args an oject collection of the user data
 * @return a promise to be resolved with the current user instance (@GunUserInstance)
 */
export const createUser = async (args: ICreateUserArgs) => {
    const {username, password, email, avatarHash} = args;

    const createRecovery = async () => {
        const recover = await Gun.Sea.encrypt(args.recovery.reminder, await Gun.Sea.work(args.recovery.question1, args.recovery.question2));

        user.get('settings').put({
            // personal data
            email,
            avatar: avatarHash,
            // recovery stuff here
            recover,
            q1: args.recovery.question1.length,
            q2: args.recovery.question2.length,
        });
    }

    // start the creation process here
    user.create(username, password, (ack: any) => {
        if (ack.wait) {
            // we wait? what do we do here
        } else if (ack.err) {
            throw new Error('could\'nt create a new user => ' + ack.err);
        } else {
            // we authenticate the user
            user.auth(args.username, args.password, async (userInstance) => {
                // after the user is authenticate we create their recovery setting
                await createRecovery();
                // we return the userInstance in a promise
                return new Promise(resolve => resolve(userInstance));
            });
        }
    });
}

/**
 * authenticate the user
 * @param username a string containing the username
 * @param passphrase a string containing a password/passphrase
 * @param callback an optional callback after the user authentication
 */
export const loginUser = (username: string, passphrase: string, callback?: (user: GunUserInstance, gun: GunInstance & GunUserInstance & PromiseObj) => void) => {
    return user.auth(username, passphrase, callback);
}

/**
 * log the user out
 * @return a promise to be resolved into a user instance (@GunUserInstance)
 */
export const logoutUser = () => user.leave();

/**
 * change the current user password
 * @param oldPassword a string containing the old password
 * @param newPassword a string containing the new password
 * @param callback the callback after the password change happened
 */
export const changePassword = (oldPassword: string, newPassword: string, callback?: () => void) => {
    if (!user.is) {
        throw new Error('a user needs to be logged in in-order to proceed');
    }

    return user.auth(user.is.alias, oldPassword, callback, {change: newPassword});
}

/**
 * try and recover the user's reminder phrase
 * @param alias a string containing the user's username/alias
 * @param question1 a string containing the answer for their recovery question1
 * @param question2 a string containing the answer for their recovery question2
 * @param callback a mandator callback that carries on the recovery phrase the user first entered on signin
 * @return a void
 */
export const recoverUser = (alias: string, question1: string, question2: string, callback: (hint: string) => void) => {
    const doRecovery = async (data: string) => {
        try {
            const hint = await Gun.Sea.decrypt(data, await Gun.Sea.work(question1, question2));
            callback(hint);
        } catch (e) {
            throw new Error('could\'nt capture the user\'s recovery key => ' + e.message);
        }
    };

    // we can use docLoad here, but it will be non preformant and useless because
    // it will load the whole doc when we only need a specific thing
    // all this does is iterate through the user and get the recovery doc and pass to the doRec func
    getUserByAlias(alias)
        .once().map()
        .get('settings')
        .get('recover')
        .once(doRecovery)
}

/**
 * this function allows the 'governance' to function properly (if something is created privately the trusted user is able to see that)
 * @param alias a string containing the username/alias of the targeted user to trust
 */
export const trustUser = (alias: string) => {
    if (!user.is) {
        throw new Error('a user needs to be logged in in-order to proceed');
    }

    // get('alias/') is the root for all users on the gun core user api
    // we get the user here from it and we pass on the trust zone
    const trustedUser = gun.get('alias/' + alias);
    return user.trust(trustedUser);
}