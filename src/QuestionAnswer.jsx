import React from 'react'
import Answer from './Components/Answer'
const QuestionAnswer = ({ item, index }) => {
  return (
    <div key={index} className={item.type == "q" ? 'flex justify-end' : ''}>
      {
        item.type == "q" ?
          <li key={`q-${index}`} className='my-3 mx-4 text-right p-5 text-l border-4 bg-zinc-700 border-zinc-700 rounded-tl-4xl rounded-bl-4xl rounded-br-4xl w-fit  '><Answer ans={item.text} index={index} type={item.type} TotalResult={1} /></li>
          :
          item.text.map((soultion, soultionindex) => (
            <li key={`a-${index}-${soultionindex}`} className=' text-cyan-500 my-3 mx-4 text-left p-5  text-sm-16xl'><Answer ans={soultion} index={soultionindex} type={item.type} TotalResult={soultion.length} /></li>
          ))
      }
    </div>
  )
}

export default QuestionAnswer
