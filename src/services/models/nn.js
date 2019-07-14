/**
 * https://www.npmjs.com/package/brainjs
 */

import {
    getClassifier as getClassifierFromStore,
    getClassifierData as getClassifierDataFromStore,
    saveClassifier as saveClassifierToStore,
} from '../accessors';
import * as brain from 'brainjs';
import {fixLength} from '../model';


// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {};

// * Classifier Methods  -----------------------------------------------------------------------------------------------

const getClassifier = async () => {
    let classifier = await getClassifierFromStore();
        if (!classifier) {
            classifier = new brain.NeuralNetwork();
            const classifierData = await getClassifierDataFromStore();
            if (classifierData && Object.keys(classifierData).length) {
                restoreClassifierData(classifier, classifierData);
            }
            await saveClassifierToStore(classifier, extractClassifierData(classifier));
    }
    return classifier;
};

/**
 * Train Model
 *
 * @param {array} textVector
 * @param {string} classification
 */
export const trainModel = async (textVector, classification) => {
    const trainingData = [{
        input: fixLength(textVector),
        output: {safe: classification==='safe'?1:0, harmful: classification==='safe'?0:1},
    }];
    (await getClassifier()).train(trainingData);
    const classifier = await getClassifier();
    await saveClassifierToStore(classifier, extractClassifierData(classifier));
    return true;
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise<{label: string, confidence: number}|null>}
 */
export const predictClassification = async (textVector) => {
    const classifier = await getClassifier();
    const output = classifier.run(fixLength(textVector));
    let prediction = null;
    for (const label in output) {
        if (output.hasOwnProperty(label)) {
            if (!prediction || prediction.confidence < output[label]) {
                prediction = {label: label, confidence: output[label]};
            }
        }
    }
    return prediction;
};


/**
 * Extract Classifier Data
 *
 * @param {*} classifier
 * @return {{safe: any, harmful: any}}
 */
function extractClassifierData(classifier) {
    return classifier.toJSON();
}

/**
 * Restore Classifier Data
 *
 * @param {*} classifier
 * @param {*} classifierData
 */
function restoreClassifierData(classifier, classifierData) {
    classifier.fromJSON(classifierData);
}
