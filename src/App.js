import "./App.css";
import NewsManager from "./services/news";
// import NewsList from "./components/news_list/news_list";
// import Categories from "./components/categories/categories";
// import { useCallback, useState } from "react";
import { Route, Routes } from "react-router";
import NewsPages from "./components/news_pages/news_pages";

const newsManager = new NewsManager(process.env.REACT_APP_API_KEY);

function App() {
  // const [category, setCategory] = useState("all");
  // const onSelect = useCallback((category) => setCategory(category), []);

  // return (
  //   <>
  //     <Categories category={category} onSelect={onSelect}></Categories>
  //     <NewsList newsManager={newsManager} category={category} />
  //   </>
  // );

  return (
    <Routes>
      <Route
        path='/:category'
        element={<NewsPages newsManager={newsManager} />}
      />
      <Route path='/' element={<NewsPages newsManager={newsManager} />} />;
    </Routes>
  );
}

export default App;
