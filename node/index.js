const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};
let connection = null
const getConnection = () => {
  if (!connection) {
    connection = mysql.createConnection(config)
  }
  return connection
}

connection = getConnection()

const initTable = `CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)`

connection.query(initTable)


const getHtml = () =>  new Promise((resolve, reject) => {
    return connection.query(`SELECT name from people`, function (err, result, fields) {
          if (err) throw err;
          let html = `<h1>Full Cycle Rocks!</h1>`
          for (const row of result) {
            html = `${html}<br> &#8226;${row.name}`
          }
          resolve(html)
        })
  })

  const cadastraNome = () =>  new Promise((resolve, reject) => {
    return connection.query(`INSERT INTO people(name) values('Gabriel')`, function (err, result, fields) {
          if (err) throw err;
          resolve(result)
        })
  })

app.get('/',async(req, res) => {
    await cadastraNome()
    const hmtl = await getHtml()
    res.send(hmtl)
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})