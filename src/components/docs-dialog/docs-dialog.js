import { Button, DialogContainer, FontIcon } from 'react-md'

const DocumentsContainer = ({ data, visible, onHide }) => {
  const renderDocs = () =>
    data?.map((el, i) => (
      <li key={i}>
        {i + 1} -{el?.fileName}
        <Button>View</Button>
        <Button>Download</Button>
      </li>
    ))
  return (
    <DialogContainer visible={visible}>
      <h1>Documents</h1>
      <FontIcon onClick={onHide}>close</FontIcon>
      <ol>{renderDocs()}</ol>
    </DialogContainer>
  )
}
export default DocumentsContainer
