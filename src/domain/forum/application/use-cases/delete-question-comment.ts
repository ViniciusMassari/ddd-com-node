import { type Either, right, left } from "@/core/either";
import type { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors/errors";

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string;
	questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	object
>;

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentRepository) {}

	async execute({
		authorId,
		questionCommentId,
	}: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment =
			await this.questionCommentsRepository.findById(questionCommentId);

		if (!questionComment) return left(new ResourceNotFoundError());

		if (questionComment.authorId.toString() !== authorId)
			return left(new NotAllowedError());

		await this.questionCommentsRepository.delete(questionComment);

		return right({});
	}
}
