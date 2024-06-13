import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository";
import { DeleteQuestionCommentUseCase } from "./";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError } from "@/core/errors/errors";

let inMemoryQuestionsCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete question comment", () => {
	beforeEach(() => {
		inMemoryQuestionsCommentRepository =
			new InMemoryQuestionCommentRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionsCommentRepository);
	});

	test("it should be able to delete a question comment", async () => {
		const questionComment = makeQuestionComment();

		await inMemoryQuestionsCommentRepository.create(questionComment);

		await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		});

		expect(inMemoryQuestionsCommentRepository.items).toHaveLength(0);
	});

	test("it should not be able to delete another user question comment", async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryQuestionsCommentRepository.create(questionComment);
		const result = await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: "author-2",
		});
		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
