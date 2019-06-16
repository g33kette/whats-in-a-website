/* eslint-disable */
import {prepareText, config as analyseContentConfig} from '../src/services/analyseContent';
import {resetStore} from './utils';

beforeEach(async () => {
    await resetStore();
});

afterAll( async () => {
    await resetStore();
});

// Test Bag of Words ---------------------------------------------------------------------------------------------------

it('Parses a simple sentence to a bag of words / plain words representation', async () => {
    analyseContentConfig.vectorType = 'bagOfWords';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([1,1,1,1]);
});

it('Parses multiple simple sentences to a combined bag of words / plain words representation', async () => {
    analyseContentConfig.vectorType = 'bagOfWords';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([1,1,1,1]);
    expect(await prepareText('The quick brown fox jumps over')).toEqual([1,1,1,1,1,1]);
    expect(await prepareText('The quick brown fox jumps over the lazy dog.'))
        .toEqual([2,1,1,1,1,1,1,1]);
});

// Test TF-IDF ---------------------------------------------------------------------------------------------------------

it('Parses a simple sentence to a tf-idf / plain words representation', async () => {
    analyseContentConfig.vectorType = 'tfIdf';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([0.5,0.5,0.5,0.5]);
});

it('Parses multiple simple sentences to a combined tf-idf / plain words representation', async () => {
    analyseContentConfig.vectorType = 'tfIdf';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([0.5,0.5,0.5,0.5]);
    expect(await prepareText('The quick brown fox jumps over')).toEqual([
        0.32177535615289915,
        0.32177535615289915,
        0.32177535615289915,
        0.32177535615289915,
        0.5412219880468178,
        0.5412219880468178,
    ]);
    expect(await prepareText('The quick brown fox jumps over the lazy dog.')).toEqual([
        0.3369607874680181,
        0.24533501901928448,
        0.24533501901928448,
        0.24533501901928448,
        0.34441786389361506,
        0.34441786389361506,
        0.4840672903116227,
        0.4840672903116227,
    ]);
});
