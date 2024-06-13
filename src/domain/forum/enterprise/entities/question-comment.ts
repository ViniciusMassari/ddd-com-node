import { AggregateRoot, type UniqueEntityID } from "@/core/entities";
import type { Optional } from "@/core/types/optional";
import { Comment, type CommentProps } from "./comment";
import { CommentOnQuestionUseCase } from "../../application/use-cases";
import type { QuestionsRepository } from "../../application/repositories/questions-repository";
import { CommentOnQuestionEvent } from "../events/comment-on-question-event";
export interface QuestionCommentProps extends CommentProps {
	questionId: UniqueEntityID;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
	get questionId() {
		return this.props.questionId;
	}
	static create(
		props: Optional<QuestionCommentProps, "createdAt">,
		id?: UniqueEntityID,
	) {
		const questionComment = new QuestionComment(
			{
				...props,

				createdAt: new Date(),
			},
			id,
		);
		questionComment.addDomainEvent(new CommentOnQuestionEvent(questionComment));
		return questionComment;
	}
}
