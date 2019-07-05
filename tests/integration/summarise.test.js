/* eslint-disable */

import {summariseText, config as summariseConfig} from '../../src/services/summarise';
import {resetStore,getFileContent} from '../utils';

beforeEach(async () => {
    await resetStore();
    summariseConfig.nPhrases = 10;
});

afterAll( async () => {
    await resetStore();
});

const trainExamples = async (vectorType) => {
    summariseConfig.vectorType = vectorType;
    await summariseText(await getFileContent('/tests/data/examples', 'norwich-stoke-short.txt'));
    await summariseText(await getFileContent('/tests/data/examples', 'peoples-march.txt'));
    await summariseText(await getFileContent('/tests/data/examples', 'still-i-rise.txt'));
    await summariseText(await getFileContent('/tests/data/examples', 'twitter.txt'));
    await summariseText(await getFileContent('/tests/data/examples', 'ywa.txt'));
};

// Test Bag of Words ---------------------------------------------------------------------------------------------------

it('Should summarise text as list using bag of words implementation', async () => {
    //console.log(await getFileContent('/tests/data/examples', 'peoples-march.txt'));
    summariseConfig.vectorType = 'bagOfWords';
    await trainExamples(summariseConfig.vectorType);
    const result = await summariseText(await getFileContent('/tests/data/examples', 'norwich-stoke.txt'));
    expect(result).toEqual([
        [ 'stoke continue revival' ],
        [ 'norwich win' ],
        [ 'klose is' ],
        [ 'goal ensured' ],
        [ 'stoke might' ],
        [ 'unbeaten run' ],
        [ 'it is' ],
        [ 'we deserved' ],
        [ 'we have' ],
        [ 'games like' ]
    ]);
});

// Test TF-IDF ---------------------------------------------------------------------------------------------------------

it('Should summarise text as list using bag of words implementation', async () => {
    summariseConfig.vectorType = 'tfIdf';
    await trainExamples(summariseConfig.vectorType);
    const result = await summariseText(await getFileContent('/tests/data/examples', 'norwich-stoke.txt'));
    expect(result).toEqual([
        [ 'klose is' ],
        [ 'stoke end norwich' ],
        [ 'unbeaten run' ],
        [ 'stoke side' ],
        [ 'victory stretches their unbeaten' ],
        [ 'it is' ],
        [ 'we deserved' ],
        [ 'i would say' ],
        [ 'we have' ],
        [ 'games like' ]
    ]);
});
