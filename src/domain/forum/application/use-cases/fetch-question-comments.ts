import { type Either, right } from "@/core/either";
import type { QuestionComment } from "../../enterprise/entities/";
import type { QuestionCommentRepository } from "../repositories/question-comments-repository";

interface FetchQuestionCommentsUseCaseRequest {
	page: number;
	questionId: string;
}
type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{ questionComments: QuestionComment[] | null }
>;

export class FetchQuestionCommentsUseCase {
	constructor(private answersRepository: QuestionCommentRepository) {}
	async execute({
		questionId,
		page,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments = await this.answersRepository.findManyByQuestionId(
			questionId,
			{
				page,
			},
		);
		return right({ questionComments });
	}
}
