import { expect, test } from "vitest";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository";
import { UniqueEntityID } from "@/core/entities";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});
	test("should be able create a question", async () => {
		const result = await sut.execute({
			authorId: "1",
			content: "Example question",
			title: "Example question title",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryQuestionsRepository.items[0]).toEqual(
			result.value?.question,
		);
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toHaveLength(2);
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
		]);
	});
});
