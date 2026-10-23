
import React, { useEffect, useState, useRef } from 'react'
import HistoryBar from './HistoryBar'
import QuestionAnswer from './QuestionAnswer'

const App = () => {
  const [data, setData] = useState('')
  const [answer, SetAnswer] = useState([])
  const [localHistory, setlocalHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('history')) || []
    } catch {
      return []
    }
  })
  const [selectedHistory, setSelectedHistory] = useState('')
  const [Loader, SetLoader] = useState(false)

  const DataRef = useRef(null)
  const inputRef = useRef(null)
  const isLoadingRef = useRef(false)

  const HandleData = async (question = data) => {
    const payloadData = (question || '').trim()

    // Do not send an empty question or duplicate requests.
    if (!payloadData || isLoadingRef.current) {
      return
    }

    isLoadingRef.current = true
    SetLoader(true)

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

    // Save new questions in browser history.
    if (question === data && data.trim()) {
      try {
        const storage = JSON.parse(localStorage.getItem('history')) || []
        const updatedHistory = [
          payloadData,
          ...storage.filter(item => item !== payloadData)
        ]

        localStorage.setItem('history', JSON.stringify(updatedHistory))
        setlocalHistory(updatedHistory)
      } catch (error) {
        console.error('Could not save history:', error)
      }
    }

    // Clear the input only for a newly submitted question.
    if (question === data) {
      setData('')
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Payload)
      })

      // Read as text first so HTML/server errors do not cause JSON parsing errors.
      const responseText = await response.text()
      let result

      try {
        result = JSON.parse(responseText)
      } catch {
        throw new Error(
          `The server returned an invalid response (HTTP ${response.status}). Check your Vercel deployment and logs.`
        )
      }

      if (!response.ok) {
        const errorMessage =
          typeof result.error === 'string'
            ? result.error
            : result.error?.message ||
            result.message ||
            JSON.stringify(result.error || result)

        throw new Error(
          errorMessage || `Request failed with status ${response.status}`
        )
      }

      const DataResult =
        result.candidates?.[0]?.content?.parts
          ?.map(part => part.text || '')
          .join('')

      if (!DataResult) {
        throw new Error(
          result.error?.message ||
          result.promptFeedback?.blockReason ||
          'The AI returned no text. Please try another question.'
        )
      }

      // Split the answer into list items when Gemini uses "* " formatting.
      const formattedResult = DataResult
        .split('* ')
        .map(item => item.trim())
        .filter(Boolean)

      SetAnswer(prevAnswer => [
        ...prevAnswer,
        { type: 'q', text: payloadData },
        { type: 'a', text: formattedResult }
      ])

      setSelectedHistory('')

      // Scroll to the latest answer.
      setTimeout(() => {
        if (DataRef.current) {
          DataRef.current.scrollTop = DataRef.current.scrollHeight
        }
      }, 100)
    } catch (error) {
      console.error('AI request failed:', error)
      alert(error.message || 'Something went wrong. Please try again.')
    } finally {
      isLoadingRef.current = false
      SetLoader(false)

      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const IsEnter = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      HandleData()
    }
  }

  // Automatically send a question when the user selects history.
  useEffect(() => {
    if (selectedHistory) {
      HandleData(selectedHistory)
    }
  }, [selectedHistory])

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-zinc-950 text-center text-white md:grid-cols-5">

      <HistoryBar
        localHistory={localHistory}
        setSelectedHistory={setSelectedHistory}
        setlocalHistory={setlocalHistory}
      />

      <div className="col-span-1 flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden bg-zinc-950 md:col-span-4">

        <h1 className="mx-3 my-3 bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text p-2 text-2xl font-bold text-transparent sm:mx-4 sm:text-3xl md:text-4xl lg:text-5xl">
          Hello User, Ask Me Anything
        </h1>

        {Loader && (
          <div className="flex shrink-0 items-center justify-center p-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          </div>
        )}

        <div
          ref={DataRef}
          className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="min-w-0 text-zinc-100">
            <ul className="min-w-0">
              {answer.map((item, index) => (
                <QuestionAnswer
                  key={index}
                  item={item}
                  index={index}
                />
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mb-3 flex w-[94%] min-w-0 shrink-0 items-center rounded-2xl border border-zinc-600 bg-zinc-800 pr-2 sm:mb-4 sm:w-11/12 sm:rounded-3xl md:w-3/4 lg:w-1/2">

          <input
            ref={inputRef}
            value={data}
            onKeyDown={IsEnter}
            onChange={event => setData(event.target.value)}
            disabled={Loader}
            className="min-w-0 flex-1 rounded-l-2xl bg-transparent p-3 text-sm text-white outline-none placeholder:text-zinc-400 sm:rounded-l-3xl sm:p-4 sm:text-base md:p-5"
            placeholder="Enter anything..."
          />

          <button
            type="button"
            onClick={() => HandleData()}
            disabled={Loader || !data.trim()}
            className="m-1 shrink-0 rounded-full bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50 sm:m-2 sm:px-5 sm:text-base"
          >
            Ask
          </button>

        </div>
      </div>
    </div>
  )
}

export default App