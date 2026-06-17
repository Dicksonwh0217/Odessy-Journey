import { render, screen, fireEvent } from '@testing-library/react'
import JourneyForm from './JourneyForm'

const emptyAnswers = ['', '', '', '', '']

test('renders the first question on mount', () => {
  render(<JourneyForm answers={emptyAnswers} setAnswers={() => {}} onComplete={() => {}} />)
  expect(screen.getByText('What kind of work makes you lose track of time?')).toBeInTheDocument()
})

test('Previous button is disabled on question 1', () => {
  render(<JourneyForm answers={emptyAnswers} setAnswers={() => {}} onComplete={() => {}} />)
  expect(screen.getByText('← Previous')).toBeDisabled()
})

test('Next button shows "Next →" on question 1', () => {
  render(<JourneyForm answers={emptyAnswers} setAnswers={() => {}} onComplete={() => {}} />)
  expect(screen.getByText('Next →')).toBeInTheDocument()
})

test('calls setAnswers when typing in textarea', () => {
  const setAnswers = vi.fn()
  render(<JourneyForm answers={emptyAnswers} setAnswers={setAnswers} onComplete={() => {}} />)
  fireEvent.change(screen.getByPlaceholderText("Write freely. There's no wrong answer here…"), {
    target: { value: 'building things' },
  })
  expect(setAnswers).toHaveBeenCalledWith(['building things', '', '', '', ''])
})
