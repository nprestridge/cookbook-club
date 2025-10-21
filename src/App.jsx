import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';

/** VIEWS */
import Layout from './view/Layout';
import CookbookList from './view/CookbookList';
import CookbookRecipes from './view/CookbookRecipes';
import Recipes from './view/Recipes';
import Spinner from './view/Spinner';
import Api from './controller/Api';
import CookbookStore from './controller/CookbookStore';

function CookbookRecipesRoute() {
  const [isLoading, setIsLoading] = React.useState(true);
  const { slug } = useParams();

  React.useEffect(() => {
    const book = CookbookStore.getCookbookBySlug(slug);
    if (!book) {
      Api.getCookbooks((books) => {
        CookbookStore.setCookbooks(books);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return <Spinner />;
  }

  const book = CookbookStore.getCookbookBySlug(slug);
  return book ? <CookbookRecipes author={book.author} title={book.title} /> : null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CookbookList />} />
        <Route path="recipes">
          <Route index element={<Recipes />} />
          <Route path=":slug" element={<CookbookRecipesRoute />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
