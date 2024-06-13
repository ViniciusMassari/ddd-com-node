import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities";
import { Answer } from "@/domain/forum/enterprise/entities";
import type { AnswerProps } from "@/domain/forum/enterprise/entities/answer";

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityID,
) {
	const answer = Answer.create(
		{
			authorId: new UniqueEntityID(),
			content: faker.lorem.sentence(),
			questionId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return answer;
}
