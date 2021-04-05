import React from 'react'

const FullName = (volunteer, useAbbr = true) => {
  if (volunteer.preferredName) {
    if (useAbbr) {
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
        <span>{`${volunteer.firstName} (${volunteer.preferredName}) ${volunteer.lastName}`}</span>
      )
    }
  } else {
    return (
      <span>
        {volunteer.firstName} {volunteer.lastName}
      </span>
    )
  }
}

export {FullName}
