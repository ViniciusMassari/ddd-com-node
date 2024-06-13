import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository";
import { makeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError } from "@/core/errors/errors";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
	});
	test("it should delete a question by its id", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityID("author-1") },
			new UniqueEntityID("question-1"),
		);
		await inMemoryQuestionsRepository.create(newQuestion);
		await sut.execute({
			questionId: "question-1",
			authorId: "author-1",
		});

		expect(inMemoryQuestionsRepository.items).toHaveLength(0);
	});

	test("it should not delete a question from another user", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityID("author-1") },
			new UniqueEntityID("question-1"),
		);
		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: "question-1",
			authorId: "author-2",
		});
		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
