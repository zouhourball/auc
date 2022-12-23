import {
  getRequestsForBroker,
  approveRequest,
  rejectRequest,
  updateRequest,
} from 'libs/api/appointment-api'
import { useMemo, useState } from 'react'
import Mht from '@target-energysolutions/mht'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import ToastMsg from 'components/toast-msg'
import { addToast } from 'modules/app/actions'
import { Button, DialogContainer, TextField } from 'react-md'
import DrawOnMap from 'components/draw-on-map'

// import UserInfoBySubject from 'components/user-info-by-subject'
import { useTranslation, useCurrentLang } from 'libs/langs'

import { configs } from './helper'

import './style.scss'

const AppointmentsRequests = () => {
  // const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const [notesVisible, setNotesVisible] = useState(false)
  const [locationVisible, setLocationVisible] = useState(false)
  const [linkVisible, setLinkVisible] = useState(false)
  const [editMap, setEditMap] = useState(false)

  const meOrgs = useSelector(({ app }) => app?.myOrgs)
  const { t } = useTranslation()

  const lang = useCurrentLang()

  const language = useMemo(
    () => (!lang || lang === '' || lang === 'ar' ? 'ar' : null),
    [lang],
  )
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
      if (res?.success || res?.id) {
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
        setEditMap(false)
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
          addToast(
            <ToastMsg text={res?.error || 'Something is wrong'} type="error" />,
          ),
        )
      }
    },
    onError: (res) => {
      dispatch(addToast(<ToastMsg text={res?.error} type="error" />))
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
          addToast(
            <ToastMsg text={res?.error || 'Something is wrong'} type="error" />,
          ),
        )
      }
    },
    onError: (res) => {
      dispatch(addToast(<ToastMsg text={res?.error} type="error" />))
    },
  })
  const onApprove = (id, uuid) => {
    approveMutation.mutate({
      reqUuid: id,
      // uuid,
    })
  }
  const onReject = (id, uuid) => {
    rejectMutation.mutate({
      reqUuid: id,
      // uuid,
    })
  }
  const onUpdateRequest = (id, body) => {
    updateRequestMutation.mutate({
      reqUuid: id,
      // uuid,
      body,
    })
  }

  const renderAppointments = () =>
    requestsAppointments?.results?.map(
      (el) =>
        // <UserInfoBySubject key={el?.uuid} subject={el?.['bidders_subject']}>
        // {(res) => (
        ({
          id: el?.uuid,
          status: el?.status,
          title: el?.['auction_title'],
          auctionId: el?.auction?.uuid,
          name: el?.['bidder_name'],
          appointmentType: el?.type,
          appointmentTypeKey: t(el?.type),
          date:
            moment(el?.['appointment_date']).format('DD ') +
            moment(el?.['appointment_date'])
              .locale(lang === 'ar' ? 'ar' : 'en')
              .format('MMM ') +
            moment(el?.['appointment_date']).format('YYYY '),

          time: `${moment(el?.['start_at']).utc().format('HH:mm')} - ${moment(
            el?.['end_at'],
          )
            .utc()
            .format('HH:mm')}`,
          note: el?.notes,
          xLocation: el?.['general_location_x'],
          yLocation: el?.['general_location_y'],
          link: el?.['appointment_link'],
          // })
        }),
      // </UserInfoBySubject>
    )
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
          t,
        )}
        tableData={renderAppointments() || []}
        withChecked={false}
        singleSelect
        withSearch
        commonActions
        hideTotal
        labels={{ searchFieldPlaceholder: t('search_for_an_appointment') }}
        defaultLanguage={language}
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
          readOnly={!editMap}
          visible={locationVisible}
          zoom={50}
          layers={
            //   !editMap ? [
            //   {
            //     type: 'symbol',
            //     id: 'pin',
            //     items: [
            //       {
            //         id: 'Pinned',
            //         longitude: locationVisible?.x,
            //         latitude: locationVisible?.y,
            //       },
            //     ],
            //   },
            // ] :
            [
              {
                type: 'symbol',
                id: 'Symbol-Layer-Id',
                items: [],
              },
            ]
          }
          onSetAddress={(newCoordinates) => {
            setLocationVisible((prev) => ({
              id: prev?.id,
              y: newCoordinates?.['lat'],
              x: newCoordinates?.['lon'],
              address: newCoordinates?.['display_name'],
            }))
          }}
          longitude={locationVisible?.x}
          latitude={locationVisible?.y}
          customActions={
            !editMap
              ? [
                <Button
                  onClick={() => setEditMap(!editMap)}
                  key={'update-btn'}
                >
                    Edit Location
                </Button>,
              ]
              : [
                <Button
                  onClick={() =>
                    onUpdateRequest(locationVisible?.id, {
                      general_location_y: +locationVisible?.y,
                      general_location_x: +locationVisible?.x,
                      appointment_address: locationVisible?.address,
                      type: 'In-person',
                    })
                  }
                  key={'update-btn'}
                >
                    Update
                </Button>,

                <Button
                  onClick={() => setEditMap(!editMap)}
                  key={'update-btn'}
                >
                    Edit Location
                </Button>,
              ]
          }
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
                onUpdateRequest(linkVisible?.id, {
                  appointment_link: linkVisible?.link,
                  type: 'Online',
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
            onChange={(v) =>
              setLinkVisible((prev) => ({ id: prev?.id, link: v }))
            }
            className="textField-withShadow"
          />
        </DialogContainer>
      )}
    </div>
  )
}
export default AppointmentsRequests
