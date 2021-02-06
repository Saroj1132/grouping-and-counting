const express=require('express')
const app=express()
const db=require('./config/db')
const mongoose=require('mongoose')
const user=require('./model/user')
const task = require('./model/info')

mongoose.connect(db.url, (err, res)=>{
    console.log('Connection succesfully')
})

app.get('/', (req, res)=>{
    // user.find({}).exec()
    // .then(doc=>{
    //     res.send(doc)
    // })

    const aggregateOpts=[
        {
            $group:{_id:{userid:"$UserId"}, count:{$sum:1}}
        },
        {
            $lookup:{
                from:'users',
                localField:'_id.userid',
                foreignField:'_id',
                as:'useras'
            }
        },
        {
            $project:{
                Name:"$useras.Name",
                Email:"$useras.Email",
                count:1
            }
        }
    ]

    task.aggregate(aggregateOpts).then(task=>{
        res.send(task)
    })
})

app.listen(3000)