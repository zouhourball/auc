import { useState, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import { Button, DialogContainer, Slider } from 'react-md'

import 'react-image-crop/dist/ReactCrop.css'

function base64StringtoFile (base64String, filename) {
  let arr = base64String.split(',')

  let mime = arr[0].match(/:(.*?);/)[1]

  let bstr = atob(arr[1])

  let n = bstr.length

  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

function extractImageFileExtensionFromBase64 (base64Data) {
  return base64Data.substring(
    'data:image/'.length,
    base64Data.indexOf(';base64'),
  )
}

function image64toCanvasRef (canvasRef, image, pixelCrop) {
  if (canvasRef) {
    const canvas = canvasRef // document.createElement('canvas');

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')
    // const image = new Image()
    // image.src = image64
    // console.log(image, 'imageimage')
    const scaleX = image?.naturalWidth / image?.width
    const scaleY = image?.naturalHeight / image?.height
    // debugger
    // image.onload = function() {
    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    )
  }
}

const ImageCrop = ({ src, visible, setVisible, onConfirm }) => {
  const [crop, setCrop] = useState()
  const [scale, setScale] = useState(50)
  const [imageRef, setImageRef] = useState(null)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const onImageLoad = (e) => {
    setImageRef(e?.currentTarget)
  }

  const uploadCropFile = () => {
    const canvasRef = previewCanvasRef.current

    const fileExtension = extractImageFileExtensionFromBase64(src)
    const imageData64 = canvasRef.toDataURL('image/' + fileExtension)

    return base64StringtoFile(imageData64, 'photo' + fileExtension)
  }

  return (
    <DialogContainer
      visible={visible}
      onHide={() => {
        setVisible(false)
      }}
      focusOnMount={false}
      className="contact-info-dialog"
      title={
        <div className="contact-info-dialog-title">
          {visible?.ownerName}
          <Button
            icon
            onClick={() => {
              setVisible(false)
            }}
          >
            close
          </Button>
        </div>
      }
    >
      <div className="crop-image-container">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          aspect={16 / 9}
          onComplete={(c) => {
            if (imageRef) {
              image64toCanvasRef(previewCanvasRef?.current, imageRef, c)
            }
          }}
        >
          <img
            ref={imgRef}
            src={src}
            style={{
              transform: `scale(${scale / 50})`,
            }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
        <div className="crop-image-zoom">
          <Button
            icon
            primary
            onClick={() => {
              scale > 0 && setScale(scale - 2)
            }}
          >
            plus
          </Button>
          <Slider
            id="crop-image-slider"
            defaultValue={scale}
            min={0}
            max={100}
            onChange={(v) => setScale(v)}
            value={scale}
          />

          <Button
            icon
            primary
            onClick={() => {
              scale < 100 && setScale(scale + 2)
            }}
          >
            minus
          </Button>
        </div>
        <canvas
          ref={previewCanvasRef}
          style={{
            border: '1px solid black',
            objectFit: 'contain',
            display: 'none',
          }}
        />
        <div>
          <Button flat primary swapTheming>
            Cancel
          </Button>
          <Button
            flat
            secondary
            swapTheming
            onClick={() => {
              const file = uploadCropFile()
              onConfirm(file)
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </DialogContainer>
  )
}

export default ImageCrop
