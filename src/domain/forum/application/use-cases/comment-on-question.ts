import { type Either, right, left } from "@/core/either";

import { UniqueEntityID } from "@/core/entities";
import { QuestionComment } from "../../enterprise/entities/";
import type { QuestionsRepository } from "../repositories/questions-repository";
import type { QuestionCommentRepository } from "../repositories/question-comments-repository";
import { ResourceNotFoundError } from "@/core/errors/errors";

interface CommentOnQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
	content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{ questionComment: QuestionComment }
>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentRepository: QuestionCommentRepository,
	) {}
	async execute({
		authorId,
		content,
		questionId,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = this.questionsRepository.findById(questionId);
		if (!question) return left(new ResourceNotFoundError());
		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityID(authorId),
			questionId: new UniqueEntityID(questionId),
			content,
		});

		await this.questionCommentRepository.create(questionComment);
		return right({ questionComment });
	}
}
