const KEYWORDS = {
  driftingBuilder:     ['build', 'create', 'code', 'website', 'app', 'business', 'startup', 'product', 'ai'],
  hiddenCreator:       ['content', 'video', 'writing', 'design', 'art', 'youtube', 'tiktok', 'storytelling'],
  searchingStrategist: ['career', 'money', 'job', 'future', 'confused', 'lost', 'direction', 'study'],
}

export function computeArchetype(answers) {
  const text = answers.join(' ').toLowerCase()

  const scores = Object.fromEntries(
    Object.entries(KEYWORDS).map(([key, words]) => [
      key,
      words.filter(word => text.includes(word)).length,
    ])
  )

  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) return 'driftingBuilder'

  // Priority order matches Object.entries order: driftingBuilder > hiddenCreator > searchingStrategist
  return Object.keys(scores).find(key => scores[key] === maxScore)
}
