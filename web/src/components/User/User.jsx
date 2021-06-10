import React from 'react';

export default function User(props) {
  const { user, changeAdmin } = props;

  return (
    <tr>
      <td>{user._id}</td>
      <td onClick={() => changeAdmin(user) }>
        { user.admin
        ? <img src="/resources/yes.png" alt="yes" className="icon"/>
        : <img src="/resources/no.png" alt="no" className="icon"/>
        }
      </td>
    </tr>
  )
}