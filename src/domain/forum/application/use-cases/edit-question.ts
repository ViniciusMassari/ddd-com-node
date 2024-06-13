import { type Either, right, left } from "@/core/either";
import { QuestionAttachment, type Question } from "../../enterprise/entities";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors/errors";
import type { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { UniqueEntityID } from "@/core/entities";

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	NotAllowedError | ResourceNotFoundError,
	{ question: Question }
>;

export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}
	async execute({
		content,
		questionId,
		title,
		authorId,
		attachmentsIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);
		if (!question) return left(new ResourceNotFoundError());

		if (question.authorId.toValue() !== authorId)
			return left(new NotAllowedError());

		const currentQuestionAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

		const questionAttachmentList = new QuestionAttachmentList(
			currentQuestionAttachments,
		);

		const questionAttachments = attachmentsIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				questionId: question.id,
			});
		});

		questionAttachmentList.update(questionAttachments);

		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentList;
		await this.questionsRepository.save(question);
		return right({ question });
	}
}
