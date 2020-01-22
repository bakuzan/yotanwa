interface GQLError {
  message: string;
}

export interface AnilistResponse<T> {
  data: {
    Page: {
      [key: string]: T[];
    };
  };
  errors?: GQLError[];
}
