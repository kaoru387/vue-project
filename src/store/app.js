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
import Firebase from "Firebase";

// const debug = process.env.NODE_ENV !== 'production'
const debug = process.env.NODE_ENV !== 'development'

const state = {
    result:{
      events: [],
      users: [],
      bookings: [],
      charges: [],
      schedules: [],
      resources: [],
      myschedules: [],
      my: [],
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
    backuri: '',
    selectDate: '',
    auth: {
      user_id: '',
      username: '',
      password: '',
      email: '',
      checksum: '',
      credit: '0',
      supersass: supersassConfig,
      isAdmissionFee: false,
      verifyEmail: false,
      emailVerified: false,
      isMember: true,
      isLine: true,
      session: '',
      isNeedName: false,
    },
    authStatus: false,
    info: {
      browser:'',
      isPersonal: true,
      isSafariLogin: false,
      actionCode: '',
      accountEmail: '',
      isResetPassword: false,
    },
    search: {},
    isSearch: false,
    lineLogin: '',
    // lineLogin: {
    //   code: '',
    //   state: '',
    // },
}

const actions = {
  getMD5: (store,{params,callback}) => {
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getHash');
        await httpEvent({ 
          // name: 'susturesusture2525'+store.state.auth.email,
          name: supersassConfig.account+supersassConfig.password+params.name,
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
    callback(params);
  },
  getLineUserInfo: (store,{params,callback}) => {
    // console.log('wao', params.client_id);
    const processA = async function() {
      const response = await firebase.functions().httpsCallable('getLineUser');
      await response({
        method: 'POST',
        params: {
          grant_type: 'authorization_code',
          code: params.code,
          redirect_uri: params.redirect_uri,
          client_id: params.client_id,
          client_secret: params.client_secret,
        },
      }).then((res) => {
        console.log(res);
        callback(res.data);
      });
    }
    const processAll = async function() {
      await processA()
    }
    processAll()
  },
  getLineLogin: (store,{params,callback}) => {
    const processA = async function(documentName) {
      const response = await firebase.functions().httpsCallable('getLineLogin');
      await response({
        method: 'POST',
        params,
      }).then((res) => {
        callback(res)
      });
    }
    const processAll = async function() {
      await processA();
    }
    processAll();
  },
  getPayPay: (store,{params,callback}) => {
    const processA = async function(documentName) {
      const response = await firebase.functions().httpsCallable('postPayPay');
      await response({
        method: 'POST',
        params,
      }).then((res) => {
        let data = JSON.parse(res.data).data;
        callback(data)
      });
    }
    const processAll = async function() {
      await processA();
    }
    processAll();
  },
  getPayPayStatus: (store,{params,callback}) => {
    const processA = async function(documentName) {
      const response = await firebase.functions().httpsCallable('getPayPay');
      await response({
        method: 'POST',
        params,
      }).then((res) => {
        let data = JSON.parse(res.data).data;
        callback(data)
      });
    }
    const processAll = async function() {
      await processA();
    }
    processAll();
  },
  deletePayPay: (store,{params,callback}) => {
    const processA = async function(documentName) {
      const response = await firebase.functions().httpsCallable('deletePayPay');
      await response({
        method: 'POST',
        params,
      }).then((res) => {
        let data = JSON.parse(res.data).data;
        callback(data)
      });
    }
    const processAll = async function() {
      await processA();
    }
    processAll();
  },
  getCharges: (store,{params,callback}) => {
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getChargeStripe');
        await httpEvent({ 
          params: {
            params
          }
        }).then((res) => {
          store.commit('SET_CHARGES', res.data.data)
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
  getUsers: (store,callback) => {
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getSSass');
        await httpEvent({ 
          path: '/users',
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
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
  // getUserAgenda: (store,{params}) => {  // ユーザー予約を取得
  //   try {
  //     const processA = async function() {
  //       const httpEvent2 = firebase.functions().httpsCallable('getSSass');
  //       const d_appoint = httpEvent2({ 
  //         path: '/agenda/'+supersassConfig.resourceId+'.json',
  //         method: 'GET',
  //         params: {
  //           user: 0,
  //           api_key: supersassConfig.apiKey,
  //           account: supersassConfig.account,
  //           from: params.from_date,
  //           slot: true
  //         },
  //         headers: {
  //           "Accept": "*/*",
  //           "Contsent-Type": "application/json; charset=utf-8",
  //           "Access-Control-Allow-Origin": "*",
  //         }
  //       }).then((res2) => {
  //         // console.log(res2)
  //         let result = res2.data;

  //         // xml to json
  //         store.state.result.myschedules=[];
  //         let my=[];
  //         // parser.parseString(res2.data, function (err, result) {
  //           store.commit('SET_BOOKINGS', result.bookings)
  //           _.forEach(result.bookings, function(v, k) {
              

  //             // if(booking.length==undefined) {
  //             //   let v = booking;
  //             //   if(params.user_email==v.email) {
  //             //     let _start = moment(v.start._).format("HH:mm");
  //             //     let _finish = moment(v.finish._).format("HH:mm");
  //             //     my.push({
  //             //       id: v.$.id,
  //             //       title: v.full_name,
  //             //       start: v.start._,
  //             //       end: v.finish._,
  //             //       datetime: _start+'〜'+_finish,
  //             //       studioName: v.resource_name._,
  //             //       price: v.price[0],
  //             //       created: v.created_on._,
  //             //       resource_id: v.schedule.$.id
  //             //     })
  //             //   }
  //             // }else{
  //             //   // 複数ある場合
  //             //   _.forEach(booking, function(v, k2) {
  //               // console.log(params.user_email, v.email);
  //               // console.log(params.user_email, v.full_name, v.deleted)
  //                 if(params.user_email==v.email) {


  //                   let _start = moment(v.start._).format("HH:mm");
  //                   let _finish = moment(v.finish._).format("HH:mm");
  //                   my.push({
  //                     id: v.$.id,
  //                     title: v.full_name,
  //                     start: v.start._,
  //                     end: v.finish._,
  //                     datetime: _start+'〜'+_finish,
  //                     studioName: v.resource_name._,
  //                     price: v.price[0],
  //                     created: v.created_on._,
  //                     resource_id: v.schedule.$.id
  //                   })
  //                 }
  //               // })
  //             // }
  //           });
  //         // })
  //         store.state.result.myschedules=my;
  //         // callback(my);
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
  getClass: (store, {params}) => { //クラスのレッスン
    // store.commit('SET_ISLOADING', true)
    // console.log(params)
  },
  getFree: (store, {params,callback}) => { //空き状況：利用可能時間

    store.commit('SET_ISLOADING', true)
    let dt = moment(params.date).format("YYYY-MM-DD");
    let dt2 = moment(dt + " " + params.time +":00").format("YYYY-MM-DD HH:mm:ss");  
    // console.log(params.time);

    // 初期化
    store.commit('SET_SELECT_RESOURCES', [])
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getSSass');
        await httpEvent({ 
          path: '/free/'+supersassConfig.resourceId+'.json',
          params: {
            from: dt2,
            checksum: supersassConfig.checksum,
            length: params.time_zone,
            // resource: params.resource_id,
            maxresults: 60,
          },
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          // console.log('hi', res.data);
          let _resources = [];
          _.forEach(res.data.slots, function(v, k) {
            
            // 対象条件のみ取得
            if(dt==moment(v.start).format("YYYY-MM-DD") && params.studio_name==v.name){

              // 対象の空き時間データ
              // let _start_time = moment(v.start).format("HH:mm");
              // let _finish_time = moment(v.start).add(Number(params.hour), 'h').format("HH:mm");

              // let _start = moment(v.start).format("YYYY-MM-DD HH:mm:ss");
              // let _finish = moment(v.start).add(Number(params.hour), 'h').format("YYYY-MM-DD HH:mm:ss");

              let _start_time = moment(v.start).format("HH:mm");
              let _finish_time = moment(v.start).add(Number(params.hour), 'h').format("HH:mm");

              let _start = moment(v.start).format("YYYY-MM-DD HH:mm:ss");
              let _finish = moment(v.start).add(Number(params.hour), 'h').format("YYYY-MM-DD HH:mm:ss");

              params.v_start=v.start;
              params.start=_start;
              params.finish=_finish;
              params.start_time=_start_time;
              params.finish_time=_finish_time;

              // 空き時間の終了日
              let finish = moment(_finish).format("YYYY-MM-DD");
              // let last_date = '';

              // ---------------------------------------------------------
              // 重複データを取得しない、予約データ比較。
              let check_target_end = moment(_finish).add(-30, 'm').format("HH:mm");
              let flag = true;
              const check = _.forEach(store.state.result.events, function(v2, k) {
                // if(flag){
                // 予約の終了日
                let end = moment(v2.end).utc().format("YYYY-MM-DD");

                // 対象スタジオのみ比較
                if(end==finish && params.studio_name==v2.studioName) {

                  // 予約の開始時間
                  let target_start = moment(v2.start).utc().format("HH:mm");
                  // 予約の終了時間
                  let target_end = moment(v2.end).utc().format("HH:mm");

                  // 時間比較
                  if(target_start < _finish_time && _finish_time <= target_end ) {
                    flag = false;
                  }else{

                    // 間ではない場合
                    if(target_start < _finish_time) {
                      // 30分前は間かをチェック
                      if(check_target_end <= target_end){
                        flag = false;
                      }else{
                        if(1<params.hour) {
                          // 1時間前をチェック
                          check_target_end = moment(_finish).add(-1, 'h').format("HH:mm");
                          if(check_target_end <= target_end) flag = false;
                        
                          // 2時間選択の場合は
                          if(params.hour==2) {
                            // 1.5時間前をチェック
                            check_target_end = moment(_finish).add(-1.5, 'h').format("HH:mm");
                            if(check_target_end <= target_end) flag = false; 
                          }
                        } 
                      }
                    }
                  }
                }
                // }
              });

              // 予約可能なデータのみ取得する
              if(flag){
                _resources=setFreeData(params, v, _resources);
                // let color = supersassConfig.nagoColor;
                // if(params.studio_name=="コザスタジオ") {
                //   // コザ
                //   color = supersassConfig.kozaColor;
                // }
                // _resources.push({
                //   id: v.id,
                //   title: params.studio_name+' '+ params.hour+'時間 '+params.use_name+' '+params.use_type+' ¥'+params.price,
                //   product_name: 'スタジオ予約 ' + params.use_type + ' '+ params.hour+'時間 ',
                //   start: _start,
                //   end: _finish,
                //   start_datetime: _start,
                //   finish_datetime: _finish,
                //   datetime: _start_time+'〜'+_finish_time,
                //   studioName: v.name,
                //   price: params.price,
                //   hour: params.hour,
                //   use_type: params.use_type,
                //   use_name: params.use_name,
                //   borderColor: color,
                //   color: 'white',
                //   fontColor: 'black',
                //   display: '',
                //   // created: v['created-on']['_'],
                //   // user_id: v['user-id']['_'],
                //   allDay: false
                // })

              }

            }

          });
          store.commit('SET_SELECT_RESOURCES', _resources)
          callback(_resources)
          // store.commit('SET_USERS', res.data)
        });
      }

      // スタジオ
      const processAll = async function() {
        await processA()
      }
      processAll();
      
    } catch(error){
      console.log(error)
    }
  },
  getBookings: (store, {callback}) => {
    store.commit('SET_ISLOADING', true)
    try {
      let that = this;
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
          store.state.result.bookings=[];
          // // ログインユーザー予約
          store.state.result.myschedules=[];
          store.state.result.my=[];
          // let my = [];

          parser.parseString(res.data, function (err, result) {

            // 個人と団体データ様式が異なるため
            let _datas=result.reservations;
            if(_datas==undefined) _datas = result.appointments;

            // -----------------------------
            // 管理者が変更すると、この形式になる?
            // -----------------------------
            if(_datas.reservation){
              if(1<_datas.reservation.length){

                _.forEach(_datas.reservation, function(v, k) {
                  setScheduleEvent(store, v);

                  // ログインユーザーの予約
                  if(store.state.auth.email==v.email){
                    // let price = v['price'];
                    // let obj2 = Object.prototype.toString.call(v['field-1'])
                    // if(obj2 == '[object String]') {
                    //   if(v['field-1']!=='') price = v['field-1'];
                    // }

                    // // console.log(v);
                    // let _start = moment(v['start']['_']).utc().format("HH:mm");
                    // let _finish = moment(v['finish']['_']).utc().format("HH:mm");
                    // let color = supersassConfig.kozaColor;

                    // my.push({
                    //   id: v['id']['_'],
                    //   title: v['full-name'],
                    //   date: moment(v['start']['_']).utc().format("YYYY-MM-DD"),
                    //   start: moment(v['start']['_']).utc().format("YYYY-MM-DD HH:mm"),
                    //   end: moment(v['finish']['_']).utc().format("YYYY-MM-DD HH:mm"),
                    //   datetime: _start+'〜'+_finish,
                    //   studioName: v['res-name'],
                    //   price: price,
                    //   created: moment(v['created-on']['_']).utc().format("YYYY-MM-DD"),
                    //   iconColor: color,
                    //   color: color,
                    //   description: 'test',
                    //   // resource_id: v.schedule.$.id
                    // })

                  }
                  
                });
              }else{
                // 1件しかない場合、配列じゃない。
                setScheduleEvent(store, _datas.reservation);
                // let reservation = _datas.reservation;
                // console.log(reservation.email)
              }   
            }
          });
          // console.log(my);
          store.state.result.myschedules=store.state.result.my;
          callback(true);
        });
      }
      // スタジオ
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
  addAppointment: (store,{params,callback}) => {  // 予約追加
    try {
      const processA = async function() {  
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({ 
          path: '/bookings.json',
          method: 'POST',
          params: {
            schedule_id: supersassConfig.resourceId,
            api_key: supersassConfig.apiKey,
            'booking[full_name]': params.full_name,
            'booking[email]': params.email,
            'booking[start]': params.start,
            'booking[finish]': params.finish,
            'booking[resource_id]': params.resource_id,
            'booking[field_1]': params.price,
            'booking[field_2]': params.product_name,
          },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log("success add?", res);
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
  addAppointmentCard: (store,{params,callback}) => {  // 予約追加
    try {
      // カード決済対応
      const super_field = " card";
     
      const processA = async function() {  
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({ 
          path: '/bookings.json',
          method: 'POST',
          params: {
            schedule_id: supersassConfig.resourceId,
            api_key: supersassConfig.apiKey,
            'booking[full_name]': params.full_name,
            'booking[email]': params.email,
            'booking[start]': params.start,
            'booking[finish]': params.finish,
            'booking[resource_id]': params.resource_id,
            'booking[field_1]': params.price,
            'booking[field_2]': params.product_name+super_field,
          },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log("success add?", res);
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
          console.log("success delete.");
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
    var _code = getRandomInt(1, 9999);

    ////////////////////////
    // supersass新規追加
    ////////////////////////

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
            'user[full_name]': params.full_name,
            'user[name]': params.name,
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
            'user[credit]': params.credit,
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
            'user[name]': store.state.auth.email,
            'user[full_name]': params.full_name,
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
  // saveUserAdmission: (store,{params, callback}) => {
  //   try {
  //     const processA = async function() {
  //       const httpEvent = firebase.functions().httpsCallable('postSSass');
  //       await httpEvent({ 
  //         path: '/users/'+ store.state.auth.user_id+'.json',
  //         method: 'PUT',
  //         params: {
  //           notfound: 'ignore',
  //           'user[name]': store.state.auth.email,
  //           'user[super_field]': params.group_id,
  //         },
  //         headers: {
  //           "Access-Control-Allow-Credentials": "true",
  //           "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
  //           "Accept": "*/*",
  //           "Contsent-Type": "application/json; charset=utf-8",
  //           "Access-Control-Allow-Origin": "*",
  //         }
  //       }).then((res) => {
  //         console.log('success!',res);
  //         callback(res)
  //       });
  //     }
  //     const processAll = async function() {
  //       await processA()
  //     }
  //     processAll()
  //   } catch(error){
  //     console.log(error)
  //   }
  // }
}

function setFreeData(params, v, resources) {
  let _start = params.start;
  let _finish = params.finish;
  let _start_time = params.start_time;
  let _finish_time = params.finish_time;

  let color = supersassConfig.nagoColor;
  if(params.studio_name=="コザスタジオ") {
    // コザ
    color = supersassConfig.kozaColor;
  }
  resources.push({
    id: v.id,
    title: params.studio_name+' '+ params.hour+'時間 '+params.use_name+' '+params.use_type+' ¥'+params.price,
    product_name: 'スタジオ予約 ' + params.use_type + ' '+ params.hour+'時間 ',
    start: _start,
    end: _finish,
    start_datetime: _start,
    finish_datetime: _finish,
    datetime: _start_time+'〜'+_finish_time,
    studioName: v.name,
    price: params.price,
    hour: params.hour,
    use_type: params.use_type,
    use_name: params.use_name,
    borderColor: color,
    color: 'white',
    fontColor: 'black',
    display: '',
    // created: v['created-on']['_'],
    // user_id: v['user-id']['_'],
    allDay: false
  });
  return resources;
  
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// カレンダーイベント追加
function setScheduleEvent(store, v) {
  let description = v['status-message'];
  let _start = moment(v['start']['_']).utc().format("HH:mm");
  let _finish = moment(v['finish']['_']).utc().format("HH:mm");

  // Firestore更新用-start
  let product_name = '管理者変更';
  let obj = Object.prototype.toString.call(v['field-2'])
  if(obj == '[object String]') product_name = v['field-2'];
  
  let price = v['price'];
  let obj2 = Object.prototype.toString.call(v['field-1'])
  if(obj2 == '[object String]') {
    price = v['field-1'];
  }

  // カード決済かを取得
  let isCard = false;
  let obj3 = Object.prototype.toString.call(v['field-2'])
  if(obj3 == '[object String]') {
    if(-1<v['field-2'].indexOf('card')) isCard=true;
  }
  
  // コザが含まれているか検索
  let color = supersassConfig.nagoColor;
  var result = v['res-name'].indexOf('コザ');
  if(result!==-1) {
    // コザ
    color = supersassConfig.kozaColor;
  }
  let allDay=false;
  let title='予約済';

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
    title: title+' '+price+' '+v['res-name'],
    start: v['start']['_'],
    end: v['finish']['_'],
    description: description,
    datetime: _start+'〜'+_finish,
    product_name: product_name,
    studioName: v['res-name'],
    iconColor: color,
    color: color,
    display: '',
    created: v['created-on']['_'],
    user_id: v['user-id']['_'],
    allDay: allDay,
  });

  // ログインユーザーの予約
  if(store.state.auth.email==v['email']){

    // 取消可能か
    let isEdit=true;
    // 当日以前の予約は取消不可
    let today = moment().format("YYYY-MM-DD HH:mm");
    let target = moment(v['start']['_']).utc().format("YYYY-MM-DD HH:mm");
    if(target<today) isEdit=false;

    // カード決済は取消不可
    store.state.result.my.push({
      id: v['id']['_'],
      title: title+' '+price+' '+v['res-name'],
      price: price,
      start: v['start']['_'],
      end: v['finish']['_'],
      description: description,
      datetime: _start+'〜'+_finish,
      product_name: product_name,
      studioName: v['res-name'],
      iconColor: color,
      // color: color,
      borderColor: color,
      color: 'white',
      fontColor: 'black',
      display: '',
      created: v['created-on']['_'],
      user_id: v['user-id']['_'],
      allDay: allDay,
      isEdit: isEdit,
      isCard: isCard
    });
  }
};

const mutations = {
  onAuthEmailChanged(state, email) {
    state.email = email; //firebase user情報
    state.auth.username=''
    state.auth.email=''
    state.auth.checksum=''
    // state.auth.isMember=false
    state.auth.user_id='';
    state.auth.credit=0;
    state.auth.supersass = supersassConfig;
    state.info.isSafariLogin = false
    state.auth.emailVerified=false
    // state.result.myschedules=[]
    state.auth.isAdmissionFee = false;
    state.auth.isNeedName = false;
  },
  onUserStatusChanged(state, status) {
    state.authStatus = status;
  },
  SET_USERS (state, data) {
    // console.log('users!', data);
    state.result.users = data
  },
  SET_SERVICE_RESOURCES (state, data) {
    state.result.service_resources = data
  },
  SET_BOOKINGS (state, data) {
    state.result.bookings = data
  },
  SET_CHARGES (state, data) {
    state.result.charges = data
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
    if(auth.email==null){
      state.auth.email = auth.phoneNumber;
      state.auth.emailVerified=true;
    }else{
      state.auth.email = auth.email
      state.auth.emailVerified=auth.emailVerified;
    }
    // state.info.isSafariLogin = false;
    // console.log('get auth',auth);

    // イベント取得
    let name = auth.email;
    if(auth.email==null) name = auth.phoneNumber;
    let index = _.findIndex(state.result.users, function(o){
      return name==o.name;
    });
    if(index==-1) return;

    // supersassアカウント
    let supersassuser = state.result.users[index];
    state.auth.user_id = supersassuser.id;

    // ポイント
    let credit = Number(supersassuser.credit.replace(/,/, ''));
    state.auth.credit = credit;
    // console.log(state.auth.credit);
    // 住所
    if(supersassuser.address=="null") state.auth.address = '';
    else state.auth.address = supersassuser.address;
    // 電話番号
    if(supersassuser.phone=="null") state.auth.phone = '';
    else state.auth.phone = supersassuser.phone;
    
    state.auth.password = supersassuser.password;
    state.auth.username = supersassuser.full_name;

    // 名前が変更されていない場合
    state.auth.isNeedName = false;
    if(supersassuser.name==supersassuser.full_name ||
      supersassuser.full_name==''){
      state.auth.isNeedName = true;
    }
    // console.log('super', supersassuser);
    
    // // 権限
    // if(supersassuser.super_field==1) {
    //   state.auth.isLine = true;
    //   state.auth.isMember = true;
    // }
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
  // RESET_VUEX_STATE(state) {
  //   // ローカルストレージ初期化
  //   Object.assign(state, JSON.parse(localStorage.getItem('state')));
  // },
  // SET_SAFARI_LOGIN (state, is_login){
  //   state.info.isSafariLogin = is_login
  // },
  SET_SELECT_SEARCH (state, search){
    state.search = search
    state.isSearch = true;
  },
  SET_IS_SEARCH (state, bool){
    state.isSearch = bool;
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
  SET_LINE_LOGIN (state, lineLogin){
    state.lineLogin = lineLogin
  },
  UPDATE_USER_CREDIT (state, credit){
    state.auth.credit = credit
  },
  STRIPE_SESSION (state, session){
    state.auth.session = session
  },
  // SET_LINE_LOGIN_URL (state, url){
  //   state.lineLoginUrl = url;
  // },
}

// TODO: あとでcreateLoggerを外す
export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()],
  strict: debug,
})



