import React, { Component } from 'react'
import { DialogContainer, Button } from 'react-md'
import { cls } from 'reactutils'
import ReactCrop from 'react-image-crop'
import img from 'images/defaultAvatar.png'

import './style.scss'

function image64toCanvasRef (canvasRef, image, pixelCrop) {
  if (canvasRef) {
    const canvas = canvasRef // document.createElement('canvas');

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')
    // const image = new Image()
    // image.src = image64
    // console.log(image, 'imageimage')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
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

  // }
}

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
export default class CropImage extends Component {
  state = {
    crop: {
      aspect: 1 / 1,
    },
    file: null,
  }
  imagePreviewCanvasRef = React.createRef()
  componentDidMount () {}
  handelOnCropChange = (crop) => {
    this.setState({ crop })
  }
  handelImageLoaded = (image) => {
    this.imageRef = image
  }
  handelOnCropComplete = (crop, pixelCrop) => {
    const canvasRef = this.imagePreviewCanvasRef.current
    image64toCanvasRef(canvasRef, this.imageRef, crop)
  }
  uploadCropFile = (e) => {
    // e.preventDefault()
    const canvasRef = this.imagePreviewCanvasRef.current
    const { imgSrc } = this.props
    const fileExtension = extractImageFileExtensionFromBase64(imgSrc)
    const imageData64 = canvasRef.toDataURL('image/' + fileExtension)

    return base64StringtoFile(imageData64, 'photo' + fileExtension)
    // const doFileUpload = () => this.handleFileUpload(file)
    // const { onFileUploaded } = this.props
    // onFileUploaded(doFileUpload, file)
  }
  hide = () => {
    const { onHide } = this.props
    onHide()
  }
  uploadCropImage = () => {
    const { onNewImage } = this.props
    const file = this.uploadCropFile()
    onNewImage(file)
  }
  render () {
    const {
      visible,
      // onHide,
      className,
      imgSrc,
    } = this.props
    const { crop } = this.state
    const actions = [
      { children: 'Cancel', onClick: this.hide },
      <Button key={1} flat primary onClick={this.uploadCropImage}>
        Confirm
      </Button>,
    ]

    return (
      <DialogContainer
        id="crop-image"
        className={cls('crop-image', className)}
        visible={visible}
        // onHide={onHide}
        modal={true}
        title={'Adjust your Image'}
        actions={actions}
        portal={true}
        lastChild={true}
        disableScrollLocking={true}
        renderNode={document.body}
      >
        {imgSrc && (
          <div className="md-grid">
            <div className="md-cell md-cell--6">
              <ReactCrop
                src={imgSrc}
                crop={crop}
                onChange={this.handelOnCropChange}
                onImageLoaded={this.handelImageLoaded}
                onComplete={this.handelOnCropComplete}
              />
            </div>
            <div className="md-cell md-cell--6 crop-image-result">
              <div className="crop-image-wrapper">
                {!crop.width && <img src={img} />}
                <canvas ref={this.imagePreviewCanvasRef} />
              </div>
              <p>See your adjustment here</p>
            </div>
          </div>
        )}
      </DialogContainer>
    )
  }
}
