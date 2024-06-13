import { type Either, right, left } from "@/core/either";

import type { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors/errors";

interface DeleteQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
}
type DeleteQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	object
>;

export class DeleteQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		questionId,
		authorId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);
		if (!question) return left(new ResourceNotFoundError());

		if (question.authorId.toValue() !== authorId)
			return left(new NotAllowedError());

		await this.questionsRepository.delete(question);
		return right({});
	}
}
