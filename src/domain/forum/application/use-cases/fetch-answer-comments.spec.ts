import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository();
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to fetch answer comments", async () => {
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityID("answer-1"),
			}),
		);

		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityID("answer-1"),
			}),
		);

		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityID("answer-1"),
			}),
		);

		const { value } = await sut.execute({
			answerId: "answer-1",
			page: 1,
		});

		expect(value?.answerComments).toHaveLength(3);
	});

	it("should be able to fetch paginated answer comments", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId: new UniqueEntityID("answer-1"),
				}),
			);
		}

		const { value } = await sut.execute({
			answerId: "answer-1",
			page: 2,
		});

		expect(value?.answerComments).toHaveLength(2);
	});
});
