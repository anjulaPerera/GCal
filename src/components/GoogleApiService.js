let gapi = window.gapi;
const API_KEY = "AIzaSyABvO6-YdakDyM5Uhl0TeGWHdervVMJ94c";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const CLIENT_ID =
  "901292772560-6kjqv3jna87etphc6l1fspnf2r2f6rtt.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

// initialize the gapi
export function initClient(callback) {
  console.log(callback);
  gapi.load("client:auth2", () => {
    try {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
          plugin_name: "Calendar App",
        })
        .then(
          function () {
            if (typeof callback === "function") {
              callback(true);
            }
          },
          function (error) {
            console.log(error);
          }
        );
    } catch (error) {
      console.log(error);
    }
  });
}

//check the initialozed client is signed in or not
export const checkSignInStatus = async () => {
  try {
    let status = await gapi.auth2.getAuthInstance().isSignedIn.get();
    return status;
  } catch (error) {
    console.log(error);
  }
};

//sign in a user
export const signInToGoogle = async () => {
  try {
    let googleuser = await gapi.auth2
      .getAuthInstance()
      .signIn({ prompt: "consent" });
    if (googleuser) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

// log out an user
export const signOutFromGoogle = () => {
  try {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      auth2.disconnect();
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

//getting the logged in user’s email
export const getSignedInUserEmail = async () => {
  try {
    let status = await checkSignInStatus();
    if (status) {
      var auth2 = gapi.auth2.getAuthInstance();
      var profile = auth2.currentUser.get().getBasicProfile();
      return profile.getEmail();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
//add event
export const publishTheCalenderEvent = (event) => {
  try {
    gapi.client.load("calendar", "v3", () => {
      var request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      request.execute(function (event) {
        console.log("Event created: " + event.htmlLink);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

//sample event
// var event = {
//   summary: "Google I/O 2015",
//   location: "800 Howard St., San Francisco, CA 94103",
//   description: "A chance to hear more about Google's developer products.",
//   start: {
//     dateTime: "2021-07-10T09:00:00-07:00",
//     timeZone: "America/Los_Angeles",
//   },
//   end: {
//     dateTime: "2021-07-10T17:00:00-07:30",
//     timeZone: "America/Los_Angeles",
//   },
//   recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
//   attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
//   reminders: {
//     useDefault: false,
//     overrides: [
//       { method: "email", minutes: 24 * 60 },
//       { method: "popup", minutes: 10 },
//     ],
//   },
// };

// put a calendar event to the google calendar
