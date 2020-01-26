interface GQLError {
  message: string;
}

export interface AnilistResponse<T> {
  data: {
    [key: string]: T;
  };
  errors?: GQLError[];
}

export interface AnilistPagedResponse<T> {
  data: {
    Page: {
      [key: string]: T[];
    };
  };
  errors?: GQLError[];
}
