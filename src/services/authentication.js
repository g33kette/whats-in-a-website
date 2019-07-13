/**
 * Authenticate
 *
 * @param {string} username
 * @param {string} password
 * @return {object|null}
 */
export async function authenticate(username, password) {
    // In the future this should do some external authentication request.
    // For this implementation, it just returns a dummy token.
    return {token: '123345'};
}

/**
 * Logout
 *
 * @return {object|null}
 */
export async function logout() {
    // In the future this should do some external invalidate token request.
    // For this implementation, it just returns true.
    return true;
}
