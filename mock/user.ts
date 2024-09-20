import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body;
      if (username === 'admin' && password === '123456') {
        return {
          code: 0,
          message: 'Login successful',
          data: {
            token: Mock.Random.guid(),
            user: {
              username: 'admin',
              name: 'Admin User'
            }
          }
        };
      } else {
        return {
          code: 1,
          message: 'Invalid username or password',
        };
      }
    },
  },
] as MockMethod[];
