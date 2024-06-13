import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository";
import {
	SendNotificationUseCase,
	type SendNotificationUseCaseRequest,
	type SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeQuestion } from "test/factories/make-question";
import type { MockInstance } from "vitest";
import { waitFor } from "test/util/wait-for";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { OnQuestionCommented } from "./on-question-commented";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
	[SendNotificationUseCaseRequest],
	Promise<SendNotificationUseCaseResponse>
>;

describe("On Question Best Answer Chosen", () => {
	beforeAll(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);

		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

		new OnQuestionCommented(
			inMemoryQuestionsRepository,
			sendNotificationUseCase,
		);
	});

	it("should send a notification when question receive a comment", async () => {
		const question = makeQuestion();
		const questionComment = makeQuestionComment({ questionId: question.id });

		inMemoryQuestionsRepository.create(question);
		inMemoryQuestionCommentRepository.create(questionComment);

		await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
	});
});
