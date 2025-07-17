let express = require('express')

let  app= express()
let fs = require('fs')
let data = JSON.parse(fs.readFileSync('students.json','utf-8'))

app.get('/',(req,res)=>{
    res.json(data)
})

app.get('/:id',(req,res)=>{
    let id= req.params.id
    let stud = data.find((s)=>s.id===(+id))
    res.json(stud)
})
app.delete('/:id',(req,res)=>{
    let id= req.params.id
    let Index = data.findIndex((s)=>s.id===(+id))
    if(Index==-1)
    {
        res.send('invalid id')

    }
    else
    {
        data.splice(Index,1)
        fs.writeFileSync('students.json',JSON.stringify(data))
        res.send('data deleted')
    }

})
app.use(express.json())
app.post('/',(req,res)=>{

    let stud=req.body

    data.push(stud)
    fs.writeFileSync('students.json',JSON.stringify(data))
    res.send('data saved')


})

app.use(express.urlencoded({extended:false}))
app.patch('/:id',(req,res)=>{

    let id=+req.params.id
    
    let stud_post=req.body

    let stud_json=data.find((s)=>s.id===(id))

    if(stud_json==null)
    {
        res.json('invalide id')

    }
    Object.assign(stud_json,stud_post)
    fs.writeFileSync('student.json',JSON.stringify(data))
    res.json('data updated')







})
app.listen(1000)    