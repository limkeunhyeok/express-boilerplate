import { Router } from 'express';

export interface Controller {
  readonly path: string;
  readonly router: Router;
}
