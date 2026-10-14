import React, { useEffect, useState, useRef } from 'react'
import HistoryBar from './HistoryBar'
import QuestionAnswer from './QuestionAnswer'

const App = () => {
  const [data, setData] = useState()
  const [answer, SetAnswer] = useState([])
  const [localHistory, setlocalHistory] = useState(JSON.parse(localStorage.getItem('history')))
  const [selectedHistory, setSelectedHistory] = useState()
  const [Loader, SetLoader] = useState(false)
  const DataRef = useRef()
  const HandleData = async () => {

    if (!data && !selectedHistory) {
      return false
    }


    const payloadData = data ? data : selectedHistory
    const Payload = {
      contents: [
        {
          parts: [
            {
              text: payloadData
            }
          ]
        }
      ]
    }
    if (data) {
      if (localStorage.getItem('history')) {
        let storage = JSON.parse(localStorage.getItem('history'))
        storage = [data, ...storage]
        localStorage.setItem('history', JSON.stringify(storage))
        setlocalHistory(storage)
      } else {
        localStorage.setItem('history', JSON.stringify([data]))
        setlocalHistory([data])
      }

    }

    SetLoader(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to get AI response")
      }

      let DataResult = result.candidates[0].content.parts[0].text

      DataResult = DataResult.split("* ")
      DataResult = DataResult.map((item) => item.trim())

      SetAnswer((prevAnswer) => [
        ...prevAnswer,
        { type: "q", text: payloadData },
        { type: "a", text: DataResult }
      ])

      setData("")

      setTimeout(() => {
        if (DataRef.current) {
          DataRef.current.scrollTop = DataRef.current.scrollHeight
        }
      }, 500)

    } catch (error) {
      console.error("AI request failed:", error)
      alert(error.message || "Something went wrong. Please try again.")

    } finally {
      SetLoader(false)
    }

  }
  console.log(localHistory)



  const IsEnter = (event) => {
    if (event.key === "Enter") {
      HandleData()
    }
  }
  useEffect(() => {
    console.log(selectedHistory)
    HandleData()
  }, [selectedHistory])
  return (
    <div className="grid grid-cols-5 min-h-screen w-full bg-zinc-950 text-center">
      <HistoryBar localHistory={localHistory} setSelectedHistory={setSelectedHistory} setlocalHistory={setlocalHistory} />


      <div className="col-span-4 flex h-screen min-h-0 flex-col overflow-hidden bg-zinc-950">
        <h1 className='text-5xl m-4 text-shadow-lg p-2 bg-clip-text text-transparent bg-gradient-to-r from bg-pink-600 to-violet-700 '>
          Hello User,Ask Me Anything
        </h1>
        {
          Loader ? <div className="flex items-center justify-center p-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          </div> : null
        }

        <div
          ref={DataRef}
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className='text-zinc-100'>

            <ul>
              {
                answer.map((item, index) => (
                  <QuestionAnswer key={index} item={item} index={index} />
                ))
              }
            </ul>
            {/* <ul>
              {
                answer && answer.map((item, index) => (
                  <li key={index + Math.random()} className='text-left p-5 '><Answer ans={item} index={index} TotalResult={answer.length} /></li>
                ))
              }
            </ul> */}
          </div>
        </div>
        <div className="mx-auto mb-4 flex w-1/2 shrink-0 items-center rounded-4xl border border-zinc-600 bg-zinc-800 pr-3 text-center text-white">
          <input
            value={data || ""}
            onKeyDown={IsEnter}
            onChange={(event) => setData(event.target.value)}
            className="w-full rounded-l-4xl bg-transparent p-5 text-white outline-none placeholder:text-zinc-400"
            placeholder="Enter Anything"
          />          <button onClick={HandleData} className="m-r-10 rounded-full bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-500 transition duration-200 cursor-pointer">Ask</button>
        </div>

      </div>

    </div>
  )
}

export default App
