const query = `
query($ids: [Int]) {
    Page {
      characters(id_in: $ids) {
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
