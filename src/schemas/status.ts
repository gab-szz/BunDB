import { Type } from '@sinclair/typebox';

export const StatusSchema = Type.Object({
  status: Type.Literal('OK'),
});
