/** Valores monetarios trafegam em decimal (BRL) e sao formatados na borda. */
export type Money = number;

export interface Discount {
  from: Money;
  to: Money;
  percent: number;
}
