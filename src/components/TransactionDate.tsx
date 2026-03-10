interface TransactionDateProps {
  timestamp?: number | null
}

const TransactionDate = ({ timestamp }: TransactionDateProps) => {
  if (!timestamp) {
    return <>N/A</>
  }

  return <>{new Date(timestamp * 1000).toLocaleDateString()}</>
}

export default TransactionDate
