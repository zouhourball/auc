import { navigate } from '@reach/router'
import { cleanUp } from '@target-energysolutions/hoc-oauth'
// import UserInfoBySubject from 'components/user-info-by-subject'
import { useTranslation } from 'libs/langs'
import { getPublicUrl } from 'libs/utils/custom-function'
import { get } from 'lodash-es'
import { useState } from 'react'
import {
  Avatar,
  Button,
  DialogContainer,
  CircularProgress,
  FileInput,
  FontIcon,
} from 'react-md'
// import { useDropzone } from 'react-dropzone'

import updateUserProfiles from 'libs/queries/update-profile.gql'
import updateCompany from 'libs/queries/update-organization.gql'
import uploadUserDocuments from 'libs/queries/upload-user-documents.gql'
import uploadCompanyDocuments from 'libs/queries/upload-company-documents.gql'
import { useMutation } from 'react-apollo'
import { useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'
import ToastMsg from 'components/toast-msg'
import { fileManagerUpload } from 'libs/api/api-file-manager'
// import CropImage from 'components/crop-image'

import companyEnabled from 'images/company_enable.svg'
import companyDisabled from 'images/company_disable.svg'
import securityEnabled from 'images/security_enable.svg'
import securityDisabled from 'images/security_disable.svg'
import supportEnabled from 'images/support_enable.svg'
import supportDisabled from 'images/support_disable.svg'
import payementEnabled from 'images/payment_enable.svg'
import payementDisabled from 'images/payment_disable.svg'
import signOutEnabled from 'images/sign_out_enable.svg'
import signOutDisabled from 'images/sign_out_disable.svg'

// import avatar from './avatar.jpg'
// import success from './Success.svg'

import './style.scss'

const ProfileMenu = ({
  currentView,
  setCurrentView,
  company,
  userInfo,
  refetch,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [currentFile, setFile] = useState({})
  const [loading, setLoading] = useState(false)
  const updateCompanyInfo = (id) => {
    // console.log('res 4')
    const input = company
      ? {
        organisationID: userInfo?.organisationID,
        id: userInfo?.id,
        companyLogo: id,
        videoCv: null,
      }
      : {
        userID: userInfo?.userID,
        photo: id,
        videoCv: null,
      }
    updateMutation({
      context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
      variables: {
        input,
      },
    })
  }
  const [uploadDocMutation] = useMutation(
    company ? uploadCompanyDocuments : uploadUserDocuments,
  )
  const [updateMutation] = useMutation(
    !company ? updateUserProfiles : updateCompany,
    {
      onCompleted: (res) => {
        if (res?.updateUserProfiles || res?.updateCompanies) {
          dispatch(
            addToast(
              <ToastMsg text={'Changes done successfully '} type="success" />,
            ),
          )
          setFile({})
        } else {
          dispatch(
            addToast(<ToastMsg text={'Changes has failed'} type="error" />),
          )
        }
        refetch && refetch()
      },
    },
  )

  const onNewImage = (file) => {
    setLoading(true)
    fileManagerUpload([file], true)
      .then((res) => {
        if (res?.files?.length > 0) {
          /*         setImage(res?.files[0]) */
          uploadDocMutation({
            context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
            variables: {
              input: [
                {
                  aPIID: res?.files[0]?.id,
                  aPIURL: res?.files[0]?.url,
                  aPISize: res?.files[0]?.size?.toString(),
                  aPIBucket: res?.files[0]?.bucket,
                  aPIObject: res?.files[0]?.object,
                  aPIFilename: res?.files[0]?.filename,
                  aPISubject: res?.files[0]?.subject,
                  aPIContentType: res?.files[0]?.contentType,
                  uploadDate: new Date(),
                  documentTitle: res?.files[0]?.filename,
                  documentDescription: res?.files[0]?.filename,
                  ...(company
                    ? { companyID: userInfo?.id }
                    : { userID: userInfo?.userID }),
                },
              ],
            },
          }).then((res) => {
            company
              ? setFile(res?.data?.uploadCompanyDocuments[0]?.document)
              : setFile(res?.data?.uploadUserDocuments[0]?.document)
            setLoading(false)
          })
        }
      })
      .then(() => refetch())
  }
  return (
    <div className="profile-menu">
      <div className="avatar-container">
        <div className="">{loading && <CircularProgress />}</div>
        <FileInput
          id="basic-info"
          className="edit-btn"
          labelClassName="hidden-label"
          accept="image/jpeg, image/png"
          icon={
            <FontIcon>edit_square</FontIcon>
            // image ? (
            //   <img src={getPublicUrl(image)} width="120px" />
            // ) : information?.image ? (
            //   <img src={getPublicUrl(information?.image)} width="120px" />
            // ) : (
            //   <img src={img} width="120px" />
            // )
          }
          onChange={onNewImage}
        />
        {/* <Button icon primary floating className="edit-btn">
          edit
        </Button> */}
        {!company && (
          // <UserInfoBySubject
          //   key={userInfo?.subject}
          //   subject={userInfo?.subject}
          // >
          //   {(res) => {
          //     return (
          <Avatar
            className="profile-menu-avatar"
            src={
              currentFile?.id
                ? getPublicUrl(currentFile?.aPIID)
                : get(userInfo, 'photo.aPIID', null)
                  ? getPublicUrl(userInfo?.photo?.aPIID)
                  : null
            }
          >
            {get(userInfo, 'photo.aPIID', null)
              ? null
              : get(userInfo, 'fullName.0', '')}
          </Avatar>
          //     )
          //   }}
          // </UserInfoBySubject>
        )}
        {company && (
          <Avatar
            className="profile-menu-avatar"
            src={
              currentFile?.id
                ? getPublicUrl(currentFile?.aPIID)
                : getPublicUrl(userInfo?.companyLogo?.aPIID)
            }
          ></Avatar>
        )}
      </div>
      {currentFile?.id && (
        <>
          <Button onClick={() => updateCompanyInfo(currentFile?.id)}>
            Update photo
          </Button>
          <Button onClick={() => setFile({})}>Discard</Button>
        </>
      )}
      <div className="profile-menu-fullName">
        {company ? userInfo?.name : userInfo?.fullName}
      </div>
      <div className="profile-menu-email">{userInfo?.email}</div>
      <br />
      {(!company ? views : viewsCompany)?.map(
        ({ label, value, iconDisabled, iconEnabled }) => (
          <Button
            className={`profile-menu-infoBtn ${
              currentView === value ? 'active' : ''
            }`}
            key={value}
            onClick={() => setCurrentView(value)}
            iconEl={
              <img
                width={13}
                src={currentView === value ? iconEnabled : iconDisabled}
              />
            }
          >
            <span>{t(label)}</span>
          </Button>
        ),
      )}
      <Button
        key={'signOut'}
        className="profile-menu-infoBtn"
        onClick={() => setVisible(true)}
        iconEl={
          <img width={13} src={visible ? signOutEnabled : signOutDisabled} />
        }
      >
        {t('sign_out')}
      </Button>
      {visible && (
        <DialogContainer
          visible={visible}
          dialogClassName="change-email-dialog"
          focusOnMount={false}
          onHide={() => setVisible(false)}
          actions={[
            <Button key={'2'} flat onClick={() => setVisible(false)}>
              {t('cancel')}
            </Button>,
            <Button
              key={'3'}
              flat
              primary
              swapTheming
              onClick={() => {
                cleanUp()
                navigate('/public/home')
              }}
            >
              {t('confirm')}
            </Button>,
          ]}
        >
          <div style={{ margin: '20px auto', textAlign: 'center' }}>
            <img
              src={signOutEnabled}
              width={50}
              height={50}
              className="success-image"
            />
          </div>
          <h2 style={{ textAlign: 'center' }}>{t('are_you_sure')}</h2>
        </DialogContainer>
      )}
      {/* {cropDialog && imgSrc && (
        <CropImage
          visible={cropDialog}
          onHide={() => setCropDialog(false)}
          imgSrc={imgSrc}
          onNewImage={onNewImage}
        />
      )} */}
    </div>
  )
}

export default ProfileMenu

const views = [
  {
    label: 'personal_information',
    value: 'PersonalInformation',
    iconEnabled: companyEnabled,
    iconDisabled: companyDisabled,
  },
  {
    label: 'payment',
    value: 'Payment',
    iconEnabled: payementEnabled,
    iconDisabled: payementDisabled,
  },
  {
    label: 'security',
    value: 'Security',
    iconEnabled: securityEnabled,
    iconDisabled: securityDisabled,
  },
  {
    label: 'support',
    value: 'Support',
    iconEnabled: supportEnabled,
    iconDisabled: supportDisabled,
  },
]
const viewsCompany = [
  {
    label: 'company_information',
    value: 'PersonalInformationCompany',
    iconEnabled: companyEnabled,
    iconDisabled: companyDisabled,
  },
  {
    label: 'security',
    value: 'Security',
    iconEnabled: securityEnabled,
    iconDisabled: securityDisabled,
  },
  {
    label: 'support',
    value: 'Support',
    iconEnabled: supportEnabled,
    iconDisabled: securityDisabled,
  },
]
