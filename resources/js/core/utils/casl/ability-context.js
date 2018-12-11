import React from 'react'

import { createContext } from 'react'
import { createContextualCan } from '@casl/react'

import LoadSpinner from '../../common/loadspinner'

export const AbilityContext = createContext()
export const Can = createContextualCan(AbilityContext.Consumer)

export const CanWithLoader = ({ isLoading, ...rest }) => {
  return (
      isLoading ? <LoadSpinner  /> : <Can {...rest}>{rest.children}</Can>
  );
}