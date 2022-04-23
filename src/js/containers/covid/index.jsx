import React from 'react'
import { useSelector } from 'react-redux';
import Table from './table.js'

function Covid() {
  const items = useSelector((store) => store.items);

  const columns = React.useMemo(() => [
    {
      Header: "Name of State/UT",
      accessor: 'location',
    },
    {
      Header: "Total Active",
      accessor: 'totalActive',
    },
    {
      Header: "Active Change since yesterday",
      accessor: 'activeChange',
    },
    {
      Header: "Cured Cumulative",
      accessor: 'curedCumulative',
    },
    {
      Header: "Cured Change since yesterday",
      accessor: 'curedChange',
    },
    {
      Header: "Deaths Cumulative",
      accessor: 'deathsCumulative',
    },
    {
      Header: "Deaths Change since yesterday",
      accessor: 'deathsChangeTotal',
    },
  ], [])

  return (
    <div className='flex flex-col w-full h-10/12 justify-center items-center'>
      <div className="flex flex-col sm:flex-row text-xs font-bold gap-10">
        <div className="w-32 h-16 bg-blue-300 rounded-lg">
          <div className='text-center text-base py-1'>Active</div>
          <div className='text-center py-1'>{items.reduce((accumulator, object) => {return accumulator + (+object.totalActive)}, 0)} ({items.reduce((accumulator, object) => {return accumulator + (+object.activeChange)}, 0)})</div>
        </div>
        <div className="w-32 h-16 bg-green-300 rounded-lg">
          <div className='text-center text-base py-1'>Discharged</div>
          <div className='text-center py-1'>{items.reduce((accumulator, object) => {return accumulator + (+object.curedCumulative)}, 0)} ({items.reduce((accumulator, object) => {return accumulator + (+object.curedChange)}, 0)})</div>
        </div>
        <div className="w-32 h-16 bg-red-300 rounded-lg">
          <div className='text-center text-base py-1'>Deaths</div>
          <div className='text-center py-1'>{items.reduce((accumulator, object) => {return accumulator + (+object.deathsCumulative)}, 0)} ({items.reduce((accumulator, object) => {return accumulator + (+object.deathsChangeTotal)}, 0)})</div>
        </div>
      </div>
      <div className='mt-20 mb-5 justify-center items-center text-3xl'>State Data</div>
      <Table columns={columns} data={items} />
    </div>
  );
}

export default Covid;