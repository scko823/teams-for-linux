
const electron = require('electron')
const path = require('path')
const notifier = require('node-notifier')

const app = electron.app
app.on('ready', () => {
  const window = new electron.BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(app.getAppPath(), 'lib/assets/icons/icon-96x96.png'),

    webPreferences: {
      partition: 'persist:teams',
      nodeIntegration: false
    }
  })
  window.webContents.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
  window.loadURL('https://teams.microsoft.com/')

  window.on('page-title-updated', function (ev, title) {
    const regex = /(?!\()\d+(?=\))/g
    if (!regex.test(title)){
      return
    }
    let msgCount
    try {
      msgCount = +(title.match(regex)[0])
    }catch(ex){
      console.log("parsing message count failed")
      console.log(`error is: ${JSON.stringify(ex, null, 2)}`)
      console.log(`title: ${title}, title.match(regex): ${title.match(regex)}`)
      return
    }

    notifier.notify({
      title: 'title',
      message: msgCount === 1 ? `1 new notification` : `${msgCount} new notifications`,
      wait: true
    })
    // notifier.on('click', function (notifierObj, options) {
    //   console.log('clicked!!!')
    //   console.log(JSON.stringify(notifierObj))
    // })
    // notifier.on('timeout', function (notifierObj, options) {
    //   console.log('timeout!!!')
    //   console.log(JSON.stringify(notifierObj))
    // })
  })
})
