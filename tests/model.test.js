/* eslint-disable */

import {trainModel, predictClassification} from '../src/services/model';
import {resetStore, prepareVectors, prepareVector} from './utils';

beforeEach(async () => {
    await resetStore();
});

afterAll( async () => {
    await resetStore();
});

// Test Bag of Words ---------------------------------------------------------------------------------------------------

it('Should train and classify very basic text', async () => {
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

// Test TF-IDF ---------------------------------------------------------------------------------------------------------

it('Should train and classify very basic text', async () => {
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

// Methods -------------------------------------------------------------------------------------------------------------

async function train(safeTexts, harmfulTexts, vectorType, wordType) {
    const safe = await prepareVectors(safeTexts, vectorType, wordType);
    for (const vector of safe) {
        await trainModel(vector, 'safe');
    }
    const harmful = await prepareVectors(harmfulTexts, vectorType, wordType);
    for (const vector of harmful) {
        await trainModel(vector, 'harmful');
    }
}