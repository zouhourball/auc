import { useState, useRef, useEffect } from 'react'

import { TextField } from 'react-md'
// import { Slider } from 'material-ui-slider'
import { Range, getTrackBackground } from 'react-range'
import onClickOutside from 'react-onclickoutside'
import './style.scss'

const PriceRange = ({
  minSalary,
  maxSalary,
  onChangeSlider,
  onFinalChange,
  price,
}) => {
  const [values, setValue] = useState({ min: 0, max: 5000 })
  // const { min, max } = values
  const ref = useRef()
  useEffect(() => {
    price && setValue(price)
  }, [])
  PriceRange.handleClickOutside = () => onFinalChange()

  return (
    <div className="salary-range">
      <div className="salary-range-body">
        <div className={'salary-range-wrapper'}>
          <Range
            ref={ref}
            step={50}
            min={0}
            max={5000}
            values={[
              values.min > 5000 ? 5000 : values.min,
              values.max > 5000 ? 5000 : values.max,
            ]}
            onChange={(v) => {
              setValue({ min: v[0], max: v[1] })
              onChangeSlider(values)
            }}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: '60px',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: '3px',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                      values: [+values.min, +values.max],
                      colors: ['#7c7c7c', '#5078e1', '#7c7c7c'],
                      min: 0,
                      max: 5000,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            /*

            */
            renderThumb={({ props, index, isDragged }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '15px',
                  width: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0px 2px 6px #AAA',
                  outline: 'none',
                }}
              >
                {/* <ThumbLabel
                  rangeRef={ref.current}
                  values={[+values.min, +values.max]}
                  index={index}
                /> */}
                <div
                  style={{
                    display: 'block',
                    position: 'absolute',
                    top: '-20px',
                    color: '#7c7c7c',
                    fontWeight: 'normal',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    // ...(labelStyle as React.CSSProperties),
                  }}
                >
                  {values[Object.keys(values)[index]]}
                </div>
                <div
                  style={{
                    height: '15px',
                    width: '15px',
                    borderRadius: '50%',
                    backgroundColor: isDragged ? '#5e7bf6' : '#fff',
                    borderColor: '#527bde',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />
              </div>
            )}
            // {...values?.min && values?.max ? onFinalChange : {}}
          />
        </div>
        <div className="slider-range">
          <span className="min">
            <TextField
              type="text"
              className="price-range-textField"
              placeholder="0"
              rightIcon={<span>OMR</span>}
              value={values?.min}
              onChange={(v) =>
                v >= 0 && v <= values.max && setValue({ ...values, min: v })
              }
              block
            />
          </span>
          -
          <span className="max">
            <TextField
              type="text"
              className="price-range-textField"
              placeholder="0"
              rightIcon={<span>OMR</span>}
              value={values?.max}
              onChange={(v) => v >= 0 && setValue({ ...values, max: v })}
              block
            />
          </span>
        </div>
      </div>
    </div>
  )
}
const clickOutsideConfig = {
  handleClickOutside: () => PriceRange.handleClickOutside,
}
export default onClickOutside(PriceRange, clickOutsideConfig)
// function ThumbLabel ({ rangeRef = Range | null, values, index }) {
//   const [labelValue] = useThumbOverlap(
//     rangeRef,
//     values,
//     index,
//     1,
//     // ' - ',
//     // (value) => `${value}`,
//   )
//   console.log(labelValue, 'labelValue')
//   return (
//     <div
//       data-label={index}
//       style={{
//         display: 'block',
//         position: 'absolute',
//         top: '-20px',
//         color: '#7c7c7c',
//         fontWeight: 'normal',
//         fontSize: '14px',
//         whiteSpace: 'nowrap',
//         // ...(labelStyle as React.CSSProperties),
//       }}
//     >
//       {labelValue}
//     </div>
//   )
// }
