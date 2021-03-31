import React from 'react'

const FullName = (volunteer) => {
  if (volunteer.preferredName) {
    return (
      <span>
        <abbr
          style={{textDecoration: 'underline'}}
          title={`${volunteer.firstName} (${volunteer.preferredName}) ${volunteer.lastName}`}>
          {volunteer.preferredName} {volunteer.lastName}
        </abbr>
      </span>
    )
  } else {
    return (
      <span>
        {volunteer.firstName} {volunteer.lastName}
      </span>
    )
  }
}

export {FullName}
