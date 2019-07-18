/* eslint-disable */

import {predictClassification, config as modelConfig} from '../../src/services/model';
import {resetStore, prepareVector, train} from '../utils';

beforeEach(async () => {
    await resetStore();
});

afterAll( async () => {
    await resetStore();
});

// Test Knn -----------------------------------------------------------------------------------------------

it('Should train and classify very basic text using knn classifier with frequency weightings', async () => {
    modelConfig.modelType = 'knn';
    await train([
        'The quick brown fox',
        'The quick fish',
        'The quick cat',
    ], [
        'The lazy dog',
        'The stupid dog',
    ], 'bagOfWords', 'plain');
    const prediction = await predictClassification(
        await prepareVector('Very lazy dog', 'bagOfWords', 'plain')
    );
    expect(prediction.label).toBe('harmful');
});

it('Should train and classify very basic text using knn classifier with tf-idf weightings', async () => {
    modelConfig.modelType = 'knn';
    await train([
        'The quick brown fox',
        'The quick fish',
        'The quick cat',
    ], [
        'The lazy dog',
        'The stupid dog',
    ], 'tfIdf', 'plain');
    const prediction = await predictClassification(
        await prepareVector('Very lazy dog', 'tfIdf', 'plain')
    );
    expect(prediction.label).toBe('harmful');
});

// Test Nn -----------------------------------------------------------------------------------------------

it('Should train and classify very basic text using nn classifier with frequency weightings', async () => {
    modelConfig.modelType = 'nn';
    modelConfig.fixedLength = 1000; // Stops it taking ages to train...
    await train([
        'The quick brown fox',
        'The quick fish',
        'The quick cat',
    ], [
        'The lazy dog',
        'The stupid dog',
    ], 'bagOfWords', 'plain');
    const prediction = await predictClassification(
        await prepareVector('Very lazy dog', 'bagOfWords', 'plain')
    );
    expect(prediction.label).toBe('harmful');
});

it('Should train and classify very basic text using nn classifier with tf-idf weightings', async () => {
    modelConfig.modelType = 'nn';
    modelConfig.fixedLength = 1000; // Stops it taking ages to train...
    await train([
        'The quick brown fox',
        'The quick fish',
        'The quick cat',
    ], [
        'The lazy dog',
        'The stupid dog',
    ], 'tfIdf', 'plain');
    const prediction = await predictClassification(
        await prepareVector('Very lazy dog', 'tfIdf', 'plain')
    );
    expect(prediction.label).toBe('harmful');
});

// Test Nbayes -----------------------------------------------------------------------------------------------

it('Should train and classify very basic text using nbayes classifier with frequency weightings', async () => {
    modelConfig.modelType = 'nbayes';
    await train([
        'The quick brown fox',
        'The quick fish',
        'The quick cat',
    ], [
        'The lazy dog',
        'The stupid dog',
    ], 'bagOfWords', 'plain');
    const prediction = await predictClassification(
        await prepareVector('Very lazy dog', 'bagOfWords', 'plain')
    );
    expect(prediction.label).toBe('harmful');
});

it('Should train and classify very basic text using nbayes classifier with tf-idf weightings', async () => {
    modelConfig.modelType = 'nbayes';
    await train([
        'The quick brown fox',
        'The quick fish',
        'The quick cat',
    ], [
        'The lazy dog',
        'The stupid dog',
    ], 'tfIdf', 'plain');
    const prediction = await predictClassification(
        await prepareVector('Very lazy dog', 'tfIdf', 'plain')
    );
    expect(prediction.label).toBe('harmful');
});
