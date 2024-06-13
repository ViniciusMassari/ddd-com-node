import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	constructor(
		private questionsAttachmentRepository: QuestionAttachmentsRepository,
	) {}
	async findManyRecent({ page }: PaginationParams) {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);
		return questions;
	}
	async save(question: Question): Promise<void> {
		const itemsIndex = this.items.findIndex((item) => item.id === question.id);
		this.items[itemsIndex] = question;
		DomainEvents.dispatchEventsForAggregate(question.id);
	}
	async delete(question: Question): Promise<void> {
		const itemsIndex = this.items.findIndex((item) => item.id === question.id);
		this.questionsAttachmentRepository.deleteManyByQuestionId(
			question.id.toString(),
		);
		this.items.splice(itemsIndex, 1);
	}
	async findById(id: string): Promise<Question | null> {
		const question = this.items.find((item) => item.id.toValue() === id);
		if (!question) return null;

		return question;
	}
	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);
		if (!question) return null;
		return question;
	}
	public items: Question[] = [];
	async create(question: Question): Promise<void> {
		this.items.push(question);
		DomainEvents.dispatchEventsForAggregate(question.id);
	}
}
