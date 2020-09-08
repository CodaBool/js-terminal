const prompt = document.querySelector('#prompt')
const userName = document.querySelector('#userName')
const input = document.querySelector('#input')
const output = document.querySelector('#output')
const timeEl = document.querySelector('#time')
const emojiEl = document.querySelector('#emoji')
const histArr = []
var histPos, histTemp = 0
var timer = null
const COMMANDS = ['help', 'clear', 'echo', 'whoami', 'ip', 'date', 'time', 'uname']

window.onload = function startup() {
  input.addEventListener('keydown', handleHistory, false)
  input.addEventListener('keydown', handleKeyDown, false)
  window.addEventListener('click', function() {
    input.focus()
  }, false)
  input.focus()

  timeEl.innerText = genTime()
  timer = setInterval(() => {
    timeEl.innerText = genTime()
    emojiEl.innerText = genEmoji()
  }, 1000)
}

function handleHistory(e) {
  if (histArr.length) {
    if (e.keyCode == 38 || e.keyCode == 40) { // up or down
      if (histArr[histPos]) { // if you had a previous word
        histArr[histPos] = input.innerText // replace last word with current input
      } else {
        histTemp = input.innerText // save input
      }
    }

    // correct histPos
    if (e.keyCode == 38) { // up
      histPos--
      if (histPos < 0) {
        histPos = 0
      }
    } else if (e.keyCode == 40) { // down
      histPos++
      if (histPos > histArr.length) {
        histPos = histArr.length
      }
    }

    if (e.keyCode == 38 || e.keyCode == 40) { // up or down
      input.innerText = histArr[histPos] ? histArr[histPos] : histTemp
      input.innerText = input.innerText // Sets cursor to end of input.
    }
  }
}

function handleKeyDown(e) {
  if (e.keyCode == 9) { // Implement tab suggest.
  } else if (e.keyCode == 8 || e.keyCode == 46) { // backspace or delete
    // hackToRemoveBr(true) // TODO: see if this is best solution
  } else if (e.keyCode == 32) { // space
    // hackToRemoveBr(false) // TODO: see if this is best solution
  } else if (e.keyCode == 13) { // enter

    // prevent adding br due to default div contenteditable
    document.execCommand('insertHTML', false, '<br/>');
    
    if (input.innerText) { // Save histArr
      histArr[histArr.length] = input.innerText;
      histPos = histArr.length
    }

    if (input.innerText && input.innerText.trim()) { // checks for blank space entry
      var args = input.innerText.split(' ').filter(function(value, index) {
        return value
      })
      args.forEach((element, index) => args[index] = element.replace(/(\r\n|\n|\r)/gm, ""))
      var cmd = args[0].toLowerCase() // Remove extra chars
      args = args.splice(1) // Remove cmd from arg list.
    }

    // Print userName and input to output
    const lineText = document.createElement("p")
    lineText.style = 'font-variant: small-caps;'
    const clone = document.querySelector('#userName').cloneNode(true)
    clone.style = 'display: inline-block;'
    const node = document.createTextNode(input.innerText)
    lineText.appendChild(clone)
    lineText.appendChild(node)
    output.appendChild(lineText)
    
    // TODO: find out why I need to remove some unknown leading character which is not a space
    switch (cmd) {
      case "help":
        outputHTML('<div class="ls-files">' + COMMANDS.join(' | ') + '</div>')
        break
      case 'clear':
        output.innerText = ''
        hackToRemoveDiv()
        return
      case 'echo':
        outputHTML( args.join(' ') )
        break
      case 'whoami':
        outputHTML("You are " + navigator.appVersion + " | " + navigator.language + " | " + navigator.oscpu + " | " + navigator.userAgent)
        break
      case 'ip':
        outputHTML("I need node to determine ip")
        break;
      case 'uname':
        outputHTML(navigator.appVersion)
        break
      case 'date':
        outputHTML(new Date())
        break
      case 'time':
        outputHTML("Your current time is " + genTime() + genEmoji())
        break
      default: if (cmd) {
        outputHTML(cmd + ': command not found')
      }
    }
    
    hackToRemoveDiv() // TODO: see if this is best solution
  } else if (e.ctrlKey  &&  e.keyCode === 76) { // Ctrl-L combo pressed
    output.innerText = ''
    hackToRemoveDiv()
    e.preventDefault () 
  } 
  /*
  else if (e.keyCode === 65 || e.keyCode === 66 || e.keyCode === 67 || e.keyCode === 68 || e.keyCode === 69 || e.keyCode === 70 || e.keyCode === 71 || e.keyCode === 72 || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 75 || e.keyCode === 76 || e.keyCode === 77 || e.keyCode === 78 || e.keyCode === 79 || e.keyCode === 80 || e.keyCode === 81 || e.keyCode === 82 || e.keyCode === 83 || e.keyCode === 84 || e.keyCode === 85 || e.keyCode === 86 || e.keyCode === 87 || e.keyCode === 88 || e.keyCode === 89 || e.keyCode === 90) {
    setTimeout(function(){
      input.innerText = input.innerText.toUpperCase()
    }, 5)
  }
  */
}

// hack to prevent browser from insert <br> tags after pressing space or
// removing the last char in the div
function hackToRemoveBr(checkClear) {
  if (checkClear) {
    setTimeout(function(){
      if (input.innerText.length === 1) {
        hackToRemoveBr(2) 
      }
    }, 5)
  } else {
    setTimeout(function(){
      const allBrTags = document.querySelectorAll('br')
      for (let el of allBrTags) {
        el.parentNode.removeChild(el)
      }
    }, 5)
  }
}

// Prevent browser from insert <div> after pressing Enter
function hackToRemoveDiv() {
  setTimeout(function(){
    input.innerHTML = ''
  }, 5)
}

function outputHTML(html) {
  output.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>')
  window.scrollTo(0,document.body.scrollHeight) // scroll to bottom of the page
}

function genTime() {
  var time, minutes, hour, seconds = null
  const now = new Date()
  hour = now.getHours()
  minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
  seconds = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds()
  time = hour + ":" + minutes + ":" + seconds
  return time
}

function genEmoji() {
  var emoji = null
  const now = new Date()
  hour = now.getHours()
  if (hour <= 3) emoji = "🌑"
  if (hour > 3 & hour <= 6) emoji = "🌗"
  if (hour > 6 & hour <= 9) emoji = "🌅"
  if (hour > 9 & hour <= 12) emoji = "⛅"
  if (hour > 12 & hour <= 15) emoji = "☀️"
  if (hour > 15 & hour <= 18) emoji = "🌤️"
  if (hour > 18 & hour <= 21) emoji = "🌄"
  if (hour > 21 & hour <= 24) emoji = "🌙"
  return emoji
}