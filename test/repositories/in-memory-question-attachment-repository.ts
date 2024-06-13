import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities";

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		);
		this.items = questionAttachments;
	}
	public items: QuestionAttachment[] = [];

	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() === questionId,
		);
		return questionAttachments;
	}
}
