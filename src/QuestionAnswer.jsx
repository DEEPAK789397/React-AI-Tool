
import React from 'react'
import Answer from './Components/Answer'

const QuestionAnswer = ({ item, index }) => {
  return (
    <div
      key={index}
      className={`min-w-0 max-w-full ${
        item.type == "q" ? 'flex justify-end' : ''
      }`}
    >
      {
        item.type == "q" ?
          <li
            key={`q-${index}`}
            className="my-2 mx-2 w-fit min-w-0 max-w-[90%] break-words rounded-tl-2xl rounded-bl-2xl rounded-br-2xl border-2 border-zinc-700 bg-zinc-700 p-3 text-right text-sm sm:my-3 sm:mx-4 sm:max-w-[85%] sm:rounded-tl-4xl sm:rounded-bl-4xl sm:rounded-br-4xl sm:border-4 sm:p-5 sm:text-base"
          >
            <Answer
              ans={item.text}
              index={index}
              type={item.type}
              TotalResult={1}
            />
          </li>
          :
          item.text.map((soultion, soultionindex) => (
            <li
              key={`a-${index}-${soultionindex}`}
              className="my-2 mx-2 min-w-0 max-w-full break-words p-3 text-left text-sm text-cyan-500 sm:my-3 sm:mx-4 sm:p-5 sm:text-base"
            >
              <Answer
                ans={soultion}
                index={soultionindex}
                type={item.type}
                TotalResult={soultion.length}
              />
            </li>
          ))
      }
    </div>
  )
}

export default QuestionAnswer