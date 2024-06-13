import { type Either, right, left } from "@/core/either";
import type { AnswersRepository } from "../repositories/answers-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import type { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { ResourceNotFoundError } from "@/core/errors/errors";

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
	ResourceNotFoundError,
	{ answerComment: AnswerComment }
>;

export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerCommentsRepository: AnswerCommentRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityID(authorId),
			answerId: new UniqueEntityID(answerId),
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({
			answerComment,
		});
	}
}
