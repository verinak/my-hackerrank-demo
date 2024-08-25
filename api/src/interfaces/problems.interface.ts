import { ObjectId } from 'mongodb';
import { ITestCase } from './test-case.interface';

export interface IProblem {
    _id?: ObjectId;
    content: string;
    difficulty?: string;
    topic?: string;
    test_cases: ITestCase[]
}
