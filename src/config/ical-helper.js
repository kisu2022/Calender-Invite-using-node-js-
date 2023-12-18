const ical = require('ical-generator');
function getIcalObjectInstance(starttime, endtime, summary,description, location, url , name ,email) {
const cal = ical({ domain: "mytestwebsite.com", name: 'My test calendar event' });
cal.domain("mytestwebsite.com");
cal.createEvent({
        start: starttime,         
        end: endtime,             
        summary: summary,         
        description: description, 
        location: location,       
        url: url,                
        organizer: {              
            name: name,
            email: email
        },
    });
return cal;
}

module.export=getIcalObjectInstance