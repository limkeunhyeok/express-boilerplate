export function expectTokenResponseSucceed({ result }) {
  expect(result).toHaveProperty('_id');
  expect(result).toHaveProperty('email');
  expect(result).toHaveProperty('password');
  expect(result).toHaveProperty('username');
  expect(result).toHaveProperty('nickname');
  expect(result).toHaveProperty('type');
  expect(result).toHaveProperty('createdAt');
  expect(result).toHaveProperty('updatedAt');
}
