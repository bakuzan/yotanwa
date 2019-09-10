const query = `
query($search: String!) {
  Page(page: 1, perPage: 10) {
    characters(search: $search) {
      id
      name {
        full
      }
      image {
        medium
      }
    }
  }
}
`;

async function search(search) {
  const body = JSON.stringify({
    query,
    variables: { search }
  });

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });

  return response.json();
}

export default async function searchHandler(req, res) {
  const { term = '' } = req.query;
  const respond = (a) => res.status(200).json(a);

  if (!term) {
    return respond({ items: [], error: 'A search term is required.' });
  }

  try {
    const { data, errors } = await search(term);

    if (errors && errors.length) {
      const error = errors[0].message;
      return respond({ items: [], error });
    }

    const list = []; //data.collection.lists[0].entries;
    return respond({ items: list, error: null });
  } catch (error) {
    console.error(error);
    return respond({
      items: [],
      error: `Something went wrong and your request could not be completed.`
    });
  }
}
