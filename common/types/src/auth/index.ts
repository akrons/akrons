/**
 * Data which will be signed to create an ```ICertifiedUserToken```.
 *
 * @export
 * @interface IUserToken
 */
export interface IUserToken {
    /**
     * Id of the user
     *
     * @type {string}
     * @memberof IUserToken
     */
    userId: string;
    /**
     * Date when the validity from the certificate vanishes.
     *
     * @type {Date}
     * @memberof IUserToken
     */
    validUntil: Date;
    /**
     * Date till the token is renewable.
     *
     * @type {Date}
     * @memberof IUserToken
     */
    renewableUntil: Date;
    /**
     * Randomized salt.
     *
     * @type {string}
     * @memberof IUserToken
     */
    salt: string;
}

/**
 * Token which is send to the client to let him prove his authorization.
 *
 * @export
 * @interface ICertifiedUserToken
 * @extends {IUserToken}
 */
export interface ICertifiedUserToken extends IUserToken {
    /**
     * Signature, to prove the authenticity of the token.
     *
     * @type {string}
     * @memberof ICertifiedUserToken
     */
    sign: string;
}

/**
 * An Login entry, which is stored in the database.
 *
 * @export
 * @interface IAuth
 */
export interface IAuth {
    /**
     * Login name of the user
     *
     * @type {string}
     * @memberof IAuth
     */
    login: string;
    /**
     * Salt used to hash the password.
     *
     * @type {string}
     * @memberof IAuth
     */
    salt: string;
    /**
     * The hashed password
     *
     * @type {string}
     * @memberof IAuth
     */
    hash: string;
    /**
     * Id of the user.
     *
     * @type {string}
     * @memberof IAuth
     */
    userId: string;
}

/**
 * Request body, to change password.
 *
 * @export
 * @interface IChangePasswordRequest
 */
export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
