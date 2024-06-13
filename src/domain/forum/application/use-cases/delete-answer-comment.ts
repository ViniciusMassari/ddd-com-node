import { type Either, left, right } from "@/core/either";
import type { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors/errors";

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string;
	answerCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	object
>;

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentRepository) {}

	async execute({
		authorId,
		answerCommentId,
	}: DeleteAnswerCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment =
			await this.answerCommentsRepository.findById(answerCommentId);

		if (!questionComment) {
			return left(new ResourceNotFoundError());
		}

		if (questionComment.authorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}

		await this.answerCommentsRepository.delete(questionComment);
		return right({});
	}
}
