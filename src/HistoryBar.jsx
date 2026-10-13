import React from 'react'

const HistoryBar = ({ localHistory, setSelectedHistory,setlocalHistory}) => {


  const DeleteHistory = () => {
    localStorage.clear()
    setlocalHistory([''])
  }
  return (

    <div className="col-span-1 h-screen overflow-y-auto bg-gradient-to-b from-pink-700 to-violet-800 p-5 text-left">
      <h1 className='flex justify-between text-2xl text-zinc-100'><span className='pb-2xl'>Recent History</span>
        <button onClick={DeleteHistory} className='pr-2 hover:text-amber-50 cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
        </button> </h1>
      <ul className='p-2'>
        {
          localHistory && localHistory.map((item, index) => (
            <li key={index} onClick={() => setSelectedHistory(item)} className='mt-4 pr-2 truncate  hover:bg-zinc-900 rounded-1xl cursor-pointer text-zinc-300'>{item}</li>
          ))
        }
      </ul>
    </div>

  )
}

export default HistoryBar
