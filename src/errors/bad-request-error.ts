import { ApplicationError } from '@/protocols';

export function badRequestError(): ApplicationError {
  return {
    name: 'BadRequest',
    message: 'Bad Request!',
  };
}
