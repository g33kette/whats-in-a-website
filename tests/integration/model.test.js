/* eslint-disable */

import { predictClassification} from '../../src/services/model';
import {resetStore, prepareVector, train} from '../utils';

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
