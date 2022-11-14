import { Button } from 'react-md'

export const configs = (
  setNotesVisible,
  setLocationVisible,
  setLinkVisible,
  onRespond,
) => [
  {
    label: 'Title',
    key: 'title',
    width: '200',
    // icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Name',
    key: 'name',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Appointment Type',
    key: 'appointmentType',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Location',
    key: 'location',
    width: '200',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return row?.appointmentType === '0' ? (
        <Button onClick={() => setLocationVisible(true)}>Edit Location</Button>
      ) : (
        <Button onClick={() => setLinkVisible(true)}>Add Link</Button>
      )
    },
  },
  {
    label: 'Date',
    key: 'date',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Time',
    key: 'time',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Notes',
    key: 'status',
    width: '200',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return <Button onClick={() => setNotesVisible(row?.id)}>View</Button>
    },
  },
  {
    label: 'Action',
    key: 'action',
    width: '200',
    type: 'text',
    render: (row) => {
      return row?.status === 'submitted' ? (
        <>
          <Button onClick={() => onRespond(row?.id, 'approve')}>Approve</Button>
          <Button onClick={() => onRespond(row?.id, 'reject')}>Reject</Button>
        </>
      ) : (
        <div>{row?.status}</div>
      )
    },
  },
]
export const dummyDataMht = [
  {
    id: '1',
    status: 'approved',
    title: 'test',
    name: 'test',
    appointmentType: 'test',
    data: '',
    time: '',
  },
]
