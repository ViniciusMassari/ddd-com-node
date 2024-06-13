import { type Either, right, left } from "@/core/either";
import type { Question } from "../../enterprise/entities/";
import type { AnswersRepository } from "../repositories/answers-repository";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors/errors";

interface ChooseQuestionBestAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{ question: Question }
>;

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private questionsRepository: QuestionsRepository,
	) {}
	async execute({
		answerId,
		authorId,
	}: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);
		if (!answer) {
			return left(new ResourceNotFoundError());
		}
		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);
		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== question.authorId.toString())
			return left(new NotAllowedError());

		question.bestAnswerId = answer.id;
		await this.questionsRepository.save(question);

		return right({
			question,
		});
	}
}
