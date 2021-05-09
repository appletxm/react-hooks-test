function getItemById(menuData, id) {
  for (let i = 0; i < menuData.length; i = i + 1) {
    const item = menuData[i]

    if (item.id === id) {
      return item
    }
  }
  return null
}

export function doMathId(menuData, currentPath) {
  for (let i = 0; i < menuData.length; i = i + 1) {
    const item = menuData[i]
    if (item.menuUrl === currentPath) {
      return item
    }
  }
  return null
}

export function matchBreadData(currentPath, menuData) {
  const matchedData = []
  let matchedItemObj = null

  matchedItemObj = doMathId(menuData, currentPath)

  if (matchedItemObj) {
    const parentIds = matchedItemObj.parentIds.split(',')
    parentIds.forEach(id => {
      const item = getItemById(menuData, id)
      if (item) {
        matchedData.push(item)
      }
    })
    // matchedData.push(matchedItemObj)
  }

  return matchedData
}
