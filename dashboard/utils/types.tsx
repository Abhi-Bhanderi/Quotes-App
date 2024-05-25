export type QuoteType = {
  date: string;
  video_link: string;
  quote: string;
};

export type QuoteDataType = {
  status: boolean;
  statusCode?: number;
  message: string;
  quote: QuoteType;
};
