import { Button, DialogContainer, FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'

const DocumentsContainer = ({ data, visible, onHide }) => {
  const { t } = useTranslation()

  const renderDocs = () =>
    data?.map((el, i) => (
      <li key={i}>
        {i + 1} -{el?.fileName}
        <Button>{t('view')}</Button>
        <Button>{t('download')}</Button>
      </li>
    ))
  return (
    <DialogContainer visible={visible}>
      <h1>{t('documents')}</h1>
      <FontIcon onClick={onHide}>close</FontIcon>
      <ol>{renderDocs()}</ol>
    </DialogContainer>
  )
}
export default DocumentsContainer
