import {bagOfWords, tfIdfVector, parseToNlpDoc, updateAndReturnCorpusObject} from './analyseContent';
import {getPhraseCorpus, savePhraseCorpus} from './accessors';

// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    vectorType: 'bagOfWords', // Options: bagOfWords, tfIdf
    nPhrases: 20,
};

/**
 * Summarise Text
 *
 * @param {string} rawText
 */
export const summariseText = async (rawText) => {
    const parsed = parseToNlpDoc(rawText);
    // Initial match pattern... const nounPhrases = parsed.match('#Noun #Verb').out('array');
    const nounPhrases = parsed.match('#Adjective? #Noun #Adjective? #Verb #Adjective? #Noun?').out('array');
    const vector = await buildVector(nounPhrases);
    // Get the indexes of the top weighted phrases
    const topPhraseIndexes = vector
        .map((v, k) => [k, v]) // Convert key => value array to array of [key, value]
        .sort((a, b) => (a[1] > b[1])?-1:1) // sort by weighted value
        .slice(0, config.nPhrases) // Reduce to top nPhrases
        .filter((a) => a[1] > 0) // Ensure only positive values (ie. words in current vector) are returned
        .map((a) => a[0]); // Convert to array of keys
    // Return matching noun phrases
    return (await listAllNounPhrasesInCorpus()).filter((v, k) => topPhraseIndexes.indexOf(k) >= 0);
};

/**
 * List All Noun Phrases In Corpus
 * @return {Promise<any[]>}
 */
const listAllNounPhrasesInCorpus = async () => {
    const corpus = await getPhraseCorpus();
    return corpus.vectorSpace.map((item) => Array.isArray(item.item)?item.item:item.item[0]);
};

/**
 * Build Vector
 *
 * @param {array} nounPhrases
 * @return {array}
 */
const buildVector = async (nounPhrases) => {
    const corpus = await updateAndReturnPhraseCorpus(nounPhrases);
    switch (config.vectorType) {
        case 'tfIdf':
            return await tfIdfVector(nounPhrases, corpus);
        case 'bagOfWords':
        default:
            return await bagOfWords(nounPhrases, corpus);
    }
};

/**
 * Update And Return Phrase Corpus
 *
 * @param {array} phrases - Array of phrases
 * @return {object}
 */
const updateAndReturnPhraseCorpus = async (phrases) => {
    const updatedCorpus = updateAndReturnCorpusObject(phrases, await getPhraseCorpus());
    // Update saved version in local storage storage (no need to wait for save to finish)
    savePhraseCorpus(updatedCorpus);
    return updatedCorpus;
};
