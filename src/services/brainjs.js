import {
    getClassifier as getClassifierFromStore,
    getClassifierData as getClassifierDataFromStore,
    saveClassifier as saveClassifierToStore,
} from './accessors';
import * as brain from 'brainjs';


// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    fixedLength: 10000,
};

// * Classifier Methods  -----------------------------------------------------------------------------------------------

const getClassifier = async () => {
    let classifier = await getClassifierFromStore();
        if (!classifier) {
            classifier = new brain.NeuralNetwork();
            // const classifierData = await getClassifierDataFromStore();
            // if (classifierData) {
            //     classifier.setClassifierDataset({
            //         safe: tf.tensor(
            //             classifierData.safe,
            //             [classifierData.safe.length / config.fixedLength, config.fixedLength]
            //         ),
            //         harmful: tf.tensor(
            //             classifierData.harmful,
            //             [classifierData.harmful.length / config.fixedLength, config.fixedLength]
            //         ),
            //     });
            // }
            await saveClassifierToStore(classifier);
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
    await saveClassifierToStore(await getClassifier());
    return true;
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const predictClassification = async (textVector) => {
    const classifier = await getClassifier();
    const output = classifier.run(fixLength(textVector));
    let prediction = null; // { label: null, value: null, confidences: [] };
    for (const label in output) {
        if (output.hasOwnProperty(label)) {
            if (!prediction || prediction.value < output[label]) {
                prediction = {label: label, value: output[label], confidences: output};
            }
        }
    }
    return prediction;
};

/**
 * Fix Length
 *
 * @param {array} vector
 * @return {array}
 */
function fixLength(vector) {
    if (vector.length > config.fixedLength) {
        return vector.slice(0, config.fixedLength);
    } else {
        const expanded = [];
        expanded.push(...vector);
        expanded.push(...(new Array(config.fixedLength-vector.length)).fill(0));
        return expanded;
    }
}
