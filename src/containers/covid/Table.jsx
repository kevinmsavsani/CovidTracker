import React from 'react'
import clsx from 'clsx'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
import 'regenerator-runtime/runtime'

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className='my-3 relative'>
      Search:{' '}
      <input
      className="shadow appearance-none w-40 lg:w-60 sm:max-w-screen-sm border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </div>
  )
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({
    columns,
    data,
  },
    useFilters, 
    useGlobalFilter,
    useSortBy,
    usePagination, 
  )

  const size = ['w-60','w-40','w-40','w-40','w-40','w-40','w-40']

  return (
    <div className='w-full'>
      <div className='h-16'>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      </div>
      <div className='relative'>
      <table {...getTableProps()} className='sm:shadow-2xl border-collapse w-full'>
        <thead className='sm:visible invisible absolute sm:relative bg-green-400 w-full'>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className='border-t-2 border-gray-400 flex flex-row flex-wrap sm:inline-block'>
              {headerGroup.headers.map((column,index) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className={clsx(['items-center text-center text-white capitalize px-2 py-2 ',size[index]])}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {  
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='bg-white shadow-lg sm:shadow-none mb-6 sm:mb-0 flex flex-row flex-wrap cursor-pointer hover:bg-gray-100 sm:flex-no-wrap border-l-2 border-r-2 hover:border-gray-600'>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()} className=' items-center pt-8 sm:pt-0 pb-2 text-center relative w-2/4 border-t border-l sm:border-l-0 border-gray-400 sm:flex-1'><span className=" truncate font-bold font-thin text-xs text-gray-700 uppercase sm:hidden absolute top-0 inset-x-0 p-1 bg-gray-300 pl-2">
                  {cell.render('Header')}
                </span>
                {cell.render('Cell')}
              </td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      <div className="pagination my-5 text-sm inline-flex w-full">
      <span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-1 lg:px-4 mx-1 lg:mx-2 rounded-r">
          First
        </button>      
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-1 lg:px-4 mx-1 lg:mx-2 rounded-l">
          Prev
        </button>
        <button  onClick={() => nextPage()} disabled={!canNextPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-1 lg:px-4 mx-1 lg:mx-2 rounded-r">
          Next
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-1 lg:px-4 mx-1 lg:mx-2 rounded-l">
          Last
        </button>
        </span>
        <span className='text-xs w-15 pt-1 ml-auto'>
          Page{' '}
          <strong>
            {state.pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </div>
  )
}

export default Table;