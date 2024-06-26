import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export interface AnswerCommentRepository {
	create(answerComment: AnswerComment): Promise<void>;
	findById(id: string): Promise<AnswerComment | null>;
	findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]>;
	delete(question: AnswerComment): Promise<void>;
}
