import type { UniqueEntityID } from "@/core/entities";
import type { DomainEvent } from "@/core/events/domain-event";
import type { Answer } from "../entities";

export class AnswerCreatedEvent implements DomainEvent {
	public ocurredAt: Date;
	public answer: Answer;
	getAggregateId(): UniqueEntityID {
		return this.answer.id;
	}

	constructor(answer: Answer) {
		this.answer = answer;
		this.ocurredAt = new Date();
	}
}
