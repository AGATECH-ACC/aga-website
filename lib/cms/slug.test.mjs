import assert from "node:assert/strict"
import test from "node:test"

import { slugifyTitle } from "./slug.mjs"

test("slugifyTitle lowercases words, hyphenates spaces, and strips special characters", () => {
  assert.equal(slugifyTitle("AGA Ventures: Business 系统 2.0!"), "aga-ventures-business-20")
})

test("slugifyTitle returns an empty string for blank titles", () => {
  assert.equal(slugifyTitle("   "), "")
})
