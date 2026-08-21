import type { BusinessType } from "../enums"

export type TransactionSearch = {

    q?:string
    operationId?:string
    amountFrom?:number
    amountTo?:number
    dateFrom?:string
    dateTo?:string
}

export type BusinessProfileSearch = {
  q?: string; // owner name, business name
  businessType?: BusinessType;
  createdFrom?: string;
  createdTo?: string;
};