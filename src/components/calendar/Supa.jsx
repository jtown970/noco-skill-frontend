
import React, { useState } from "react";
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import './Supa.scss';
import axios from 'axios';

const Supa = (props) => {
  const [ start, setStart ] = useState(new Date());
  const [ end, setEnd ] = useState(new Date());
  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();
  const { id } = useParams();

 console.log(props.dataUserEmail);


//  note: to check sellers email we must request access first. 
// this would have to come from the sender/buyer of the service
// option: add create calendar event in the chat not on payment.
// for payment choose from a list of days and times
  
  if(isLoading) {
    return <></>
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    } else {
      // Create session after signing in
      await supabase.auth.session();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  //  rewind to here 
  async function subtractTimeIntervals(start1, end1, start2, end2) {
    const start1Date = new Date(start1);
    const end1Date = new Date(end1);
    const start2Date = new Date(start2);
    const end2Date = new Date(end2);
  
    if (end1Date < start2Date || end2Date < start1Date) {
      // The intervals don't overlap
      return [{ start: start1, end: end1 }];
    } else if (start1Date < start2Date && end1Date <= end2Date) {
      // Interval 1 starts before Interval 2 and ends before or at the same time
      // as Interval 2
      return [{ start: start1, end: start2 }];
    } else if (start1Date < start2Date && end1Date > end2Date) {
      // Interval 1 starts before Interval 2 and ends after Interval 2
      return [
        { start: start1, end: start2 },
        { start: end2, end: end1 }
      ];
    } else if (start1Date >= start2Date && end1Date <= end2Date) {
      // Interval 1 starts and ends within Interval 2
      return [];
    } else if (start1Date >= start2Date && end1Date > end2Date) {
      // Interval 1 starts within Interval 2 and ends after Interval 2
      return [{ start: end2, end: end1 }];
    } else if (end1Date > start2Date && end1Date < end2Date) {
      // Interval 1 starts after Interval 2 and ends within Interval 2
      return [{ start: end1, end: end2 }];
    } else {
      // The intervals don't overlap
      return [{ start: start1, end: end1 }];
    }
  }

async function createCalendarEvent(dataUser) {
  // console.log("Creating calendar event");
  // console.log('data user =>', dataUser);

  // Check freebusy times for the user's calendar
  const freeBusyQuery = {
    timeMin: new Date(start).toISOString(),
    timeMax: new Date(end).toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    items: [{ id: props.dataUserEmail }]
  };
  const freeBusyResponse = await axios.post(
    'https://www.googleapis.com/calendar/v3/freeBusy',
    freeBusyQuery,
    {
      headers: {
        Authorization: `Bearer ${session.provider_token}`
      }
    }
  );
  const freeBusyTimes = freeBusyResponse.data.calendars[props.dataUserEmail].busy;
  console.log('free busy times =>',freeBusyTimes);

  // Create the calendar event only if the user is available during the requested time
  if (freeBusyTimes.length === 0) {
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': new Date(start).toISOString(), // convert to ISO string
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      },
      'end': {
        'dateTime': new Date(end).toISOString(), // convert to ISO string
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      },
      'attendees': [
        {'email': props.dataUserEmail}
      ]
    };
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + session.provider_token // Access token for google
      },
      body: JSON.stringify(event)
    }).then((data) => {
      console.log('data ====>',data);
      return data.json();
    }).then((data) => {
      // console.log(data);
      alert("Event created, check your Google Calendar!");
    });
  } else {

    // Find the next available time slot
    let nextFreeTime = new Date(start);
    let suggestedTime;
    for (const busyTime of freeBusyTimes) {
      const busyStart = new Date(busyTime.start);
      const busyEnd = new Date(busyTime.end);
      if (nextFreeTime < busyStart) {
        // Found a free slot, suggest it to the user
        suggestedTime = nextFreeTime;
        break;
      }
      nextFreeTime = busyEnd;
    }
    if (!suggestedTime) {
      // No free slot found, suggest the end of the last busy time
      suggestedTime = nextFreeTime;
    }
    const eventDuration = (new Date(end)).getTime() - (new Date(start)).getTime();
    suggestedTime = new Date(suggestedTime.getTime() + eventDuration);
    const suggestedTimeString = suggestedTime.toLocaleString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
    alert(`${props.dataUserUsername} not available during the requested time. Please change times.  We are working to fix this.`);
    return;
  }
}

  
  

  console.log('session', session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription);
  return (
    <div className="App">
      <div style={{width: "400px", margin: "30px auto"}}>
        {session ?
          <div>
            <h3>Hey there {session.user.email}</h3>
            <div className="cal-event">
              <h4>Send a Calendar event</h4>
              <div className="question-icon" >
                <div alt="Question" />
              </div>
            </div>
            <p>Start of your event</p>
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            <p>End of your event</p>
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            <p>Event name</p>
            <input placeholder="ex: the title of this page" type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input placeholder="ex: what we're doing" type="text" onChange={(e) => setEventDescription(e.target.value)} />
            <hr />
            <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
            <p></p>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
          :
          <>
          <div className="cal-event-2">
            <h4>Send a Calendar event</h4>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
            <div className="question-icon-2" >
            <div alt="Question" />
            </div>
          </div>
          </>
        }
      </div>
    </div>
  );
};

export default Supa;
