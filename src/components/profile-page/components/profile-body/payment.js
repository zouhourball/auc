import { useState } from 'react'
import { Button } from 'react-md'

const Payment = () => {
  const [edit, setEdit] = useState(true)

  return (
    <div className="payment md-cell md-cell--8 md-grid">
      <div
        className="md-cell md-cell--12"
        style={{
          borderBottom: '1px solid gray',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h2>Payment</h2>
        <Button icon primary={!edit} onClick={() => setEdit((prev) => !prev)}>
          menu
        </Button>
      </div>
      {[1, 2, 3, 4, 5].map((el) => (
        <div
          key={el}
          className="md-cell md-cell--8"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <div>Lot #124</div>
          <div>12/08/2022 13:11</div>
          <div>14,000 OMR</div>
          <Button flat primary>
            download
          </Button>
        </div>
      ))}
    </div>
  )
}

export default Payment
