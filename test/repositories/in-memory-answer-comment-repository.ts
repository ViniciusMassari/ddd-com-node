import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentRepository
	implements AnswerCommentRepository
{
	async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20);

		return answerComments;
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find((item) => item.id.toString() === id);
		if (!answerComment) return null;
		return answerComment;
	}
	async delete(answerComment: AnswerComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		);

		this.items.splice(itemIndex, 1);
	}
	public items: AnswerComment[] = [];

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment);
	}
}
