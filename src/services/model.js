import {
    getClassifier as getClassifierFromStore,
    getClassifierData as getClassifierDataFromStore,
    saveClassifier as saveClassifierToStore,
} from './accessors';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

const fixedLength = 10000;

const getClassifier = async () => {
    let classifier = await getClassifierFromStore();
    if (!classifier) {
        classifier = knnClassifier.create();
        const classifierData = await getClassifierDataFromStore();
        if (classifierData) {
            classifier.setClassifierDataset({
                safe: tf.tensor(
                    classifierData.safe,
                [classifierData.safe.length / fixedLength, fixedLength]
                ),
                harmful: tf.tensor(
                    classifierData.harmful,
                [classifierData.harmful.length / fixedLength, fixedLength]
                ),
            });
        }
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
    (await getClassifier()).addExample(tf.tensor(fixLength(textVector)), classification);
    await saveClassifierToStore(await getClassifier());
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const predictClassification = async (textVector) => {
    const classifier = await getClassifier();
    return await classifier.predictClass(tf.tensor(fixLength(textVector)));
};

/**
 * Fix Length
 *
 * @param {array} vector
 * @return {array}
 */
function fixLength(vector) {
    if (vector.length > fixedLength) {
        return vector.slice(0, fixedLength);
    } else {
        const expanded = [];
        expanded.push(...vector);
        expanded.push(...(new Array(fixedLength-vector.length)).fill(0));
        return expanded;
    }
}
