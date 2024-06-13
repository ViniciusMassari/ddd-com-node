import { FetchQuestionCommentsUseCase } from "./";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityID } from "@/core/entities";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Recent Comments", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentRepository();
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});
	test("it should be able to fetch question answers", async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityID("question-1") }),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityID("question-1") }),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityID("question-1") }),
		);
		const { value } = await sut.execute({
			questionId: "question-1",
			page: 1,
		});

		expect(value?.questionComments).toHaveLength(3);
	});
	test("it should be able to fetch paginated question answers", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityID("question-1") }),
			);
		}
		const { value } = await sut.execute({
			questionId: "question-1",
			page: 2,
		});

		expect(value?.questionComments).toHaveLength(2);
	});
});
