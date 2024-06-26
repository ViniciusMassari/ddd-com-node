import { type Either, right } from "@/core/either";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import type { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{ answerComments: AnswerComment[] }
>;

export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentRepository) {}

	async execute({
		answerId,
		page,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const answerComments =
			await this.answerCommentsRepository.findManyByAnswerId(answerId, {
				page,
			});

		return right({
			answerComments,
		});
	}
}
