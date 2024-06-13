export class Slug {
	public value: string;
	private constructor(value: string) {
		this.value = value;
	}

	static create(slug: string) {
		return new Slug(slug);
	}

	/**
	 * Takes a string and normalize it.
	 * Example:
	 * @param {string} text - The text that will be normalized, for example: "A Text Example"
	 * @returns {Slug}  An instance of class Slug with the normalized text: "a-text-example"
	 */
	static createSlugFromText(text: string): Slug {
		const slugText = text
			.normalize("NFKD")
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/_+/g, "-")
			.replace(/--+/g, "-");

		return new Slug(slugText);
	}
}
