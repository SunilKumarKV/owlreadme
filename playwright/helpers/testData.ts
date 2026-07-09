export const TEST_USERS = {
  VALID: 'octocat',
  INVALID: 'this_is_an_invalid_github_username_that_should_not_exist_12345',
} as const;

export const MOCK_PROJECT = {
  NAME: 'Test E2E Project Workspace',
  TYPE: 'combined' as const,
} as const;

export const MOCK_SHARE_PAYLOADS = {
  README_DATA: 'eyJuYW1lIjoiU3VuaWwiLCJyb2xlIjoiQ1RPIiwiYWJvdXQiOiJXb3JraW5nIG9uIGNvZGViYXNlcyJ9',
  ROADMAP_DATA: 'eyJ0aXRsZSI6IkpTIFJvYWRtYXAiLCJzdGVwcyI6WyJMZWFybiBiYXNpYyBzeW50YXgiLCJMZWFybiBwcm9taXNlcyJdfQ==',
} as const;
