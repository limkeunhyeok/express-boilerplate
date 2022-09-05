export function expectTokenResponseSucceed({ result }) {
  expect(result).toHaveProperty('accessToken');
  expect(result).toHaveProperty('refreshToken');
}
