/* eslint-disable */

import { predictClassification} from '../../src/services/model';
import {resetStore, prepareVector, trainFromFiles} from '../utils';

jest.setTimeout(3600000); // 1 hour

beforeAll(async () => {
    await resetStore();
    await trainFromFiles(
        '/tests/data/training/safe',
        '/tests/data/training/harmful',
        'bagOfWords',
        'plain',
        2); // took 22 s...
});

beforeEach(async () => {
});

afterAll( async () => {
    await resetStore();
});

it('Should train and classify with training data', async () => {
    const prediction = await predictClassification(
         await prepareVector('Manchester United', 'bagOfWords', 'plain')
    );
    expect(prediction.label).toBe('harmful');
});
