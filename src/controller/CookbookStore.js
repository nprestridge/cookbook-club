let cookbooks = [];

const CookbookStore = {
  setCookbooks(books) {
    cookbooks = books;
  },

  getCookbookBySlug(slug) {
    return cookbooks.find((book) => book.slug === slug);
  },
};

export default CookbookStore;
