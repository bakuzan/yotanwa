declare module 'meiko/styles/Tooltip' {
  interface CSSLikeObject {
    [selector: string]: any | CSSLikeObject;
  }

  const Style: CSSLikeObject;

  export = Style;
}
