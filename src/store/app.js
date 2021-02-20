import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import { supersassConfig } from "../config/supersass-config"
import axiosBase from 'axios';
const axios = axiosBase.create({
  // baseURL: 'http://localhost:4005', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/xml',
    'X-Requested-With': 'XMLHttpRequest',
    // 'Access-Control-Allow-Origin':'https://localhost:4005',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    // Authorization: "Basic " + btoa("susture" + ":" + "susture2525"),
  },
  responseType: 'json',
  // responseType: 'text/xml'
});

import _ from 'lodash';
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, {
  moment,
})

import createPersistedState from "vuex-persistedstate";

import xml2js from 'xml2js'
const parser = new xml2js.Parser({
        async: false, 
        explicitArray: false
      });
import firebase from "@firebase/app";

// const debug = process.env.NODE_ENV !== 'production'
const debug = process.env.NODE_ENV !== 'development'

const state = {
    result:{
      events: [],
      users: [],
      bookings: [],
      schedules: [],
      resources: [],
      myschedules: [],
    },
    master:{},
    form:{
    },
    isLoading: true,
    page:1,
    total:1,
    totalPages:1,
    query:{
      limit:10,
    },
    // superSassInfo: {
    //   username: supersassConfig.account,
    //   password: supersassConfig.password,
    //   api_key: supersassConfig.apiKey
    // },
    backuri: '',
    selectDate: '',
    auth: {
      user_id: '',
      username: '',
      password: '',
      email: '',
      checksum: '',
      isMember: false,
      credit: 0,
      supersass: supersassConfig,
      isAdmissionFee: true,
      verifyEmail: false
    },
    authStatus: false,
    info: {
      browser:'',
      isPersonal: true,
      isSafariLogin: false,
      actionCode: '',
      accountEmail: '',
      isResetPassword: false
    },
    search: {}
}

