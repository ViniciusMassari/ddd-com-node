import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionComment } from "../../enterprise/entities/";

export interface QuestionCommentRepository {
	create(question: QuestionComment): Promise<void>;
	findById(id: string): Promise<QuestionComment | null>;
	findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]>;
	delete(question: QuestionComment): Promise<void>;
}
