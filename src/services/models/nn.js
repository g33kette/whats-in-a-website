/**
 * https://www.npmjs.com/package/brainjs
 */

import {
    getClassifierData as getClassifierDataFromStore,
    saveClassifier as saveClassifierToStore,
} from '../accessors';
import * as brain from 'brainjs';
import {fixLength} from '../model';


// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {};

// * Classifier Methods  -----------------------------------------------------------------------------------------------

/**
 * Get Classifier
 *
 * @return {Promise<brain.NeuralNetwork>}
 */
const getClassifier = async () => {
    let classifierData = await getClassifierData();
        if (classifierData) {
            const classifier = new brain.NeuralNetwork();
            classifier.train(classifierData);
            return classifier;
    }
    return null;
};

/**
 * Get Classifier Data
 *
 * @return {Promise<[]>}
 */
const getClassifierData = async () => {
    const classifierData = await getClassifierDataFromStore();
    return classifierData&&Object.keys(classifierData).length?classifierData:[];
};

/**
 * Train Model
 *
 * For this implementation, all we do is update data array.
 *
 * @param {array} textVector
 * @param {string} classification
 */
export const trainModel = async (textVector, classification) => {
    const trainingData = {
        input: fixLength(textVector),
        output: {safe: classification==='safe'?1:0, harmful: classification==='safe'?0:1},
    };
    const classifierData = await getClassifierData();
    classifierData.push(trainingData);
    await saveClassifierToStore(null, classifierData);
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
