import { type Either, right, left } from "@/core/either";
import type { Question } from "../../enterprise/entities/";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "@/core/errors/errors";

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
	ResourceNotFoundError,
	{ question: Question | null }
>;

export class GetQuestionBySlugUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionsRepository.findBySlug(slug);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		return right({ question });
	}
}
