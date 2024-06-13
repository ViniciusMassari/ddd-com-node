import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
export interface CommentProps {
	authorId: UniqueEntityID;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export abstract class Comment<
	Props extends CommentProps,
> extends Entity<Props> {
	public get authorId(): UniqueEntityID {
		return this.props.authorId;
	}

	get content() {
		return this.props.content;
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	public get updatedAt() {
		return this.props.updatedAt;
	}
	private touch() {
		this.props.updatedAt = new Date();
	}

	public get createdAt() {
		return this.props.createdAt;
	}
}