const actions = {
  getMD5: (store,{params,callback}) => {
    // console.log('md',store.state.auth.email,params)
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getHash');
        await httpEvent({ 
          // name: 'susturesusture2525'+store.state.auth.email,
          name: supersassConfig.account+supersassConfig.password+params.email,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          callback(res.data)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }
  },
  getInfo: (store,{params,callback}) => {
    try {

      // console.log('wa')
        // const sessionId=session.sessionData.id;
        // console.log(session.sessionData)
        // const result = stripe.redirectToCheckout({
        //   sessionId: sessionId,
        // });
        // if (result.error) {
        //   console.log(result.error.message);
        // }

        // const httpEvent = firebase.functions().httpsCallable('getSSass');
        // await httpEvent({ 
        //   path: '/resources',
        //   // path: '/schedules',
        //   params: {
        //     schedule_id: supersassConfig.resourceId,
        //     account: supersassConfig.account,
        //     api_key: supersassConfig.apiKey,
        //   },
        //   headers: {
        //     "Access-Control-Allow-Credentials": "true",
        //     "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.password),
        //     "Accept": "application/json",
        //     "Content-Type": "application/json; charset=utf-8",
        //     "Access-Control-Allow-Origin": "*",
        //   }
        // }).then((res) => {
        //   console.log('schedules',res);
        //   callback(res.data)
        //   // store.commit('SET_USERS', res.data)
        // });
        callback(params);
      // }
      // const processAll = async function() {
      //   await processA()
      // }
      // processAll()
    } catch(error){
      console.log(error)
    }
  },
  getUsers: (store,callback) => {
    // console.log("get users");
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getSSass');
        await httpEvent({ 
          path: '/users',
          // params: {
          //   username: supersassConfig.account,
          //   password: supersassConfig.apiKey,
          // },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          // console.log('get',res);
          store.commit('SET_USERS', res.data)
          callback(res.data)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }

  },
  getUserAgenda: (store,{params}) => {  // ユーザー予約を取得
    // console.log("get user agenda", params);
    try {
      const processA = async function() {
        const httpEvent2 = firebase.functions().httpsCallable('getSSass');
        const d_appoint = httpEvent2({ 
          path: '/agenda',
          method: 'GET',
          params: {
            user: 0,
            api_key: supersassConfig.apiKey,
            account: supersassConfig.account,
            from: params.from_date,
            slot: true
          },
          headers: {
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res2) => {
          // xml to json
          let my=[];
          parser.parseString(res2.data, function (err, result) {
            _.forEach(result.bookings, function(booking, k) {
              _.forEach(booking, function(v, k2) {
                if(params.user_email==v.full_name){
                  // console.log(v)
                  let _start = moment(v.start._).format("HH:mm");
                  let _finish = moment(v.finish._).format("HH:mm");
                  my.push({
                    id: v.$.id,
                    title: v.full_name,
                    start: v.start._,
                    end: v.finish._,
                    datetime: _start+'〜'+_finish,
                    studioName: v.resource_name._,
                    price: v.price[0],
                    created: v.created_on._,
                    resource_id: v.schedule.$.id
                  })

                }
              })
              
            });
          })
          store.state.result.myschedules=my;
          // callback(my);
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }

  },
  getClass: (store, {params}) => { //クラスのレッスン
    // store.commit('SET_ISLOADING', true)
    // console.log(params)

    // try {
    //   const processA = async function(schedule_id,studio_name,color) {
    //     const httpEvent = firebase.functions().httpsCallable('getSSass');
    //     await httpEvent({ 
    //       path: '/free/'+schedule_id+'.json',
    //       params: {
    //         from: store.state.selectDate + ' 00:00:00',
    //         // from: params.date,
    //         checksum: supersassConfig.checksum,
    //       },
    //       headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json; charset=utf-8",
    //         "Access-Control-Allow-Origin": "*",
    //       }
    //     }).then((res) => {
    //       // console.log('free',res);
    //       _.forEach(res.data.slots, function(v, k) {
    //         // console.log('free',v);
    //         let description = v.description;
    //         let isMember = false;

    //         // description = description + ' ' +moment(v.start).format("h:mm")+'〜'+moment(v.finish).format("h:mm:ss a");
    //         let _start = moment(v.start).format("HH:mm");
    //         let _finish = moment(v.finish).format("HH:mm");
    //         store.state.result.events.push({
    //           id: v.id,
    //           title: v.title,
    //           start: v.start,
    //           end: v.finish,
    //           datetime: _start+'〜'+_finish,
    //           description: description,
    //           isMember:isMember,
    //           studioName: studio_name,
    //           iconColor: color,
    //           color: color,
    //           fontColor: 'black',
    //           display: '',
    //           isReserve: false,
    //           // allDay: true
    //         })
    //         // store.commit('SET_ISLOADING', false)
    //       });

    //       // callback(res.data)
    //       // store.commit('SET_USERS', res.data)
    //     });
    //   }

    //   // コザクラス
    //   const processAll = async function() {
    //     // await processA(535055,'コザスタジオ','#F3C857')
    //     await processA(550120,'コザクラス','tomato')
    //     // await processA(549839,'コザクラス','tomato')
    //   }
    //   processAll()
    //   .then(code => {

    //     // ナゴクラス
    //     const processAll2 = async function() {
    //       // await processA(548481,'ナゴスタジオ','#9DC0AC')
    //       await processA(550127,'ナゴクラス','blue')
    //     }
    //     processAll2().then(code2 => {
    //       store.commit('SET_ISLOADING', false)
    //       console.log('success')
    //       return 'success';
    //     })
    //   })
      
    // } catch(error){
    //   console.log(error)
    // }
  },
  getFree: (store, {params,callback}) => { //空き状況：利用可能時間

    store.commit('SET_ISLOADING', true)
    let dt = moment(params.date).format("YYYY-MM-DD");
    let dt2 = moment(dt + " " + params.time +":00").format("YYYY-MM-DD HH:mm:ss");  
    // 初期化
    store.commit('SET_SELECT_RESOURCES', [])
    try {
      const processA = async function(schedule_id,color) {
        const httpEvent = firebase.functions().httpsCallable('getSSass');
        await httpEvent({ 
          path: '/free/'+schedule_id+'.json',
          params: {
            from: dt2,
            checksum: supersassConfig.checksum,
            length: params.time_zone,
            resource: params.studio,
            // maxresults: 20,
          },
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          let _resources = [];
          _.forEach(res.data.slots, function(v, k) {
            let _start = moment(v.start).format("HH:mm");
            let _finish = moment(v.start).add(Number(params.hour), 'h').format("HH:mm");
            _resources.push({
              id: v.id,
              title: v.name,
              start: v.start,
              end: v.finish,
              datetime: _start+'〜'+_finish,
              description: 'ok',
              // isMember:isMember,
              studioName: v.name,
              iconColor: color,
              color: color,
              fontColor: 'black',
              display: '',
              isReserve: false,
              // allDay: true
            })
          });

          store.commit('SET_SELECT_RESOURCES', _resources)
          callback(res.data)
          // store.commit('SET_USERS', res.data)
        });
      }

      // コザクラス
      const processAll = async function() {
        // await processA(535055,'コザスタジオ','#F3C857')
        // await processA(550120,'コザクラス','tomato')
        await processA(549839, '#F3C857')
      }
      processAll()
      .then(code => {
        // // ナゴクラス
        // const processAll2 = async function() {
        //   // await processA(548481,'ナゴスタジオ','#9DC0AC')
        //   await processA(550127,'ナゴクラス','blue')
        // }
        // processAll2().then(code2 => {
        //   store.commit('SET_ISLOADING', false)
        //   console.log('success')
        //   return 'success';
        // })
      })
      
    } catch(error){
      console.log(error)
    }
  },
  getBookings: (store, {callback}) => {
    store.commit('SET_ISLOADING', true)
      try {
        const processA = async function(schedule_id) {
          const httpEvent = firebase.functions().httpsCallable('getSSass');
          await httpEvent({ 
            path: '/bookings',
            params: {
              schedule_id: schedule_id,
              checksum: supersassConfig.checksum,
            },
            headers: {
              "Accept": "application/xml",
              "Content-Type": "application/xml; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            }
          }).then((res) => {
            // xml to json
            parser.parseString(res.data, function (err, result) {
              // 個人と団体データ様式が異なるため！
              let _datas=result.reservations;
              if(_datas==undefined) _datas = result.appointments;

              store.state.result.bookings=[];
              _.forEach(_datas, function(reservations, k) {
                _.forEach(reservations, function(v, key) {
                  // console.log('booking-',v['field-2'])
                  if(!v['res-name']) return;  // 削除された場合、表示しない

                  let description = v['status-message'];
                  let _start = moment(v['start']['_']).utc().format("HH:mm");
                  let _finish = moment(v['finish']['_']).utc().format("HH:mm");

                  // コザが含まれているか検索
                  let iconColor = '#9DC0AC';
                  let color = '#9DC0AC';
                  var result = v['res-name'].indexOf('コザ');
                  if(result==-1) {
                    // コザ
                    iconColor = '#F3C857';
                    color = '#F3C857';
                  }
                  let allDay=false;
                  let title=v['full-name'];

                  // 一般か会員かチェック
                  let index = _.findIndex(store.state.result.users, function(o) { 
                    return o.name == v['full-name']; 
                  })
                  if(index==-1) {
                    // 一般
                    iconColor = '#ffb6c1'
                    color = '#ffb6c1'
                    // title = "一般"
                    // // 一般且つ承認待ちの場合
                    // if(v['status-message']=='承認待ち') {
                    //   title = _start + " 承認待ち"
                    //   allDay=true;
                    // }
                  };

                  // Firestore更新用-start
                  let product_name = 'スタジオ予約グループ';
                  let obj = Object.prototype.toString.call(v['field-2'])
                  if(obj == '[object String]') product_name = v['field-2'];

                  let price = 0;
                  let obj2 = Object.prototype.toString.call(v['field-1'])
                  if(obj2 == '[object String]') price = v['field-1'];
                  
                  store.state.result.bookings.push({
                    id: v['id']['_'],
                    email: v['full-name'],
                    product_name: product_name,
                    price: price,
                    date: moment(v['start']['_']).utc().format("YYYY-MM-DD"),
                    start: _start,
                    finish: _finish,
                    created: moment(v['created-on']['_']).utc().format("YYYY-MM-DD"),
                  });
                  // Firestore更新用-end
                  
                  store.state.result.events.push({
                    id: v['id']['_'],
                    title: title,
                    start: v['start']['_'],
                    end: v['finish']['_'],
                    description: description,
                    datetime: _start+'〜'+_finish,
                    // isMember:isMember,
                    studioName: v['res-name'],
                    iconColor: iconColor,
                    color: color,
                    fontColor: 'black',
                    display: '',
                    // isReserve: true,
                    created: v['created-on']['_'],
                    user_id: v['user-id']['_'],
                    allDay: allDay
                  })
                  
                })
              })
            });
            callback(true)
          });
        }

        // 個人利用
        const processAll = async function() {
          await processA(549839)
        }
        processAll()
      } catch(error){
        console.log(error)
      }
  },
  // getBooking: (store,{params,callback}) => {  //単一
  //   console.log("get book",params);
  //   // store.commit('SET_ISLOADING', false)
  //   try {
  //     const processA = async function() {
  //       const httpEvent2 = firebase.functions().httpsCallable('getSSass');
  //       const d_appoint = httpEvent2({ 
  //         path: '/bookings/'+ params.id +'.json',
  //         method: 'GET',
  //         params: {
  //           // schedule_id: 534330,
  //           schedule_id: supersassConfig.resourceId,
  //           checksum: supersassConfig.checksum,
  //         },
  //         headers: {
  //           "Accept": "*/*",
  //           "Contsent-Type": "application/json; charset=utf-8",
  //           "Access-Control-Allow-Origin": "*",
  //         }
  //       }).then((res2) => {
  //         console.log('apoi',res2)
  //         callback(res2);
  //       });

  //     }
  //     const processAll = async function() {
  //       await processA()
  //     }
  //     processAll()
  //   } catch(error){
  //     console.log(error)
  //   }

  // },
  addAppointment: (store,{params,callback}) => {
    // 予約追加
    try {
      const processA = async function() {  
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({ 
          path: '/bookings.json',
          method: 'POST',
          params: {
            schedule_id: supersassConfig.resourceId,
            api_key: supersassConfig.apiKey,
            'booking[full_name]': params.email,
            'booking[email]': params.email,
            'booking[start]': params.start,
            'booking[finish]': params.finish,
            'booking[resource_id]': params.resource_id,
            'booking[field_1]': params.price,
          },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log('apo',res);
          callback(res)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }
  },
  deleteAppointment: (store,{params,callback}) => {
      try {
        // 予約削除
        const processA = async function() {
          const httpEvent2 = firebase.functions().httpsCallable('deleteSSass');
          const d_appoint = httpEvent2({ 
            path: '/bookings/'+ params.id +'.json',
            params: {
              schedule_id: supersassConfig.resourceId,
              checksum: supersassConfig.checksum,
            },
            headers: {
              "Accept": "*/*",
              "Contsent-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            }
          }).then((res) => {
            console.log(res)
            callback(res)
          });
          return d_appoint;

        }
        const processAll = async function() {
          return await processA()
        }
        processAll()
      } catch(error){
        console.log(error)
      }
  },
  addUser: (store,{params,callback}) => {

    // ランダム整数発行
    var _code = getRandomInt(1,9999)
    // var _name='susturesusture2525'+params.email;
    // // console.log('p name.',_name);

    // ////////////////////////
    // // supersass新規追加
    // ////////////////////////

    try {
      // console.log('user!',params, _code)
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({
          path: '/users/'+_code+'fk.json',
          method: 'POST',
          params: {
            // account:'susture',
            // password:'jmlLq1BhwucEkul_WgmSOA',
            account: supersassConfig.account,
            password: supersassConfig.apiKey,
            'user[full_name]': params.username,
            'user[name]': params.email,
            'user[password]': params.password,
            'user[phone]': params.phone,
            'user[address]': params.address,
          },
          headers: {
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          // console.log('user',res);
          callback(res)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }

  },
  saveUser: (store,{params, callback}) => {
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({ 
          path: '/users/'+ store.state.auth.user_id+'.json',
          method: 'PUT',
          params: {
            notfound: 'ignore',
            'user[name]': store.state.auth.email,
            'user[email]': store.state.auth.email,
            'user[credit]': params.credit.toLocaleString(),
          },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log('success!',res);
          callback(res)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }
  },
  updateUser: (store,{params, callback}) => {
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({ 
          path: '/users/'+ store.state.auth.user_id+'.json',
          method: 'PUT',
          params: {
            notfound: 'ignore',
            'user[email]': store.state.auth.email,
            'user[address]': params.address,
            'user[phone]': params.phone,
          },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log('success!',res);
          callback(res)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }
  },
  saveUserAdmission: (store,{params, callback}) => {
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({ 
          path: '/users/'+ store.state.auth.user_id+'.json',
          method: 'PUT',
          params: {
            notfound: 'ignore',
            'user[name]': store.state.auth.email,
            'user[super_field]': params.group_id,
          },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log('success!',res);
          callback(res)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const mutations = {
  onAuthEmailChanged(state, email) {
    state.email = email; //firebase user情報
    state.auth.username=''
    state.auth.email=''
    state.auth.checksum=''
    state.auth.isMember=false
    state.auth.user_id='';
    state.auth.credit=0;
    state.auth.supersass = supersassConfig;
    state.info.isSafariLogin = false
    state.auth.emailVerified=false
    state.result.myschedules=[]
  },
  onUserStatusChanged(state, status) {
    state.authStatus = status;
  },
  SET_USERS (state, data) {
    state.result.users = data
  },
  SET_SERVICE_RESOURCES (state, data) {
    state.result.service_resources = data
  },
  SET_NONMEMBERS (state, data) {
    state.result.nonMembers = data
  },
  SET_SCHEDULES (state, data) {
    state.result.schedules = data
  },
  SET_EVENTS (state, data) {
    state.result.events = data
  },  
  SET_ISLOADING (state, flg){
    state.isLoading = flg
  },
  SET_BACK_URI (state, data){
    state.backuri = data
  },
  SET_SELECT_DATE (state, data){
    state.selectDate = data
  },
  SET_AUTH (state, auth){
    
    state.auth.username = auth.displayName;
    state.auth.email = auth.email
    state.auth.isAdmissionFee = true;
    state.auth.emailVerified=auth.emailVerified;
    // state.info.isSafariLogin = false;
    // console.log('get auth',auth)

    // イベント取得
    let index = _.findIndex(state.result.users, function(o){
      return o.name==auth.email;
    });
    if(index==-1) return;

    // supersassアカウント
    let supersassuser = state.result.users[index]
    state.auth.user_id = supersassuser.id
    state.auth.credit = supersassuser.credit
    state.auth.address = supersassuser.address
    state.auth.phone = supersassuser.phone
    state.auth.password = supersassuser.password
    // console.log('super',supersassuser)

    // 初回の入会金チェック
    if(supersassuser.super_field==null || supersassuser.super_field==''){
      state.auth.isAdmissionFee = false;
      return;
    }
    
    // 権限
    if(supersassuser.super_field==1) state.auth.isMember = true;
  },
  SET_AUTH_ROLE (state, general){
    state.auth.general = general;
  },
  SET_AUTH_CHECKSUM (state, hash){
    state.auth.checksum = hash;
  },
  SET_INFO_BROUSER (state, browser){
    state.info.browser = browser;
  },
  RESET_VUEX_STATE(state) {
    // ローカルストレージ初期化
    Object.assign(state, JSON.parse(localStorage.getItem('state')));
  },
  SET_SAFARI_LOGIN (state, is_login){
    state.info.isSafariLogin = is_login
  },
  SET_SELECT_SEARCH (state, search){
    state.search = search
  },
  SET_SELECT_RESOURCES (state, resources){
    state.result.resources = resources
  },
  SET_RESET_PASSWORD (state, is_reset){
    state.info.isResetPassword = is_reset
  },
  SET_ACTIONCODE (state, actionCode){
    console.log('get actioncode')
    state.info.actionCode = actionCode
  },
  SET_ACTIONEMAIL (state, email){
    state.info.accountEmail = email
  },
}

// TODO: あとでcreateLoggerを外す
export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()],
  strict: debug,
})



