
import {
  LOCAL_STORAGE_KEY
} from '@/constants'

import { UserClient } from '@/clients/api/UserClient'
import {AppConfig} from "@/config/env";

function getRealDate() {
  return new Date()
}

function getFixedDate(fixedDate) {
  return () => Date.parse(fixedDate)
}

const _getCurrentDate = (AppConfig.fixedDate)
  ? getFixedDate(AppConfig.fixedDate) : getRealDate

export function getCurrentDate() {
  return _getCurrentDate()
}

export async function getUserId() {

  const userId = localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID)
  if (userId && userId !=='undefined') {
    return userId
  }

  const client = new UserClient()
  const response = await client.publishId().then(result => {
    return result.data
  })

  localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, response.userId)
  return response.userId
}
