import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentRepository();

		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository,
		);
	});

	it("should be able to comment on question", async () => {
		const question = makeQuestion();

		await inMemoryQuestionsRepository.create(question);

		await sut.execute({
			questionId: question.id.toString(),
			authorId: question.authorId.toString(),
			content: "Comentário teste",
		});

		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
			"Comentário teste",
		);
	});
});
