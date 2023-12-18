const sendICalEmail = async (req, res) => {

    const { userEmail,subject } = req.body;
    // Example usage:
    const event = {
    _id: '123',
    DTStart: '20230101T120000Z',
    DTEnd: '20230101T140000Z',
    DTStamp: '20230101T000000Z',
    organizerName: 'Organizer Name',
    organizerEmail: 'kchatterjee@entiovi.com',
    attendeeName: 'Attendee Name',
    attendeeEmail: 'kchatterjee@entiovi.com',
    body: 'Event details',
    location: 'Event location',
    sequence: '1',
    title: 'Event Title',
  };
    // Construct iCalendar string
    const iCal = `
      BEGIN:VCALENDAR
      PRODID:-//Cratic//_Scheduler//EN
      VERSION:2.0
      CALSCALE:GREGORIAN
      METHOD:REQUEST
      BEGIN:VEVENT
      DTSTART:${event.DTStart}
      DTEND:${event.DTEnd}
      DTSTAMP:${event.DTStamp}
      ORGANIZER;CN=${event.organizerName}:mailto:${event.organizerEmail}
      UID:${event._id}@url.com
      ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${event.attendeeName};X-NUM-GUESTS=0:mailto:${event.attendeeEmail}
      CREATED:${event.DTStamp}
      DESCRIPTION:${event.body}
      LAST-MODIFIED:${event.DTStamp}
      LOCATION:${event.location}
      SEQUENCE:${event.sequence}
      STATUS:CONFIRMED
      SUMMARY:${event.title}
      TRANSP:OPAQUE
      END:VEVENT
      END:VCALENDAR
    `;
  
    // Convert iCalendar to base64
    const buf = Buffer.from(iCal, 'utf-8');
    const base64Cal = buf.toString('base64');
  
    // Send email with iCalendar attachment
    try {
      const res = await client.transmissions.send({
        recipients: [{ address:'kchatterjee@entiovi.com' }],
        content: {
          from: 'kisunano@gmail.com',
          subject: event.title,
          text: event.body,
          attachments: [
            {
              name: 'invite.ics',
              type: 'text/calendar;method=REQUEST;name="invite.ics"',
              data: base64Cal,
            },
          ],
        },
        options: { sandbox: false },
      });
  
      console.log('Email sent successfully:', res);
      return res.status(201)
        .json({ 
            msg: " should have receive an email",
            info : info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error })
    }
  };
  
  module.exports = {
    sendICalEmail
}
 
  
  