export type Query = {
  select: string,
  where?: string,
  timeseries?: {
    step: string,
    startDate: Date,
    endDate: Date
  }
};