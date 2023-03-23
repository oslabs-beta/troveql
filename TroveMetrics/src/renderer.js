


const testFunc = async () => {
  const response = await window.channel.sendNewCacheData({text: 'hello'})
  console.log('sendNewCacheData', response) // prints out 'pong'
}

testFunc()

window.channel.receiveNewCacheData(handleNewCacheData)

function handleNewCacheData(event, data) {
  console.log(data)
}