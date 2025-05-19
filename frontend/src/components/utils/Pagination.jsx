import { createResource, createSignal, createEffect } from 'solid-js';

function Pagination(props) {
  const [currentPage, setCurrentPage] = createSignal(1)
  const itemsPerPage = props.maxItems;
  // const itemsPerPage = 10;

  const totalPages = () => {
    return Math.ceil(props.items?.length / itemsPerPage);
  }

  const paginatedItems = () => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return props.items?.slice(startIndex, endIndex);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages()) {
      setCurrentPage(page);
    }
  }

  // ?. adalah optional chaining. If the object accessed or function called using this operator is undefined or null, 
  // the expression short circuits and evaluates to undefined instead of throwing an error.
  //
  // info ke parent component apabila terdapat perubahan data pada currentPage, items, dan totalPages
  createEffect(() => {
    props.onPageChange?.({
      currentPage: currentPage(),
      items: paginatedItems(),
      totalPages: totalPages()
    });
  });

  return (
    <div class="w-full flex flex-row justify-between">
      <button onClick={() => handlePageChange(currentPage() - 1)} disabled={currentPage() === 1} class="ml-0.5 cursor-pointer">
        &lt; Previous
      </button>
      <span>Page {currentPage()} of {totalPages()}</span>
      <button onClick={() => handlePageChange(currentPage() + 1)} disabled={currentPage() === totalPages()} class="cursor-pointer">
        Next &gt;
      </button>
    </div>
  )
}

export default Pagination
