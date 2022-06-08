import { Chip, Typography } from '@mui/material'
import { Chess } from 'chess.js'
import { createContext, FC, useState } from 'react'
import './app.scss'
import Board from './Board'
import Bottom from './Bottom'
import { getChecksCapturesThreats } from './functions/checksCapturesThreats'
import usePosition from './functions/usePosition'
import Help from './Help'
import './moves.scss'

interface MainContextType {
  moves: string[]
  reset: () => void
  position?: string
  answers?: string[]
  showResults: () => void
  helpOpen: boolean
  setHelpOpen: (helpOpen: boolean) => void
}

export const MainContext = createContext<MainContextType>({
  moves: [],
  reset: () => {},
  showResults: () => {},
  helpOpen: false,
  setHelpOpen: () => {},
})

const Main: FC = () => {
  const [moves, setMoves] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>()
  const [helpOpen, setHelpOpen] = useState(true)
  const { position, next } = usePosition()

  const showResults = () => setAnswers(getChecksCapturesThreats(new Chess(position)))

  const reset = () => {
    setMoves([])
    setAnswers(undefined)
    next()
  }

  return (
    <MainContext.Provider
      value={{ moves, reset, position, answers, showResults, helpOpen, setHelpOpen }}
    >
      <div className='mobile-only app'>
        <Typography variant='h5' className='header'>
          {new Chess(position).turn() === 'w' ? 'White' : 'Black'} to move. Find all the checks,
          captures, and threats.
        </Typography>

        <div className='moves'>
          {moves.map(m => (
            <Chip
              key={m}
              label={m}
              color={answers?.includes(m) ? 'success' : 'primary'}
              className='move-chip'
              size={answers ? 'small' : 'medium'}
              onDelete={answers ? undefined : () => setMoves(moves.filter(move => move !== m))}
            />
          ))}
        </div>

        <Board addMove={(move: string) => setMoves(dedupe([...moves, move]))} />
        <Bottom />
        <Help />
      </div>
      <div className='mouse'>
        <Typography>This app works on touchscreen devices only. Try it on your phone!</Typography>
      </div>
    </MainContext.Provider>
  )
}

function dedupe<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

export default Main
