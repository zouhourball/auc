import { Button, DialogContainer, FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'
import './style.scss'

const DocumentsContainer = ({ data, visible, onHide }) => {
  const { t } = useTranslation()

  const renderDocs = () =>
    data?.map((el, i) => (
      <li key={el?.uuid}>
        <div className="file-name">
          {i + 1} -{el?.['file_name'] || 'file'}
        </div>
        <Button className="viewBtn">{t('view')}</Button>
        <Button className="downloadBtn">{t('download')}</Button>
      </li>
    ))
  return (
    <DialogContainer visible={visible} dialogClassName="documents-dialog">
      <div className="documents-dialog-header">
        <div className="documents-dialog-header-title">{t('documents')}</div>
        <FontIcon className="documents-dialog-header-icon" onClick={onHide}>
          highlight_off
        </FontIcon>
      </div>
      <ol className="documents-dialog-list">{renderDocs()}</ol>
    </DialogContainer>
  )
}
export default DocumentsContainer
