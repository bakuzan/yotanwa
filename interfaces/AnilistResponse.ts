interface GQLError {
  message: string;
}

interface AnilistBaseResponse {
  errors?: GQLError[];
}

export interface AnilistResponse<T> extends AnilistBaseResponse {
  data: {
    [key: string]: T;
  };
}

export interface AnilistPagedResponse<T> extends AnilistBaseResponse {
  data: {
    Page: {
      [key: string]: T[];
    };
  };
}

export interface AnilistCollectionResponse<T> extends AnilistBaseResponse {
  data: {
    collection: { lists: [{ entries: T[] }] };
  };
}
