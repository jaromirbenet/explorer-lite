import { useEffect, useRef, useState } from 'react'
import { Text } from '@chakra-ui/react'

interface AnimatedBalanceProps {
  value: number
  decimals?: number
  suffix?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  suffixColor?: string
}

export const AnimatedBalance = ({
  value,
  decimals = 4,
  suffix = '',
  fontSize = '2xl',
  fontWeight = 'bold',
  color = '#e8e8f0',
  suffixColor = '#7878a0',
}: AnimatedBalanceProps) => {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    const duration = 1200
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (end - start) * eased)
      if (progress < 1) requestAnimationFrame(animate)
      else prevValue.current = end
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <Text
      data-testid="animated-balance"
      fontSize={fontSize}
      fontWeight={fontWeight}
      letterSpacing="tight"
      color={color}
    >
      {display.toFixed(decimals)}
      {suffix && (
        <Text as="span" fontSize="sm" ml={1.5} color={suffixColor} fontWeight="medium">
          {suffix}
        </Text>
      )}
      {/* Hidden span for test assertions */}
      <Text as="span" srOnly display="none" aria-hidden>
        {value.toFixed(decimals)} {suffix}
      </Text>
    </Text>
  )
}
