import { render, screen, fireEvent } from '@testing-library/react'
import Result from './Result'

const mockArchetype = {
  name: 'The Drifting Builder',
  description: 'You learn by making things.',
  strengths: ['Learns by doing', 'High creative output'],
  blindSpots: ['Starts more than finishes'],
  paths: ['Indie maker / solopreneur'],
  quest: [
    { day: 1, task: 'List every project.' },
    { day: 7, task: 'Write a 30-day commitment.' },
  ],
}

test('renders archetype name', () => {
  render(<Result archetype={mockArchetype} onRestart={() => {}} />)
  expect(screen.getByText('The Drifting Builder')).toBeInTheDocument()
})

test('renders all strengths', () => {
  render(<Result archetype={mockArchetype} onRestart={() => {}} />)
  expect(screen.getByText('Learns by doing')).toBeInTheDocument()
  expect(screen.getByText('High creative output')).toBeInTheDocument()
})

test('renders all quest days', () => {
  render(<Result archetype={mockArchetype} onRestart={() => {}} />)
  expect(screen.getByText('List every project.')).toBeInTheDocument()
  expect(screen.getByText('Write a 30-day commitment.')).toBeInTheDocument()
})

test('calls onRestart when restart button is clicked', () => {
  const onRestart = vi.fn()
  render(<Result archetype={mockArchetype} onRestart={onRestart} />)
  fireEvent.click(screen.getByText('↺ Restart Journey'))
  expect(onRestart).toHaveBeenCalledTimes(1)
})
