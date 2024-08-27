import { ObjectId } from 'mongodb';
import { ITestCase } from './test-case.interface';
import { ISubmission } from './submissions.interface';

export interface IProblem {
    _id?: ObjectId;
    content: string;
    difficulty?: string;
    topic?: string;
    subdomain?: string;
    test_cases: ITestCase[];
    solved_count?: number;
    submissions?: ISubmission[];
}
