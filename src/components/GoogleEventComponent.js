import React, { useState, useEffect } from "react";
import {
  signInToGoogle,
  initClient,
  getSignedInUserEmail,
  signOutFromGoogle,
  publishTheCalenderEvent,
} from "./GoogleApiService";
import moment from "moment";

export default function GoogleEventComponent() {
  const [signedin, setSignedIn] = useState(false);
  const [googleAuthedEmail, setgoogleAuthedEmail] = useState(null);
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const getGoogleAuthorizedEmail = async () => {
    let email = await getSignedInUserEmail();
    if (email) {
      setSignedIn(true);
      setgoogleAuthedEmail(email);
    }
  };

  const getAuthToGoogle = async () => {
    let successfull = await signInToGoogle();
    if (successfull) {
      getGoogleAuthorizedEmail();
    }
  };
  const _signOutFromGoogle = () => {
    let status = signOutFromGoogle();
    if (status) {
      setSignedIn(false);
      setgoogleAuthedEmail(null);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    var event = {
      description,
      start: {
        dateTime: moment(startTime),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: moment(endTime),
        timeZone: "America/Los_Angeles",
      },
    };
    publishTheCalenderEvent(event);
  };

  useEffect(() => {
    initClient((success) => {
      if (success) {
        getGoogleAuthorizedEmail();
      }
    });
  }, []);

  return (
    <div className="calenderEvent-wrapper">
      <div className="header">
        <h1>Add an event to google Calender</h1>
      </div>
      {!signedin ? (
        <div className="google-login">
          <p>Login in to Google</p>
          <button onClick={() => getAuthToGoogle()}>Sign In</button>
        </div>
      ) : (
        <div className="body">
          <div className="signout">
            <p>Email: {googleAuthedEmail}</p>
            <button onClick={() => _signOutFromGoogle()}>Sign Out</button>
          </div>
          <form>
            <div className="eventItem">
              <label>Description</label>
              <input
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>
            <div className="eventItem">
              <label>Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              ></input>
            </div>
            <div className="eventItem">
              <label>End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              ></input>
            </div>
            <button type="submit" onClick={(e) => submit(e)}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// // import {gapi} from "googleapis";

// export default function GoogleEventComponent() {
//   const [signedIn, setSignedIn] = useState(false);
//   const [description, setDescription] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [auth, setAuth] = useState(null);
//   const [email, setEmail] = useState(null);

//   useEffect(() => {
//     window.gapi.load("client:auth2", () => {
//       console.log("API client loaded for auth2");
//       window.gapi.client
//         .init({
//           apiKey: "AIzaSyABvO6-YdakDyM5Uhl0TeGWHdervVMJ94c",
//           clientId:
//             "901292772560-6kjqv3jna87etphc6l1fspnf2r2f6rtt.apps.googleusercontent.com",
//           discoveryDocs: [
//             "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
//           ],
//           scope: "https://www.googleapis.com/auth/calendar.events",
//         })
//         .then(() => {
//           const authInstance = window.gapi.auth2.getAuthInstance(); //ISSUE?????????????
//           console.log(authInstance);
//           setAuth(authInstance); //???????????????????
//           setSignedIn(authInstance.isSignedIn.get());
//           setEmail(authInstance.currentUser.get().getBasicProfile().getEmail());
//         })
//         .catch((err) => console.log(err));
//     });
//   }, []);

//   const handleSignIn = () => {
//     if (!auth) {
//       console.log("Authentication failed.");
//       return;
//     }
//     auth
//       .signIn()
//       .then(() => {
//         console.log("User signed in");
//         setSignedIn(true);
//         setEmail(auth.currentUser.get().getBasicProfile().getEmail());
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleSignOut = () => {
//     auth
//       .signOut()
//       .then(() => {
//         console.log("User signed out");
//         setSignedIn(false);
//         setEmail(null);
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitting event...");
//     window.gapi.client.calendar.events
//       .insert({
//         calendarId: "primary",
//         resource: {
//           summary: description,
//           start: {
//             dateTime: startTime,
//           },
//           end: {
//             dateTime: endTime,
//           },
//         },
//       })
//       .then(() => {
//         console.log("Event submitted successfully");
//         setDescription("");
//         setStartTime("");
//         setEndTime("");
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="calendarEvent-wrapper">
//       <div className="header">
//         <h1>Add an event to Google Calendar</h1>
//       </div>
//       {!signedIn ? (
//         <div className="google-login">
//           <p>Login to Google</p>
//           <button onClick={handleSignIn}>Sign In</button>
//         </div>
//       ) : (
//         <div className="body">
//           <div className="signout">
//             <p>Email: {email}</p>
//             <button onClick={handleSignOut}>Sign Out</button>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="eventItem">
//               <label>Description</label>
//               <input
//                 placeholder="Description..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>
//             <div className="eventItem">
//               <label>Start Time</label>
//               <input
//                 type="datetime-local"
//                 value={startTime}
//                 onChange={(e) => setStartTime(e.target.value)}
//               />
//             </div>
//             <div className="eventItem">
//               <label>End Time</label>
//               <input
//                 type="datetime-local"
//                 value={endTime}
//                 onChange={(e) => setEndTime(e.target.value)}
//               />
//             </div>
//             <button type="submit">Submit</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }
