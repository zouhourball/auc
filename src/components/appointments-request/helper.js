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
    width: '300',
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
        <Button flat primary onClick={() => setLocationVisible(true)}>
          Edit Location
        </Button>
      ) : (
        <Button flat primary onClick={() => setLinkVisible(true)}>
          Add Link
        </Button>
      )
    },
  },
  {
    label: 'Date',
    key: 'date',
    width: '150',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Time',
    key: 'time',
    width: '150',
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
      return (
        <Button flat primary onClick={() => setNotesVisible(row?.id)}>
          View
        </Button>
      )
    },
  },
  {
    label: 'Action',
    key: 'action',
    width: '220',
    type: 'text',
    render: (row) => {
      return row?.status === 'submitted' ? (
        <>
          <Button
            flat
            onClick={() => onRespond(row?.id, 'approve')}
            className="status Approved"
          >
            Approve
          </Button>
          <Button
            flat
            onClick={() => onRespond(row?.id, 'reject')}
            className="status Rejected"
          >
            Reject
          </Button>
        </>
      ) : (
        <div className="status Pending">{row?.status}</div>
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
  {
    id: '1',
    status: 'submitted',
    title: 'test',
    name: 'test',
    appointmentType: 'test',
    data: '',
    time: '',
  },
]
