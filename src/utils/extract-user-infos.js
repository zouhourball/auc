export const extractUserInfos = (meQuery) => {
  const { id, subject, profile, roles, ...rest } = meQuery

  return {
    ssoSubject: subject,
    id,
    fullName: profile.fullName,
    pictureURL: profile.pictureURL,
    cadreProfile: profile,
    roles,
    ...rest,
  }
}
