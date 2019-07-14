import {
    getClassifier as getClassifierFromStore,
    getClassifierData as getClassifierDataFromStore,
    saveClassifier as saveClassifierToStore,
} from '../accessors';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import {fixLength, config as modelConfig} from '../model';

// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    k: 3,
};

// * Classifier Methods  -----------------------------------------------------------------------------------------------

const getClassifier = async () => {
    let classifier = await getClassifierFromStore();
    if (!classifier) {
        classifier = knnClassifier.create();
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
    (await getClassifier()).addExample(tf.tensor(fixLength(textVector)), classification);
    const classifier = await getClassifier();
    await saveClassifierToStore(classifier, extractClassifierData(classifier));
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise<{label: string, confidence: number}|null>}
 */
export const predictClassification = async (textVector) => {
    const classifier = await getClassifier();
    const prediction = await classifier.predictClass(tf.tensor(fixLength(textVector)), config.k);
    if (!prediction || Object.keys(prediction.confidences).length < 2) {
        return null;
    }
    return {label: prediction.label, confidence: prediction.confidences[prediction.label]};
};

/**
 * Extract Classifier Data
 *
 * @param {*} classifier
 * @return {{safe: any, harmful: any}}
 */
function extractClassifierData(classifier) {
    const classifierDataSet = classifier.getClassifierDataset();
    return {
        safe: classifierDataSet.safe?Array.from(classifierDataSet.safe.dataSync()):[],
        harmful: classifierDataSet.harmful?Array.from(classifierDataSet.harmful.dataSync()):[],
    };
}

/**
 * Restore Classifier Data
 *
 * @param {*} classifier
 * @param {*} classifierData
 */
function restoreClassifierData(classifier, classifierData) {
    classifier.setClassifierDataset({
        safe: tf.tensor2d(
            classifierData.safe,
            [classifierData.safe.length / modelConfig.fixedLength, modelConfig.fixedLength]
        ),
        harmful: tf.tensor2d(
            classifierData.harmful,
            [classifierData.harmful.length / modelConfig.fixedLength, modelConfig.fixedLength]
        ),
    });
}
