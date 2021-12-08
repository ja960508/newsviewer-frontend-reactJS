import React from "react";
import { useParams } from "react-router";
import Categories from "../categories/categories";
import NewsList from "../news_list/news_list";

const NewsPages = ({ newsManager }) => {
  const params = useParams();
  const category = params.category || "all";

  return (
    <>
      <Categories />
      <NewsList newsManager={newsManager} category={category} />
    </>
  );
};

export default NewsPages;
