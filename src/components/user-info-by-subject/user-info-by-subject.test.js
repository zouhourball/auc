/* eslint-disable jest/no-hooks */
/* eslint-disable jest/prefer-expect-assertions */
import { shallow } from 'enzyme'
import UserInfoBySubject from './index'
import { MockedProvider } from '@apollo/react-testing'

jest.mock('libs/queries/user-profile-by-subject.gql')

describe('testing  component', () => {
  it('renders', () => {
    const wrapper = shallow(
      <MockedProvider>
        <UserInfoBySubject />
      </MockedProvider>,
    )
    expect(wrapper.exists()).toBe(true)
  })
})
