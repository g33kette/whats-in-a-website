
/**
 * Prepare Text
 *
 * @param {string} content
 * @return {Promise}
 */
export const prepareText = (content) => {
    return new Promise((resolve) => {
        let preparedTextData = {};
        setTimeout(() => { // TODO Pretending...
            resolve(preparedTextData);
        }, 2000);
    });
};

/**
 * Analyse Content
 *
 * @param {object} textData
 * @return {Promise}
 */
export const analyseContent = (textData) => {
    return new Promise((resolve) => {
        let result = {safe: false, summary: 'Summary of content...'};
        setTimeout(() => { // TODO Pretending...
            resolve(result);
        }, 2000);
    });
};
