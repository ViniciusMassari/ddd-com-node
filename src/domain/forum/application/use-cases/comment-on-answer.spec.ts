import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository();

		sut = new CommentOnAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerCommentsRepository,
		);
	});

	it("should be able to comment on answer", async () => {
		const answer = makeAnswer();

		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			answerId: answer.id.toString(),
			authorId: answer.authorId.toString(),
			content: "Comentário teste",
		});

		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
			"Comentário teste",
		);
	});
});
