import "./App.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchItems } from "./api/items";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function App() {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, error, status, hasNextPage } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className="common-container">
      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>{error.message}</div>
      ) : (
        <div className="p-5 m-2 max-w-5xl w-full flex flex-col bg-dark-3 items-center overflow-scroll custom-scrollbar">
          {data?.pages?.map((page) => {
            return (
              <div
                key={page.currentPage}
                className="flex flex-1 flex-col gap-1 w-full"
              >
                {page.data.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="w-full py-5 px-2 m-1 bg-dark-4 border border-white rounded-lg"
                    >
                      <h1>{item.name} </h1>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {hasNextPage ? (
            <div className="mt-2 text-red" ref={ref}>
              Lodaing...
            </div>
          ) : (
            <div className="mt-2 text-red">Reached the end of the page</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
