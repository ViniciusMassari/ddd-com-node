import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";

import { DeleteAnswerCommentUseCase } from "./";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError } from "@/core/errors/errors";

let inMemoryQuestionsCommentRepository: InMemoryAnswerCommentRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete answer comment", () => {
	beforeEach(() => {
		inMemoryQuestionsCommentRepository = new InMemoryAnswerCommentRepository();
		sut = new DeleteAnswerCommentUseCase(inMemoryQuestionsCommentRepository);
	});

	test("it should be able to delete a answer comment", async () => {
		const answerComment = makeAnswerComment();

		await inMemoryQuestionsCommentRepository.create(answerComment);

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		});

		expect(inMemoryQuestionsCommentRepository.items).toHaveLength(0);
	});

	test("it should not be able to delete another user answer comment", async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryQuestionsCommentRepository.create(answerComment);

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: "author-2",
		});
		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
