import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities";
import { Question } from "@/domain/forum/enterprise/entities";
import type { QuestionProps } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects";

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityID,
) {
	const question = Question.create(
		{
			authorId: new UniqueEntityID(),
			content: faker.lorem.text(),
			title: faker.lorem.sentence(),
			slug: Slug.create("example-question"),
			...override,
		},
		id,
	);

	return question;
}
