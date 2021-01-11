// import Vue from "vue"

// google spreadsheet
const clientConfig = {
  apiKey: ['AIzaSyCgFsVIgq3-bXJtlQKaIRD2OiKe0NBcTuw'],
  clientId: '121254292316-29p6tbp6bvo0c31qtmubdatce3l112ck.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4','https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/calendar.readonly'],
  // works only with `ux_mode: "prompt"`
  refreshToken: true,
}
export default clientConfig