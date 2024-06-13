import { makeAnswer } from "test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
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

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
	[SendNotificationUseCaseRequest],
	Promise<SendNotificationUseCaseResponse>
>;

describe("On Answer created", () => {
	beforeAll(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);

		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();

		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);

		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

		new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
	});

	it("should send a notification when an new answer is created", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		inMemoryQuestionsRepository.create(question);
		inMemoryAnswersRepository.create(answer);

		await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
	});
});
