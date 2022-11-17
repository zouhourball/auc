import {
  getRequestsForBroker,
  approveRequest,
  rejectRequest,
  updateRequest,
} from 'libs/api/appointment-api'
import { useState } from 'react'
import Mht from '@target-energysolutions/mht'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import ToastMsg from 'components/toast-msg'
import { addToast } from 'modules/app/actions'
import { Button, DialogContainer, TextField } from 'react-md'
import DrawOnMap from 'components/draw-on-map'

import UserInfoBySubject from 'components/user-info-by-subject'

import { configs, dummyDataMht } from './helper'

import './style.scss'

const AppointmentsRequests = () => {
  // const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const [notesVisible, setNotesVisible] = useState(false)
  const [locationVisible, setLocationVisible] = useState(false)
  const [linkVisible, setLinkVisible] = useState(false)

  const meOrgs = useSelector(({ app }) => app?.myOrgs)

  const { data: requestsAppointments, refetch: refetchAppointments } = useQuery(
    [
      'getAppointmentsRequests',
      {
        broker_organization_id: meOrgs?.[0]?.ID,
        search_key: '',
      },
    ],
    getRequestsForBroker,
  )
  const updateRequestMutation = useMutation(updateRequest, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Appointment Request Updated Successfully'}
              type="success"
            />,
          ),
        )
        setLocationVisible(false)
        setLinkVisible(false)
        refetchAppointments()
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
  })
  const rejectMutation = useMutation(rejectRequest, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Appointment Request Rejected Successfully'}
              type="success"
            />,
          ),
        )
        refetchAppointments()
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
  })
  const approveMutation = useMutation(approveRequest, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Appointment Request Approved Successfully'}
              type="success"
            />,
          ),
        )
        refetchAppointments()
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
  })
  const onApprove = (id, uuid) => {
    approveMutation.mutate({
      reqUuid: id,
      uuid,
    })
  }
  const onReject = (id, uuid) => {
    rejectMutation.mutate({
      reqUuid: id,
      uuid,
    })
  }
  const onUpdateRequest = (id, uuid, body) => {
    updateRequestMutation.mutate({
      reqUuid: id,
      uuid,
      body,
    })
  }

  const renderAppointments = () =>
    requestsAppointments?.results?.map((el) => (
      <UserInfoBySubject key={el?.uuid} subject={el?.['bidders_subject']}>
        {(res) => ({
          id: el?.uuid,
          status: el?.status,
          title: 'test',
          name: res?.fullName,
          appointmentType: el?.type,
          date: moment(el?.['appointment_date']).format('DD MMM YYYY'),
          time: `${moment(el?.['start_at']).format('HH:mm')} - ${moment(
            el?.['end_at'],
          ).format('HH:mm')}`,
          note: el?.notes,
          xLocation: el?.['general_location_x'],
          yLocation: el?.['general_location_y'],
          link: el?.['appointment_link'],
        })}
      </UserInfoBySubject>
    ))
  return (
    <div className="admin-page-mht">
      <Mht
        id={'admin-dashboard'}
        configs={configs(
          onApprove,
          onReject,
          setNotesVisible,
          setLocationVisible,
          setLinkVisible,
        )}
        tableData={dummyDataMht || renderAppointments()}
        withChecked
        singleSelect
        withSearch
        commonActions
        withFooter
        hideTotal
      />
      {notesVisible && (
        <DialogContainer
          visible={notesVisible}
          onHide={() => setNotesVisible(false)}
          id={'notes-dialog'}
          initialFocus="notes-dialog"
        >
          <div>{notesVisible}</div>
        </DialogContainer>
      )}
      {locationVisible && (
        <DrawOnMap
          id={'address'}
          onClose={() => {
            setLocationVisible(false)
          }}
          // readOnly={true}
          visible={locationVisible}
          layers={[
            {
              type: 'symbol',
              id: 'Symbol-Layer-Id',
              items: [],
            },
          ]}
          onSetAddress={(newCoordinates) => {
            setLocationVisible({
              y: newCoordinates?.['lat'],
              x: newCoordinates?.['lon'],
              address: newCoordinates?.['display_name'],
            })
          }}
          longitude={locationVisible?.x}
          latitude={locationVisible?.y}
          customActions={[
            <Button
              onClick={() =>
                onUpdateRequest('1', '3', {
                  general_location_y: locationVisible?.y,
                  general_location_x: locationVisible?.x,
                  appointment_address: locationVisible?.address,
                })
              }
              key={'update-btn'}
            >
              Update
            </Button>,
          ]}
        />
      )}
      {linkVisible && (
        <DialogContainer
          visible={linkVisible}
          onHide={() => setLinkVisible(false)}
          id={'link-dialog'}
          initialFocus="link-dialog"
          actions={[
            <Button
              onClick={() =>
                onUpdateRequest('1', '3', {
                  appointment_link: linkVisible?.link,
                })
              }
              key={'update-btn'}
            >
              Update
            </Button>,
          ]}
        >
          <TextField
            id="appointment-link"
            placeholder={'Appointment Link Here'}
            block
            value={linkVisible?.link}
            onChange={(v) => setLinkVisible({ link: v })}
            className="textField-withShadow"
          />
        </DialogContainer>
      )}
    </div>
  )
}
export default AppointmentsRequests
