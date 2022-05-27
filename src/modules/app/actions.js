import { createAction } from 'redux-actions'

export const addToast = createAction('APP_ADD_TOAST', (text, action) => ({
  text,
  action,
}))
export const setVisibleLoader = createAction(
  'APP_ADD_LOADING',
  (visibleLoader) => ({
    visibleLoader,
  }),
)
export const dismissToast = createAction('APP_DISMISS_TOAST')

export const setUserInfos = createAction('APP_SET_USERINFOS', (userInfos) => ({
  userInfos,
}))
export const setDashboardId = createAction(
  'APP_SET_DASHBOARD_ID',
  (dashboardId) => ({
    dashboardId,
  }),
)
export const setCreateWsVisible = createAction(
  'APP_SET_CREATEWS_VISBLE',
  (createWsVisible) => ({
    createWsVisible,
  }),
)
export const setOrganizationId = createAction(
  'APP_SET_ORGANIZATION',
  (organizationID) => ({
    organizationID,
  }),
)
export const setCategoryId = createAction(
  'APP_SET_DASHBOARD_ID',
  (categoryId) => ({
    categoryId,
  }),
)

export const setUserType = createAction('APP_SET_USERTYPE', (isEnterprise) => ({
  isEnterprise,
}))

export const setSideCollapsed = createAction(
  'APP_SET_SIDE_COLLAPSED',
  (sideCollapsed) => ({
    sideCollapsed,
  }),
)
