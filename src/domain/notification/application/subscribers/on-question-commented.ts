import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import { CommentOnQuestionEvent } from "@/domain/forum/enterprise/events/comment-on-question-event";
import type { SendNotificationUseCase } from "../use-cases/send-notification";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

export class OnQuestionCommented implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}
	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionCommentednotification.bind(this),
			CommentOnQuestionEvent.name,
		);
	}

	private async sendQuestionCommentednotification({
		questionComment,
	}: CommentOnQuestionEvent) {
		const question = await this.questionsRepository.findById(
			questionComment.questionId.toString(),
		);
		if (question)
			await this.sendNotification.execute({
				recipientId: question.authorId.toString(),
				title: "Comentaram em sua pergunta !",
				content: `Um novo comentário foi feito em sua pergunta ${question.title
					.substring(0, 20)
					.concat("...")}`,
			});
	}
}
