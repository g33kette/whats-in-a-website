/* eslint-disable */
import {trainModel, predictClassification} from '../src/services/model';
import {resetStore, prepareVector} from './utils';

beforeEach(async () => {
    await resetStore();
});

afterAll( async () => {
    await resetStore();
});

// Test Bag of Words ---------------------------------------------------------------------------------------------------

it('train', async () => {
    const vector = await prepareVector('The quick brown fox', 'bagOfWords', 'plain');
    // expect(await trainModel(vector, 'safe')); // Just expect no error
});
