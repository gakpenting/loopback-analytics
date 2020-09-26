
import {Entity, model, property} from '@loopback/repository';

@model()
export class Token extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  access_token?: string;

  @property({
    type: 'string',
  })
  refresh_token?: string;
  @property({
    type: 'string',
  })
  scope?: string;
  @property({
    type: 'string',
  })
  token_type?: string;
  @property({
    type: 'number',
  })
  expiry_date?: number;
  constructor(data?: Partial<Token>) {
    super(data);
  }
}

export interface TokenRelations {
  // describe navigational properties here
}

export type TokenWithRelations = Token & TokenRelations;
