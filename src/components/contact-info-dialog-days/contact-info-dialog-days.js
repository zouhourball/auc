import { useEffect, useState } from 'react'
import { Button, Checkbox, DialogContainer } from 'react-md'
import './style.scss'

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const ContactInfoDialogdays = ({ visible, onHide, onConfirm, checkedDays }) => {
  const [checked, setChecked] = useState([])
  const handleChange = (day) => {
    // test if day in checked ? // remove : //

    //  setChecked(prev => prev.includes(day) ? [...prev.splice(day, 1), prev] : [...prev, day])
    setChecked((prev) =>
      prev?.includes(day) ? prev.filter((el) => el !== day) : [...prev, day],
    )
  }
  useEffect(() => {
    checkedDays?.length > 0 && setChecked(checkedDays)
  }, [checkedDays])
  // const handleChange = (day) => {
  //   // test if day in checked ? // remove : //

  //   setChecked(prev => {
  //     if (prev.includes(day)) { prev.splice(day, 1) } else [...prev,day]

  //     // prev.includes(day) ? prev.splice(day, 1) : [...prev, day]
  //   }

  //   )
  // }

  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info-dialog md-cell md-cell--3"
    >
      <div>
        <div>
          <div>
            <h3>Select Days</h3>{' '}
          </div>
          <div>
            <div className="days">
              <div className="owner-card md-cell md-cell--3">
                {days.map((day, i) => (
                  <Checkbox
                    id={`${day}-${i}`}
                    key={i}
                    checked={checked?.includes(day)}
                    label={day}
                    onChange={() => handleChange(day)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="owner-card md-cell ">
          <Button
            flat
            primary
            swapTheming
            className="auction-details-btn"
            onClick={() => {
              onConfirm(checked)
              onHide()
            }}
          >
            Confirm
          </Button>
          <Button
            flat
            primary
            swapTheming
            className="auction-details-btn"
            onClick={onHide}
          >
            cancel
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}

export default ContactInfoDialogdays
