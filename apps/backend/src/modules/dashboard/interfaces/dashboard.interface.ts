export interface ITotal {
  name: string;
  total: string;
}

export interface ITimeTotal {
  year: number;
  month?: number;
  week?: number;
  day?: number;
  count: number;
}

export interface IAnalytics {
  total: ITotal[];
  monthly: Record<string, ITimeTotal[]>;
  weekly: Record<string, ITimeTotal[]>;
  yearly: Record<string, ITimeTotal[]>;
}
