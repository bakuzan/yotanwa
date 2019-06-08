import { useEffect, useState } from 'react';

export function useIntersect(imgRef, rootMargin = '50px 0px') {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!imgRef.current || isIntersecting) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry], ob) => {
        if (entry && entry.isIntersecting) {
          setIntersecting(true);
          ob.disconnect();
        }
      },
      {
        rootMargin
      }
    );

    observer.observe(imgRef.current);

    return () => observer && observer.disconnect();
  }, [imgRef, isIntersecting, rootMargin]);

  return isIntersecting;
}
