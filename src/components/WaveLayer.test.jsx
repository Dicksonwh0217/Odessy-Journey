import { render } from '@testing-library/react'
import WaveLayer from './WaveLayer'

test('renders two images for the seamless scroll loop', () => {
  const { container } = render(
    <WaveLayer src="/assets/wave-back.png" speed={30} opacity={0.45} zIndex={1} bottom="20%" height="30%" />
  )
  const imgs = container.querySelectorAll('img')
  expect(imgs).toHaveLength(2)
  expect(imgs[0].getAttribute('src')).toBe('/assets/wave-back.png')
  expect(imgs[1].getAttribute('src')).toBe('/assets/wave-back.png')
})
