import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities";

export class InMemoryQuestionCommentRepository
	implements QuestionCommentRepository
{
	public items: QuestionComment[] = [];

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);
		return questionComments;
	}
	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find(
			(item) => item.id.toString() === id,
		);
		if (!questionComment) return null;
		return questionComment;
	}
	async delete(questionComment: QuestionComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		);

		this.items.splice(itemIndex, 1);
	}

	async create(question: QuestionComment): Promise<void> {
		this.items.push(question);
		DomainEvents.dispatchEventsForAggregate(question.id);
	}
}
