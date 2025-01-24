import { setDoc, doc, getDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db, safeAsync } from './firebase'

const checkItemInAnyList = async (uid, itemId, itemType) => {
  const userDocRef = doc(db, 'users', uid)
  const userDoc = await getDoc(userDocRef)

  const matchingLists = []

  if (userDoc.exists()) {
    const userData = userDoc.data()

    for (const listType of ['favorites', 'watchlist', 'watched']) {
      const list = userData[listType] || []
      if (list.some(item => item.id === itemId && item.type === itemType)) {
        matchingLists.push(listType)
      }
    }
  }

  return matchingLists
}

const removeItemFromList = async (uid, itemId, itemType, listType) => {
  const userDocRef = doc(db, 'users', uid)
  const userDoc = await getDoc(userDocRef)

  if (userDoc.exists()) {
    const userData = userDoc.data()
    const list = userData[listType] || []

    const itemIndex = list.findIndex(
      item => item.id === itemId && item.type === itemType
    )

    if (itemIndex !== -1) {
      list.splice(itemIndex, 1)
      await setDoc(userDocRef, { [listType]: list }, { merge: true })
      toast.success(`Removed from ${listType}`)
    } else {
      toast.error('Item not found in the list')
    }
  }
}
const storeItem = async (uid, newItem, listType) => {
  return safeAsync(async () => {
    const existingListTypes = await checkItemInAnyList(
      uid,
      newItem.id,
      newItem.type
    )

    if (
      existingListTypes.length === 0 ||
      !existingListTypes.includes(listType)
    ) {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)

      let list = []

      if (userDoc.exists()) {
        list = userDoc.data()[listType] || []
        if (!Array.isArray(list)) {
          list = []
        }
      }

      list.push(newItem)
      await setDoc(userDocRef, { [listType]: list }, { merge: true })
      toast.success(`Added to ${listType}`)
    } else {
      toast.error(`Item already in ${listType}`)
    }
  })
}

const getItemsFromListType = async (uid, listType) => {
  try {
    const userDocRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      const list = userData[listType] || []
      return list
    } else {
      console.error('User not found')
      return []
    }
  } catch (error) {
    console.error(`Error retrieving ${listType}:`, error.message)
    return []
  }
}
export {
  getItemsFromListType,
  storeItem,
  removeItemFromList,
  checkItemInAnyList
}
