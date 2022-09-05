const { request } = require('express');
const express = require('express')
const router = express.Router();
const userModel = require('./models/user.models')

const successResponse = ({ message, data }) => ({ success: true, data: data ? data : null, message });
const failResponse = ({ message, data }) => ({ success: false, data: data ? data : null, message });

router.get('/', (req, res) => {
  res.send('server is running')
})
router.post('/create', async (req, res) => {
  const user = await userModel.find({ email: req.body.email });
  if (user.length < 1) {
    try {
      const message=`Name:${req.body.name}`+'\n' + `Email:${req.body.email}`+'\n' +`Type:${req.body.type}` +'\n' + `Message:${req.body.message}`
      let requestBody = {
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        socketid: req.body.socketid,
        unseenMessage: { message: message, msgid: req.body.email, type: 'other',date:req.body.date,seen:req.body.seen },
        seenMessage:{}
      }
      const newCompany = new userModel(requestBody);
      await newCompany.save();
      res.status(200).send(
        successResponse({
          message: 'User Created Successfully!',
        })
      );
    } catch (err) {
      res.status(500).send(
        failResponse({
          message: err ? err.message : "User Not Created!"
        })
      );
    }
  }
  else {
    try {
      if (user.length > 0) {
        userModel.updateOne(
          { email: req.body.email },
          {
            $set: {
              name: req.body.name,
              email: req.body.email,
              type: req.body.type,
              socketid: req.body.socketid
            }
          },
          function (err, result) {
            if (err) throw err;
            else {
              res.send(result)
            }
          }
        );
      }
    } catch (err) {
      res.status(500).send(
        "Failed"
      );
    }

  }
})
router.get('/getusers', async (req, res) => {
  try {
    const users = await userModel.find({}).sort({ _id: -1 });
    res.status(200).send(
      successResponse({
        message: 'Users Retrieved Successfully!',
        data: users
      })
    )
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Users Not Fetched!"
      })
    );
  }
})
router.get('/getuserbyid/:id', async (req, res) => {
  try {
    const users = await userModel.find({ email: req.params.id });
    res.status(200).send(
      successResponse({
        message: 'Users Retrieved Successfully!',
        data: users
      })
    )
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Users Not Fetched!"
      })
    );
  }
})
router.put('/update', async (req, res) => {
  const user = await userModel.find({ email: req.body.email });
  let msg = user[0].unseenMessage
  msg.push({ message: req.body.message, type: req.body.type, msgid: req.body.msgId ? req.body.msgId : req.body.email,date:req.body.date,seen:req.body.seen })
  try {
    userModel.updateOne(
      { email: req.body.email },
      {
        $set: {
          unseenMessage: msg
        }
      },
      function (err, result) {
        if (err) {
          res.send(err)
          console.log(err)
        }
        else {
          res.send(result)
        }
      }
    );

  } catch (err) {
    res.status(500).send(
      "Failed"
    );
  }


})

router.put('/updateStatus', async (req, res) => {
  try {
    userModel.updateOne(
      { email: req.body.email },
      {
        $set: {
          status: req.body.status
        }
      },
      function (err, result) {
        if (err) {
          res.send(err)
          console.log(err)
        }
        else {
          res.send(result)
          console.log('update')
        }
      }
    );

  } catch (err) {
    res.status(500).send(
      "Failed"
    );
  }


})

router.put('/updateSeen', async (req, res) => {
  const user = await userModel.find({ email: req.body.email });
  const final=user[0].unseenMessage.map((item)=>{
    if(item.seen === false && item.msgid === req.body.msgId ? req.body.msgId : req.body.email){
    return{
      ...item,seen:true
    }
    }
    else {
      return item
    }
  })
  try {
    userModel.updateOne(
      { email: req.body.email },
      {
        $set: {
          unseenMessage: final
        }
      },
      function (err, result) {
        if (err) {
          res.send(err)
          console.log(err)
        }
        else {
          res.send(result)
        }
      }
    );
  } catch (err) {
    res.status(500).send(
      "Failed"
    );
  }


})



module.exports = router