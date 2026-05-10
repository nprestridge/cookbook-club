// Shared test utilities for Playwright E2E tests

// Helper function to set mobile viewport (iPhone 15 dimensions)
const setMobileViewport = async (page) => {
  await page.setViewportSize({ width: 393, height: 852 });
};

const mockApiRoutes = async (page,
    recipesApiMock = defaultRecipesApiMock,
    cookbookRecipesApiMock = defaultCookbookRecipesApiMock,
    cookbooksApiMock = defaultCookbooksApiMock) => {
  await page.route('**/cookbooks', (route) => {
    if (route.request().resourceType() === 'document') {
      return route.fallback();
    }
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cookbooksApiMock),
    });
  });

  await page.route('**/recipes', (route) => {
    if (route.request().resourceType() === 'document') {
      return route.fallback();
    }
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipesApiMock),
    });
  });

  await page.route('**/recipes/*/*', (route) => {
    if (route.request().resourceType() === 'document') {
      return route.fallback();
    }
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cookbookRecipesApiMock),
    });
  });
};

const defaultCookbooksApiMock = [
  {
    title: 'Baker\'s Almanac',
    author: 'Cake Expert',
    slug: 'bakers-almanac',
    isoDate: '11/4/2025',
    displayDate: '11/4/2025',
    amazon: 'https://www.amazon.com/link-to-book',
  },
  {
    title: 'Sunday Supper',
    author: 'Home Cook',
    slug: 'sunday-supper',
    isoDate: '4/25/2026',
    displayDate: '4/25/2026',
    blog: 'https://example.com/sunday-supper',
  }
]

const defaultRecipesApiMock = [
  {
    id: 1,
    name: 'Warm Apple Pie',
    cookbook: 'Baker\'s Almanac',
    cook: 'Nina',
    page: 34,
    link: 'https://example.com/apple-pie',
    image: 'https://example.com/apple-pie.jpg'
  },
  {
    id: 2,
    name: 'Rosemary Chicken',
    cookbook: 'Sunday Supper',
    cook: 'Marcus',
    page: 21,
    image: 'https://example.com/rosemary-chicken.jpg'
  },
  {
    id: 3,
    name: 'Apple Cinnamon Muffins',
    cookbook: 'Baker\'s Almanac',
    cook: 'Sarah',
    page: 67,
    link: 'https://example.com/apple-muffins',
    image: 'https://example.com/apple-muffins.jpg'
  }
];

const defaultCookbookRecipesApiMock = [
  {
    id: 1,
    name: 'Warm Apple Pie',
    cookbook: 'Baker\'s Almanac',
    cook: 'Nina',
    page: 34,
    link: 'https://example.com/apple-pie',
    image: 'https://example.com/apple-pie.jpg'
  },
  {
    id: 3,
    name: 'Roasted Vegetables',
    cookbook: 'Baker\'s Almanac',
    cook: 'Rina',
    page: 45,
    link: 'https://example.com/roasted-vegetables',
    image: 'https://example.com/roasted-vegetables.jpg'
  },
  {
    id: 4,
    name: 'Apple Cinnamon Muffins',
    cookbook: 'Baker\'s Almanac',
    cook: 'Sarah',
    page: 67,
    link: 'https://example.com/apple-muffins',
    image: 'https://example.com/apple-muffins.jpg'
  }
];

export {
  setMobileViewport,
  mockApiRoutes,
  defaultRecipesApiMock,
  defaultCookbookRecipesApiMock,
};
