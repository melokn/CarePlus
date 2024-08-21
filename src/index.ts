import express, {Express, Request, Response} from 'express'

const app:Express = express()
const port = 4060

app.get('/', (req:Request, res:Response) => {
  res.send('Working')
})




app.listen(port, () => {console.log(`App running on port: ${port}` )})