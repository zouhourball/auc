import { useEffect, useState } from 'react'

import { useDropzone } from 'react-dropzone'
import { pdfjs } from 'react-pdf'
import { cls } from 'reactutils'
import { Button, FontIcon, DialogContainer } from 'react-md'
// import { useSelector } from 'react-redux'
import { uploadFileTus, fileDownloadTus } from 'libs/api/tus-upload'
import { useTranslation } from 'libs/langs'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import store from 'libs/store'

import './style.scss'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const UploadImages = ({
  key,
  multiple,
  icon,
  title,
  subTitle,
  accept,
  listFiles = [],
  className,
  titleContent,
  titleUpload,
  addTitle,
  onAddAction,
  iconPreview,
  iconDelete,
  iconDownload,
  onDrop,
  setListFiles,
  onRemoveFile,
  withIconDoc,
  onSelectDefault,
  selected,
  cover,
}) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState([])
  const [fileSrc, setFileSrc] = useState('')
  // const downloadToken = useSelector(({ bayen }) => bayen.downloadToken)
  const [loading, setLoading] = useState(false)
  const downloadToken = store?.getState()?.app?.dlToken

  const onDropFiles = (fls) => {
    let newFiles = []

    setLoading(true)
    Promise.all(
      fls.map((f) =>
        uploadFileTus(f, null, (res) => {
          newFiles = [
            ...newFiles,
            {
              id: res?.url,
              url: res?.url,
              size: res?.file?.size?.toString(),

              fileName: res?.file?.name,
              type: res?.file?.type,
            },
          ]
        }),
      ),
    ).then((res) => {
      setLoading(false)
      setFiles([...newFiles])

      setListFiles &&
        setListFiles(
          [
            // ...files,
            ...res.map((r) => ({
              url: r.url,
              type: r?.file?.type,
              options: r.options,
              size: r._size,
            })),
          ],
          'add',
        )
      onDrop &&
        onDrop([
          ...files,
          ...res.map((r) => ({
            url: r.url,
            type: r.file.type,
            options: r.options,
            size: r._size,
          })),
        ])
    })
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: accept,
    onDrop: onDropFiles,
    multiple,
  })
  const onRemove = (index, file) => {
    if (onRemoveFile) {
      onRemoveFile(files, 'delete', file?.url)
    } else {
      const array = files
      array.splice(index, 1)
      setFiles(array)
      setListFiles(array, 'delete', file?.url)
    }
  }
  const chooseCover = (file) => {
    let newFiles = files?.map((el) =>
      el === file ? { ...file, cover: true } : { ...el, cover: false },
    )
    setFiles(newFiles)
    setListFiles(newFiles)
  }
  useEffect(() => {
    listFiles && setFiles(listFiles)
  }, [listFiles])

  const preview = (file) => {
    setFileSrc(file)
  }

  const renderDocumentIcon = (file) => {
    let extension = file && file?.url?.split('.').reverse()
    if (
      [
        'doc',
        'docx',
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(extension[0])
    ) {
      return (
        <div className="docs-icon-area" title="name">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-word mdi-36px`}
            className="color-mdi-office"
          />
        </div>
      )
    }
    if (
      [
        'xlsx',
        'xls',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].includes(extension[0])
    ) {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-excel mdi-36px`}
            className="color-mdi-xls"
          />
        </div>
      )
    }
    if (extension[0] === 'pdf') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi  mdi-file-pdf mdi-36px`}
            className="color-mdi-file-pdf"
          />
        </div>
      )
    }
    if (extension[0] === 'zip') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-zip-box mdi-36px`}
            className="color-mdi-zip-box"
          />
        </div>
      )
    }
    if (extension[0] === 'js') {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-language-javascript mdi-36px`}
          />
        </div>
      )
    }
    if (extension[0] === 'html') {
      return (
        <div className="docs-icon-area">
          <FontIcon icon iconClassName={`mdi mdi-language-html5 mdi-36px`} />
        </div>
      )
    }
    if (['jpg', 'png', 'svg', 'jpeg', 'gif', 'jfif'].includes(extension[0])) {
      return (
        <div className="docs-icon-area">
          <FontIcon
            icon
            iconClassName={`mdi mdi-file-image mdi-36px`}
            className="color-mdi-img"
          />
        </div>
      )
    } else {
      return (
        <div className="docs-icon-area">
          <FontIcon icon iconClassName={`mdi mdi-file mdi-36px`} />
        </div>
      )
    }
  }

  // const renderFilesWithIcon = () => {
  //   return files.map((file, index) => (
  //     <div key={index} className={'images'}>
  //       {renderDocumentIcon(file)}
  //       <div title={file && file.file_name} className="images-filename">
  //         {(file && file.file_name) || 'N/A'}
  //       </div>
  //     </div>
  //   ))
  // }

  const renderFiles = () => {
    return files?.map((file, index) => (
      <div
        key={index}
        className={'upload-images'}
        onClick={() => {
          cover && !selected && chooseCover(file)
        }}
      >
        {cover && (
          <div className="cover">
            <div className="button-cover">{t('set_cover')}</div>
          </div>
        )}
        {iconDownload && (
          <FontIcon
            onClick={() => fileDownloadTus(file?.url, file?.fileName)}
            className="download-btn"
          >
            download
          </FontIcon>
        )}
        {file?.type !==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          file?.type !==
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
          iconPreview && (
            <FontIcon onClick={() => preview(file)} className="preview-btn">
              remove_red_eye
            </FontIcon>
          )}
        {iconDelete && (
          <FontIcon
            icon
            onClick={(e) => {
              e.stopPropagation()
              onRemove(index, file)
            }}
            className="close-btn"
          >
            cancel
          </FontIcon>
        )}
        {cover && file?.cover && <div className="cover-tag">Cover</div>}
        {onSelectDefault && (
          <Button
            icon
            primary={file.selected}
            className="setDefaultBtn"
            tooltipLabel={t('Main picture')}
            tooltipPosition="right"
            onClick={(e) => {
              e.preventDefault()
              onSelectDefault(file.url)
            }}
          >
            {file.selected ? 'radio_button_checked' : 'radio_button_unchecked'}
          </Button>
        )}
        {file?.type === 'application/pdf' ? (
          // .pdf

          <>
            {' '}
            <div className="box">
              <FontIcon
                icon
                iconClassName={`mdi mdi-file-pdf`}
                title={file?.options?.metadata?.filename}
              />
              <div className="file">
                <div className="file-name">
                  {file?.options?.metadata?.filename}
                </div>{' '}
                <div className="file-size">{file?.size}</div>
              </div>
            </div>
          </>
        ) : (
          // <Document
          //   className="imgPdfWrapper"
          //   file={`${file.url}?token=${downloadToken}&view=true`}
          //   onLoadSuccess={() => {}}
          //   options={{
          //     withCredentials: true,
          //   }}
          // >
          //   <Page pageNumber={1} />
          // </Document>
          <>
            {file?.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? ( // .doc, .docs
                <FontIcon className="word-doc">description</FontIcon>
              ) : (
              <>
                {file?.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? ( // .xlsx
                    <FontIcon className="xlsx-doc">file_present</FontIcon>
                  ) : (
                    <img src={`${file?.url}?token=${downloadToken}&view=true`} />
                  )}
              </>
              )}
          </>
        )}
      </div>
    ))
  }
  // -------------------

  const renderFilesWithIcon = () => {
    return files.map((file, index) => (
      <div key={index} className={'img-item'}>
        <div className="icons">
          {iconDownload && (
            <FontIcon
              onClick={() => fileDownloadTus(file?.url, file?.fileName)}
              className="download-btn"
            >
              download
            </FontIcon>
          )}
          {file.document_type === 'image/png' && iconPreview && (
            <FontIcon onClick={() => preview(file)} className="preview-btn">
              remove_red_eye
            </FontIcon>
          )}
          {file.document_type === 'application/pdf' && iconPreview && (
            <FontIcon onClick={() => preview(file)} className="preview-btn">
              remove_red_eye
            </FontIcon>
          )}
          {iconDelete && (
            <FontIcon
              icon
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFile(index, file)
              }}
              className="btn"
            >
              delete
            </FontIcon>
          )}
        </div>
        {
          <div key={index}>
            {renderDocumentIcon(file)}

            <div title={file && file.file_name} className="images-filename">
              {(file && file.file_name) || 'N/A'}
            </div>
          </div>
        }
      </div>
    ))
  }
  // ------------------

  return (
    <div key={key} className={cls('upload-images', className)}>
      <div
        className={cls(
          'upload-images-title-content',
          files.length > 0 && 'hidden',
        )}
      >
        {titleUpload && titleUpload}
      </div>
      <div
        {...getRootProps({
          className: cls(
            'upload-images-drop-zone',
            files.length > 0 && 'hidden',
          ),
        })}
      >
        <input {...getInputProps()} />
        {icon || <img src={icon} width="25px" />}
        {loading ? (
          <div className="attachment-loading">
            <FontIcon className="mdi mdi-loading mdi-spin" primary />
          </div>
        ) : (
          <div className="upload-images-uploaded-title">{title}</div>
        )}
        <div>{subTitle}</div>
      </div>

      {files.length > 0 && (
        <>
          <div className="upload-images-title">
            {titleContent && (
              <div className="upload-images-title-content">{titleContent}</div>
            )}
            {addTitle && (
              <Button
                flat
                primary
                className="upload-images-title-button"
                onClick={() => {
                  if (onAddAction) {
                    onAddAction()
                  } else {
                    // debugger
                    open()
                  }
                }}
              >
                {addTitle}
              </Button>
            )}
          </div>
          {loading ? (
            <div className="attachment-loading">
              <FontIcon className="mdi mdi-loading mdi-spin" primary />
            </div>
          ) : (
            <div className="upload-images-content ">
              {withIconDoc
                ? /* renderFilesWithIcon() */ renderFilesWithIcon()
                : renderFiles()}{' '}
            </div>
          )}
        </>
      )}
      <DialogContainer
        id="enter serial-number"
        className="previewFileDialog"
        disableScrollLocking={true}
        title={
          <div className="previewFileDialog_header">
            <h2>{t('preview')}</h2>
            <Button
              icon
              onClick={() => {
                setFileSrc(null)
              }}
            >
              {t('close')}
            </Button>
          </div>
        }
        visible={!!fileSrc}
        onHide={() => setFileSrc(null)}
      >
        <>
          {fileSrc?.type ? (
            fileSrc?.type === 'application/pdf' ? (
              <embed
                width="100%"
                height="850"
                className="pdfObject"
                src={`${fileSrc?.url}&view=true`}
                type="application/pdf"
                internalinstanceid="88"
              />
            ) : (
              <img
                src={`${fileSrc?.url}&view=true`}
                className="file-upload-image"
                alt="image"
                height="100%"
                width="100%"
              />
            )
          ) : fileSrc && fileSrc.document_type === 'application/pdf' ? (
            <embed
              width="100%"
              height="850"
              className="pdfObject"
              src={`${fileSrc?.url}&view=true`}
              type="application/pdf"
              internalinstanceid="88"
            />
          ) : (
            <img
              src={`${fileSrc?.url}&view=true`}
              className="file-upload-image"
              alt="image"
              height="100%"
              width="100%"
            />
          )}{' '}
        </>
      </DialogContainer>
    </div>
  )
}
export default UploadImages

// accept can be ".doc,.docx,image/jpeg, image/png, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
