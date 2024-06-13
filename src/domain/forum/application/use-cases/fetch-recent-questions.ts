import { type Either, right } from "@/core/either";
import type { Question } from "../../enterprise/entities/";
import type { QuestionsRepository } from "../repositories/questions-repository";

interface FetchRecentQuestionsUseCaseRequest {
	page: number;
}
type FetchRecentQuestionsUseCaseResponse = Either<
	null,
	{ questions: Array<Question> | null }
>;

export class FetchRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		page,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({ page });
		return right({ questions });
	}
}
