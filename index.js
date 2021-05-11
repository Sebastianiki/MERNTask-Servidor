const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

const app = express()

connectDB()

app.use(cors())

app.use(express.json({ extend: true }))

const PORT = process.env.PORT || 4001

app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})