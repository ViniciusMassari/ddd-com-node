import type { UniqueEntityID } from "@/core/entities";
import type { DomainEvent } from "@/core/events/domain-event";
import type { QuestionComment } from "../entities";

export class CommentOnQuestionEvent implements DomainEvent {
	public ocurredAt: Date;
	public questionComment: QuestionComment;

	constructor(questionComment: QuestionComment) {
		this.questionComment = questionComment;
		this.ocurredAt = new Date();
	}

	getAggregateId(): UniqueEntityID {
		return this.questionComment.id;
	}
}
