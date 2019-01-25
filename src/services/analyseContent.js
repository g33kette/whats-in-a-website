
/**
 * Prepare Text
 *
 * @param {string} content
 * @return {Promise}
 */
export const prepareText = (content) => {
    return new Promise((resolve) => {
        const nlp = require('compromise');
        let doc = nlp(content);
        // Normalise Values
        doc.normalize();
        // Add POS Tags to output
        const preparedTextData = doc.out('tags');
        resolve(preparedTextData);
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
        let result = {safe: false, summary: JSON.stringify(textData)};
        setTimeout(() => { // TODO Pretending...
            resolve(result);
        }, 2000);
    });
};
