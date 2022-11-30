import { Button } from 'react-md'

export const configs = (
  onApprove,
  onReject,
  setNotesVisible,
  setLocationVisible,
  setLinkVisible,
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
      return row?.appointmentType === 'In-person' ? (
        <Button
          flat
          primary
          onClick={() =>
            setLocationVisible({
              x: row?.xLocation,
              y: row?.yLocation,
              id: row?.id,
            })
          }
        >
          Edit Location
        </Button>
      ) : (
        <Button
          flat
          primary
          onClick={() =>
            setLinkVisible({ link: row?.link, id: row?.id } || true)
          }
        >
          {row?.link ? 'View Link' : 'Add Link'}
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
      return row?.note ? (
        <Button flat primary onClick={() => setNotesVisible(row?.note)}>
          View
        </Button>
      ) : (
        <></>
      )
    },
  },
  {
    label: 'Action',
    key: 'action',
    width: '220',
    type: 'text',
    render: (row) => {
      return row?.status === 'Pending' ? (
        <>
          <Button
            flat
            onClick={() => onApprove(row?.id, row?.auctionId)}
            className="status Approved"
          >
            Approve
          </Button>
          <Button
            flat
            onClick={() => onReject(row?.id, row?.auctionId)}
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
    appointmentType: 'In-person',
    data: '',
    time: '',
    note: 'test',
    link: 'link here',
    xLocation: 1,
    yLocation: 1.1,
  },
  {
    id: '1',
    status: 'Pending',
    title: 'test',
    name: 'test',
    appointmentType: 'Online',
    data: '',
    time: '',
    link: '',
  },
]
