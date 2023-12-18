'use strict';
const nodemailer = require("nodemailer");
const ICAL = require('ical.js');
const ics = require('ics');

const senderConfig= require("../../config.json")
//const { createEvent, createIcal } = require('../config/ical-helper');

// let content = 'BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\n...';

const sendmail = async (req, res) => {
    const { userEmail,subject,hour,minutes} = req.body;

    // const event = {
    //     _id: '123',
    //     DTStart: '20231218T160000Z',
    //     DTEnd: '220231218T170000Z',
    //     DTStamp: '20230101T000000Z',
    //     organizerName: 'Entiovi test',
    //     organizerEmail: 'kchatterjee@entiovi.com',
    //     attendeeName: 'Krishanu Chatterjee',
    //     attendeeEmail: 'kchatterjee@entiovi.com',
    //     body: 'Event details',
    //     location: 'Kolkata',
    //     sequence: '1',
    //     title: 'Sheduled Interview',
    //   };
    // //ical format for google and outlook
    // const iCal = 
    // `
    // BEGIN:VCALENDAR
    // PRODID:-//Cratic//_Scheduler//EN
    // VERSION:2.0
    // CALSCALE:GREGORIAN
    // METHOD:REQUEST
    // BEGIN:VEVENT
    // DTSTART:${event.DTStart}
    // DTEND:${event.DTEnd}
    // DTSTAMP:${event.DTStamp}
    // ORGANIZER;CN=${event.organizerName}:mailto:${event.organizerEmail}
    // UID:${event._id}@url.com
    // ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${event.attendeeName};X-NUM-GUESTS=0:mailto:${event.attendeeEmail}
    // CREATED:${event.DTStamp}
    // DESCRIPTION:${event.body}
    // LAST-MODIFIED:${event.DTStamp}
    // LOCATION:${event.location}
    // SEQUENCE:${event.sequence}
    // STATUS:CONFIRMED
    // SUMMARY:${event.title}
    // TRANSP:OPAQUE
    // END:VEVENT
    // END:VCALENDAR
    // `;

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
        organizer: { name: 'Your Name', email: 'your-email@gmail.com' },
      };

    const { error, value } = ics.createEvent(event);
        if (error) {
            console.error(error);
            process.exit(1);
        }
    console.log(value)
    let transporter = nodemailer.createTransport(config);

    // //creating ical file using ical.js  library ....ading a function which will create the file ....
    // function createICalEvent() {
    //     const jcalData = {
    //       jcal: {
    //         method: 'REQUEST',
    //         prodid: '//My//Product//EN',
    //         version: '2.0',
    //         events: [{
    //           start: '20231218T150000Z',
    //           end: '20231218T160000Z',
    //           summary: 'Sample Event',
    //           location: 'Sample Location',
    //           description: 'This is a sample calendar invitation.',
    //           organizer: 'mailto:organizer@example.com',
    //           attendees: [
    //             {
    //               email: 'kchatterjee@entiovi.com',
    //             },
    //             {
    //               email: 'kisusanuchatthot@hotmail.com',
    //             },
    //           ],
    //         }],
    //       },
    //     };
      
    //     const jcalDataString = ICAL.stringify(jcalData);
    //     const jcalComponent = ICAL.Component.fromString(jcalDataString);
    //     return jcalComponent;
    //   }
    //.....................................................................................
    // const buf = Buffer.from(iCal);
    // const base64Cal = buf.toString('base64');


  

    let message = {
        from: senderConfig.EMAIL, 
        to: userEmail, 
        subject: subject, 
        text: "Please accept the invitation Link.", 
        icalEvent: {
            filename: 'invitation.ics',
            method: 'request',
            content: value,
            //encoding:'base64'
        },
        // attachments: [{
        //     name: 'invite.ics',
        //     type: 'text/calendar;method=REQUEST;name="invite.ics"',
        //     data: base64Cal,
        //   }],
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