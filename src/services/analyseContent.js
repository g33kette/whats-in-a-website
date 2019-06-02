import {getVectorSpace, saveVectorSpace} from '../background';
import {predictClassification} from './model';

// * Options -----------------------------------------------------------------------------------------------------------

const vectorType = 'bagOfWords'; // Options: bagOfWords
const wordType = 'plain'; // Options: plain

// * Prepare Text ------------------------------------------------------------------------------------------------------

/**
 * Prepare Text
 *
 * @param {string} content
 * @return {Promise}
 */
export const prepareText = async (content) => {
    return buildVector(parseToNlpDoc(content));
};

/**
 * Parse to NLP Doc
 *
 * @param {string} content
 * @return {object}
 */
const parseToNlpDoc = (content) => {
    const nlp = require('compromise');
    const normaliseOptions = {
        whitespace: true,
        case: true,
        numbers: true,
        punctuation: true,
        unicode: true,
        contractions: true,
        acronyms: true,
        // Enable non-defaults:
        possessives: true,
        plurals: true,
        verbs: true,
    };
    // Return normalised values
    return nlp(content).normalize(normaliseOptions);
};

/**
 * Build Vector
 *
 * @param {object} doc
 * @return {array}
 */
const buildVector = (doc) => {
    const words = convertToListOfWords(doc);
    switch (vectorType) {
        case 'bagOfWords':
        default:
            return bagOfWords(words);
    }
};

/**
 * Convert To List of Words
 *
 * @param {object} doc
 * @return {array}
 */
const convertToListOfWords = (doc) => {
    switch (wordType) {
        case 'plain':
        default:
            return doc.words().out('array').filter((v) => v !== '' && v !== null);
            // remove num? .filter((v) => isNaN(parseFloat(v)));
    }
    // const tagged = doc.out('tags'); // todo
};

/**
 * Generate Vector Space
 *
 * @param {array} words - Array of words, can be string|array|object
 * @return {array}
 * In structure:
 *      [
 *          {
 *              word: ['text', 'tag1', 'tag2'....] : Can be string|array|object
 *              f: 1, : Frequency
 *          },
 *      ]
 */
const generateVectorSpace = (words) => {
    // Get saved vector space
    const vectorSpace = JSON.parse(JSON.stringify(getVectorSpace()));
    // Update vector space with new words
    words.reduce((vs, word) => {
        word = typeof word !== 'object'?[word]:word;
        const lookupIndex = vectorSpaceIndexForWord(word, vs);
        if (lookupIndex >= 0) {
            // Already in vectorSpace, just increment frequency
            vs[lookupIndex].f++;
        } else {
            // New word, create new entry in vector space!
            vs.push({word: word, f: 1});
        }
        return vs;
    }, vectorSpace);

    // If vectorSpace has expanded then save to storage
    if (vectorSpace.length > getVectorSpace().length) {
        saveVectorSpace(vectorSpace);
    }
    return vectorSpace;
};

/**
 * Vector Space Index For Word
 *
 * @param {*} word
 * @param {object} vectorSpace
 * @return {int}
 */
const vectorSpaceIndexForWord = (word, vectorSpace) => {
    word = typeof word !== 'object'?[word]:word;
    const lookup = vectorSpace.find((o) => JSON.stringify(o.word) === JSON.stringify(word));
    return lookup?vectorSpace.indexOf(lookup):-1;
};

/**
 * Bag of Words Vector
 *
 * @param {array} words
 * @return {array}
 */
const bagOfWords = (words) => {
    // Add new words to vector space
    const vectorSpace = generateVectorSpace(words);
    // Create bag of words vector based on vector space, set all values initially to 0
    const bag = vectorSpace.map(() => 0);
    words.reduce((accBag, word) => {
        accBag[vectorSpaceIndexForWord(word, vectorSpace)]++;
        return accBag;
    }, bag);
    // Return array vector
    return bag;
};

// * Analyse Content ---------------------------------------------------------------------------------------------------

/**
 * Analyse Content
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const analyseContent = async (textVector) => {
    try {
        const prediction = await predictClassification(textVector);
        if (Object.keys(prediction.confidences).length < 2) {
            throw new Error();
        }
        return {
            safe: prediction.label === 'safe',
            summary: prediction.label,
            prediction: prediction,
        };
    } catch (e) {
        return {
            safe: null,
            summary: 'Cannot classify content without both safe and harmful examples.',
            prediction: null,
        };
    }
};
