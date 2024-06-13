import { expect, test } from "vitest";
import { SendNotificationUseCase } from "./send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Create Notification", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
	});
	test("should be able to send a notification", async () => {
		const result = await sut.execute({
			recipientId: "1",
			content: "Example notification",
			title: "Nova notificação",
		});

		expect(inMemoryNotificationsRepository.items[0]).toEqual(
			result.value?.notification,
		);
	});
});
