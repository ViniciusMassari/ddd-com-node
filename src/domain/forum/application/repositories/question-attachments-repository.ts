import type { QuestionAttachment } from "../../enterprise/entities/";

export interface QuestionAttachmentsRepository {
	findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
	deleteManyByQuestionId(questionId: string): Promise<void>;
}
