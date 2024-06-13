import { type Either, right, left } from "@/core/either";
import type { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError, NotAllowedError } from "@/core/errors/errors";

interface DeleteAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
}
type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError, object>;

export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}
	async execute({
		answerId,
		authorId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) return left(new ResourceNotFoundError());

		if (answer.authorId.toValue() !== authorId)
			return left(new NotAllowedError());

		await this.answersRepository.delete(answer);
		return right({});
	}
}
