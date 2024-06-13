import {expect, test} from "vitest"
import { Slug } from "./slug"

test("Should be able to create a slug from a text", () =>{
    const slug = Slug.createSlugFromText("Example Question Title")
    const expected = "example-question-title"

    expect(slug.value).toEqual(expected);
})