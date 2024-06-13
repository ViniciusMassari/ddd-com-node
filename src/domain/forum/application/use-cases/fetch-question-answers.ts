import { type Either, right } from "@/core/either";
import type { Answer } from "../../enterprise/entities/";
import type { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersUseCaseRequest {
	page: number;
	questionId: string;
}
type FetchQuestionAnswersUseCaseResponse = Either<
	null,
	{ answers: Answer[] | null }
>;

export class FetchQuestionAnswersUseCase {
	constructor(private answersRepository: AnswersRepository) {}
	async execute({
		questionId,
		page,
	}: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{
				page,
			},
		);
		return right({ answers });
	}
}
