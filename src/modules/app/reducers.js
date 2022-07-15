import { handleActions } from 'redux-actions'
import update from 'immutability-helper'

import {
  addToast,
  dismissToast,
  setUserInfos,
  setDashboardId,
  setCategoryId,
  setOrganizationId,
  setUserType,
  setCreateWsVisible,
  setSideCollapsed,
  setVisibleLoader,
  setFsToken,
  setFsDlToken,
} from './actions'

const initialState = {
  toasts: [],
  dashboardId: [],
  categoryId: [],
  userInfos: null,
  organizationID: null,
  isEnterprise: false,
  createWsVisible: false,
  sideCollapsed: true,
  visibleLoader: false,
  uplToken: '',
  dlToken: '',
}

export default handleActions(
  {
    [addToast] (state, { payload }) {
      return update(state, {
        toasts: { $push: [payload] },
      })
    },
    [setFsToken] (state = initialState, { payload: { uplToken } }) {
      return update(state, {
        uplToken: { $set: uplToken },
      })
    },
    [setFsDlToken] (state = initialState, { payload: { dlToken } }) {
      return update(state, {
        dlToken: { $set: dlToken },
      })
    },

    [setVisibleLoader] (state = initialState, { payload: { visibleLoader } }) {
      return update(state, {
        visibleLoader: { $set: visibleLoader },
      })
    },
    [setOrganizationId] (state = initialState, { payload: { organizationID } }) {
      return update(state, {
        organizationID: { $set: organizationID },
      })
    },
    [setCreateWsVisible] (
      state = initialState,
      { payload: { createWsVisible } },
    ) {
      return update(state, {
        createWsVisible: { $set: createWsVisible },
      })
    },
    [dismissToast] (state) {
      return update(state, {
        toasts: { $splice: [[0, 1]] },
      })
    },
    [setUserInfos] (state = initialState, { payload: { userInfos } }) {
      return update(state, {
        userInfos: { $set: userInfos },
      })
    },
    [setDashboardId] (state = initialState, { payload: { dashboardId } }) {
      return update(state, {
        dashboardId: { $set: dashboardId },
      })
    },

    [setCategoryId] (state = initialState, { payload: { categoryId } }) {
      return update(state, {
        categoryId: { $set: categoryId },
      })
    },

    [setUserType] (state = initialState, { payload: { isEnterprise } }) {
      return update(state, {
        isEnterprise: { $set: isEnterprise },
      })
    },
    [setSideCollapsed] (state = initialState, { payload: { sideCollapsed } }) {
      return update(state, {
        sideCollapsed: { $set: sideCollapsed },
      })
    },
  },
  initialState,
)
