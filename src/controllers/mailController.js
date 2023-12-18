'use strict';
const nodemailer = require("nodemailer");
const ICAL = require('ical.js');
const ics = require('ics');

const senderConfig= require("../../config.json")




const sendmail = async (req, res) => {
    const { userEmail,subject,organizer_name,organizer_mailaddress} = req.body;


    let config = {
        service : 'gmail',
        auth : {
            user: senderConfig.EMAIL,
            pass: senderConfig.PASSWORD
        }
    }

    const event = {
        start: [2023, 12, 19, 10, 0],
        duration: { hours: 1, minutes: 30 },
        title: 'Meeting Invitation',
        description: 'test discussion',
        location: 'Kolkata',
        organizer: { name: organizer_name, email: organizer_mailaddress },
      };

    const { error, value } = ics.createEvent(event);
        if (error) {
            console.error(error);
            process.exit(1);
        }
    console.log(value)
    let transporter = nodemailer.createTransport(config);

    

  

    let message = {
        from: senderConfig.EMAIL, 
        to: userEmail, 
        subject: subject, 
        text: "Please accept the invitation Link.", 
        icalEvent: {
            filename: 'invitation.ics',
            method: 'request',
            content: value,
        },
      }

   

      transporter.sendMail(message).then((info) => {
        return res.status(201)
        .json({ 
            msg: " should have receive an email",
            info : info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        console.log("ERROR:",error.errors)
        return res.status(500).json({ error })
    })

    
      


}


module.exports = {
    sendmail
}