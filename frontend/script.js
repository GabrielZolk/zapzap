// login elements

const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements 

const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    'cadetblue',
    'darkgoldenrod',
    'cornflowerblue',
    'darkkhaki',
    'hotpink',
    'gold'
]

const user = {
    id: '',
    name: '',
    color: '',
}

let websocket

let createMessageSelf = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content
    
    return div
}

let createMessageOther = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender

    div.innerHTML += content
    
    return div
}

const getColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)

    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}

const processMessages = ({ data }) => {
    const { userId, userName, userColor, userMessage } = JSON.parse(data)

    if (userId === user.id) {
        chatMessages.appendChild(createMessageSelf(userMessage))
    } else {
        chatMessages.appendChild(createMessageOther(userMessage, userName, userColor))
    }

    scrollScreen()
} 

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getColor()

    login.style.display = 'none'
    chat.style.display = 'flex'

    websocket = new WebSocket('ws://localhost:8080')
    websocket.onmessage = processMessages
    // websocket.onopen = () => websocket.send(`Usuário ${user.name} entrou no servidor`)
}

const sendMessage = (event) => {
    event.preventDefault()
    
    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        userMessage: chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ''
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)