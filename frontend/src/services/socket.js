import { io } from "socket.io-client"

const connectSocket = (token)=>{
    return io("http://localhost:5000",{
        auth: {token}
    })
}

export default connectSocket