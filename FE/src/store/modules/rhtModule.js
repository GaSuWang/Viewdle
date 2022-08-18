import { router } from "@/router";
import axios from "axios";
import { useRouter } from "vue-router";

const state= {
    token: localStorage.getItem('token') || '',
    UserList:{},
    HistoryList:{
      "userTotalTime": 5,
      "userTotalVideo": 12,
      "usingDates": [
        "2022:08:17",
        "2022:08:16",
        "2022:08:18"
      ]
    },
    isLoggedIn: true,
    emailcode:{},
    pwcode: '',
    pwcodeforedit: '',
    pwcheck: false,
    ParticipantList:{},
    ThumnailList:{},
    BadgeList:[],
    CoverLetterList:[],
    
      CoverLetterDetail:{},
    StudyroomList:[],
    ReplayList:[
      {"videoSeq":11, "videoTitle":"220802 삼성 면접 스터디", "videoUrl":"https://localhost:4443/openvidu/recordings/SessionA/SessionA.mp4", "videoRegTime":"2022:08:02:09:56:17"},
      {"videoSeq":12, "videoTitle":"220802 LG 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:06:09:00:17"},
      {"videoSeq":13, "videoTitle":"220802 SSAFY 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:08:09:56:57"},
      {"videoSeq":14, "videoTitle":"220802 HYUN DAI 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:09:19:17:17"},
      {"videoSeq":11, "videoTitle":"220802 삼성 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:02:09:56:17"},
      {"videoSeq":12, "videoTitle":"220802 LG 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:06:09:00:17"},
      {"videoSeq":13, "videoTitle":"220802 SSAFY 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:08:09:56:57"},
      {"videoSeq":14, "videoTitle":"220802 HYUN DAI 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:09:19:17:17"},
       ],
    ReplayDetail:{
      "videoSeq":11, "videoTitle":"220802 삼성 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:02:09:56:17", "feedbackList": [{"timeline":1000, "feedbackType":"B", "feedbackContent":"못생김"}, {"timeline":1490, "feedbackType":"G", "feedbackContent":"잘생김"},{"timeline":1000, "feedbackType":"B", "feedbackContent":"못생김"}, {"timeline":1490, "feedbackType":"G", "feedbackContent":"잘생김"},{"timeline":1000, "feedbackType":"B", "feedbackContent":"못생김"}, {"timeline":1490, "feedbackType":"G", "feedbackContent":"잘생김"}],
    },
    RecordingRes:{}
  }


const getters = {
    SecretCode(state){return state.SecretCode},
    isLoggedIn(state){return !!state.isLoggedIn},
    UserList(state){return state.UserList},
    HistoryList(state){return state.History},
    Emailcode(state){return state.emailcode},
    pwCheck(state){return state.emailcode},
    pwCode(state){return state.pwcode},
    pwCodeForEdit(state){return state.pwcodeforedit},
    ParticipantList(state){return state.ParticipantList},
    ThumnailList(state){return state.ThumnailList},
    BadgeList(state){return state.BadgeList},
    CoverLetterList(state){return state.CoverLetterList},
    CoverLetterDetail(state){return state.CoverLetterDetail},
    StudyroomList(state){return state.StudyroomList},
    ReplayDetail(state){return state.ReplayDetail},
    ReplayList(state){return state.ReplayList},
    authHeader: state => (`Bearer ${state.token}`),
    RecordingRes(state){return state.RecordingRes}
  }


const mutations= {
    SET_RECORDING_RES(state, RecordingRes){
      state.RecordingRes = RecordingRes
    },
    SET_SECRETCODE(state, SecretCode){
      state.SecretCode = SecretCode
    },
    SET_TOKEN(state, token){
      state.token = token
    },
    SET_USER_LIST(state, user){
      state.UserList = user
    },
    SET_HISTORY_LIST(state, History){
      state.HistoryList = History
    },
    SET_EMAIL_CODE(state, emailcode){
      state.emailcode = emailcode
    },
    SET_CHECK(state, pwcheck){
      state.pwcheck = pwcheck
    },
    SET_PW_CODE(state, pwcode){
      state.pwcode = pwcode
    },
    SET_PW_CODE_FOR_EDIT(state, pwcodeforedit){
      state.pwcodeforedit = pwcodeforedit
    },
    SET_COVERLETTER_LIST(state, CoverLetterList){
      state.CoverLetterList = CoverLetterList
    },
    SET_COVERLETTER_DETAIL(state, CoverLetterDetail){
      state.CoverLetterDetail = CoverLetterDetail
    },
    SET_STUDYROOM_LIST(state, StudyroomList){
      state.StudyroomList = StudyroomList
    },
    SET_REPLAY_LIST(state, ReplayList){
      state.ReplayList = ReplayList
    },
    SET_REPLAY_DETAIL(state, ReplayDetail){
      state.ReplayDetail = ReplayDetail
    },
    SET_BADGE_LIST(state, BadgeList){
      state.BadgeList = BadgeList
    },
  }
const BASE_URL = 'https://' + location.hostname
const actions= {
    saveToken({ commit }, token){
      commit('SET_TOKEN', token)
    },
    removeToken({ commit }) {
      commit('SET_TOKEN', '')
      localStorage.setItem('token', '') 
    },
    
    logout({ dispatch }) {
      dispatch('removeToken')
      router.push('/main')
      alert('성공적으로 logout!')
      router.push({ name: 'Account' })
    },

    fetchCurrentUser({ commit, getters, dispatch }) {
      if (getters.isLoggedIn) {
        axios({
          url: BASE_URL + '/api/v1/users/detail',
          method: 'get',
          headers: {Authorization: getters.authHeader },
        })
          .then(res => {
            commit('SET_USER_LIST', res.data)
            commit("lbhModule/GET_USER_INFO", res.data, {root:true})
            })
          .catch(err => {
            if (err.response.status === 401) {
              dispatch('removeToken')
              useRouter.push({ name: 'Account' })
            }
          })
      }
    },
    fetchHistories({ commit, getters, dispatch }) {
      if (getters.isLoggedIn) {
        axios({
          url: BASE_URL + '/api/v1/users/histories',
          method: 'get',
          headers: {Authorization: getters.authHeader },
        })
          .then(res => commit('SET_HISTORY_LIST', res.data))
          .catch(err => {
            if (err.response.status === 401) {
              dispatch('removeToken')
              useRouter.push({ name: 'Account' })
            }
          })
      }
    },

    confirmPW({commit, getters}, confirmPW) {
      axios({
        url: BASE_URL + '/api/v1/users/check/password', 
        method:'post',
        data: {"password":confirmPW.password},
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('진심 탈퇴 할거여?.')
        commit('SET_PW_CODE', false)
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE', true)
        alert('비밀번호를 확인하세요.')
        
      })
    },

    confirmEmail(Email) {
      axios({
        url: BASE_URL + `/api/v1/users/check/${Email}`,
        method:'get',
      })
      .then(() => {
        alert('진심 탈퇴 할거여?.')
      })
      .catch(err => {
        console.error(err.response)
        alert('비밀번호를 확인하세요.')
            
      })
    },

    confirmPWforEdit({commit, getters}, confirmPW) {
      axios({
        url: BASE_URL + '/api/v1/users/check/password',
        method:'post',
        data: {"password":confirmPW.password},
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('비밀번호를 확인되었습니다.')
        commit('SET_PW_CODE_FOR_EDIT', false)
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE_FOR_EDIT', true)
        alert('비밀번호를 확인하세요.')
        
      })
    },

    deleteID({getters, commit}) {
      axios({
        url: BASE_URL + '/api/v1/users',
        method:'put',
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('정상적으로 회원탈퇴 되었습니다.')
        commit('SET_PW_CODE_FOR_EDIT', true)
        commit('SET_PW_CODE', true)
        router.push('/')
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE_FOR_EDIT', true)
        commit('SET_PW_CODE', true)
        alert('실패.')
      })
    },

    changePW({commit, getters}, changepassword) {
      axios({
        url: BASE_URL + '/api/v1/users/password',
        method:'put',
        data: {
          password:changepassword.password,
          password2:changepassword.password2
        },
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('정상적으로 비밀번호가 바뀌었습니다.')
        commit('SET_PW_CODE_FOR_EDIT', false)
        commit('SET_PW_CODE', false)
        router.push('/')
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE_FOR_EDIT', false)
        commit('SET_PW_CODE', false)
        alert('실패.')
      })
    },
    createCoverLetter({dispatch, getters}, credentials) {
      axios({
        url: BASE_URL + '/api/v1/coverletters',
        method:'post',
        headers: {Authorization: getters.authHeader },
        data: credentials,
      })
      .then(() => {
        dispatch('getCoverLetter')
        alert('자소서가 생성되었습니다.')
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    getCoverLetter({commit, getters}) {
      axios({
        url: BASE_URL + '/api/v1/coverletters',
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_COVERLETTER_LIST', res.data)
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    detailCoverLetter({commit, getters}, credentialsTodelete) {
      axios({
        url: BASE_URL + `/api/v1/coverletters/${credentialsTodelete}`,
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_COVERLETTER_DETAIL', res.data)
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
      
    deleteCoverLetter({dispatch, getters}, credentialsTodelete) {
      axios({
        url: BASE_URL + '/api/v1/coverletters',
        method:'delete',
        data: { "coverLetterSeq" :credentialsTodelete},
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        dispatch('getCoverLetter')
        alert('자소서가 삭제 되었습니다.')
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    updateCoverLetter({dispatch, getters}, CoverLetterDetail) {
      axios({
        url: BASE_URL + '/api/v1/coverletters',
        method:'put',
        data: {
          "coverLetterContent":CoverLetterDetail.value.coverLetterContent,
          "coverLetterTitle":CoverLetterDetail.value.coverLetterTitle,
          "coverLetterSeq":CoverLetterDetail.value.coverLetterSeq,
        },
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        dispatch('getCoverLetter')
        alert('자소서가 수정되었습니다.')
      })
      .catch(err => {
        console.error(err.response)
        alert('실패')
      })
    },

    getStudyRoom({commit}) {
      axios({
        url: BASE_URL + '/api/v1/studyroom',
        method:'get',
      })
      .then(res => {
        commit('SET_STUDYROOM_LIST', res.data)
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    createStudyroom({commit, dispatch, getters},credentials) {
      axios({
        url: BASE_URL + '/api/v1/studyroom',
        method:'post',
        data: credentials,
        headers: {Authorization: getters.authHeader }
      })
      .then((res) => {
        dispatch('getStudyRoom')
        alert('스터디룸이 생성되었습니다.')
        router.push({
          name: 'setting-room', 
        })
        const data = {
          roomSeq: res.data.roomSeq,
          roomType : credentials.type,
          roomTitle: credentials.title,
          isSuperUser: true,
        } 
        commit("lbhModule/GET_ROOM_INFO", data, {root:true})
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    enterNormalStudyroom({commit, state, getters}, credentials) {
      axios({
        url: BASE_URL + '/api/v1/studyroom/enter',
        method:'post',
        data: {
          "roomPassword": "",
          "roomSeq" : credentials
        },
        headers: {Authorization: getters.authHeader }
      })
      .then((res) => {
        alert('스터디룸에 입장되었습니다.')
        router.push({
          name: 'setting-room', 
        })
        function findRoom(e){
          return e.roomSeq ===  credentials
        }
        const roomTitle = state.StudyroomList.find(findRoom).roomTitle
        const roomType = state.StudyroomList.find(findRoom).roomType
        const data = {
          roomSeq: credentials,
          roomType : roomType,
          roomTitle: roomTitle,
          isSuperUser: false,
        }
        commit("lbhModule/GET_ROOM_INFO", data, {root:true})
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    enterStudyroom({state, commit, getters}, credentials) {
      axios({
        url: BASE_URL + '/api/v1/studyroom/enter',
        method:'post',
        data: {
          "roomPassword" : credentials.roomPassword,
          "roomSeq" : getters.SecretCode
        },
        headers: {Authorization: getters.authHeader }
      })
      .then((res) => {
        alert('스터디룸에 입장되었습니다.')
        router.push({
          name: 'setting-room', 

        })
        function findRoom(e){
          return e.roomSeq ===  getters.SecretCode
        }
        const roomTitle = state.StudyroomList.find(findRoom).roomTitle
        const roomType = state.StudyroomList.find(findRoom).roomType
        const data = {
          roomSeq: getters.SecretCode,
          roomType : roomType,
          roomTitle: roomTitle,
          isSuperUser: false,
        }
        commit("lbhModule/GET_ROOM_INFO", data, {root:true})
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    enterSecretStudyroom({commit}, credentials) {
      commit('SET_SECRETCODE', credentials)
    },

    getReplay({commit,getters}){
      axios({
        url : BASE_URL + '/api/v1/video',
        method: 'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_REPLAY_LIST', res.data)
      })
      .catch(err =>{
        console.error(err.response)
        alert('실패.')
      })
    },
    sortReplay({commit,getters}, credentials){
      axios({
        url : BASE_URL + '/api/v1/video',
        method: 'get',
        headers: {Authorization: getters.authHeader },
        params:{
          'order': credentials.order
        }
      })
      .then(res => {
        commit('SET_REPLAY_LIST', res.data)
      })
      .catch(err =>{
        console.error(err.response)
        alert('실패.')
      })
    },

    deleteReplay({getters, dispatch}, credentialsTodelete) {
      axios({
        url: BASE_URL + `/api/v1/video/${credentialsTodelete}`,
        method:'delete',
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('리플레이를 삭제했습니다.')
        dispatch('getReplay')

      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    detailReplay({commit, getters}, credentialsTodetail) {
      axios({ 
        url: BASE_URL + `/api/v1/video/${credentialsTodetail}`,
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_REPLAY_DETAIL', res.data)
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },


    getBadge({commit, getters}) {
      axios({
        url: BASE_URL + `/api/v1/users/badges`, 
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_BADGE_LIST', res.data)
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    searchStudyroom({commit}, credentialsTosearch) {
      axios({
        // url:BASE_URL + '/api/v1/studyroom/search', // 비번수정 api
        url: BASE_URL + `/api/v1/studyroom/search`  ,
        method:'get',
        params: { keyword: credentialsTosearch.keyword },
      })
      .then(res => {
        commit('SET_STUDYROOM_LIST', res.data)
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    filterStudyRoom({commit}, credentialsToFilter) {
      axios({
        url: BASE_URL + `/api/v1/studyroom`, 
        method:'get',
        params:{ 
          privateYN: credentialsToFilter.privateYN,
        }
      })
      .then(res => {
        commit('SET_STUDYROOM_LIST', res.data)
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    sortStudyRoom({commit}, credentialsToFilter) {
      axios({

        url: BASE_URL + `/api/v1/studyroom`,  
        method:'get',
        params:{ 
          order: credentialsToFilter.order,
        }
      })
      .then(res => {
        commit('SET_STUDYROOM_LIST', res.data)
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    setBadge
    ({dispatch, getters}, credentialsToset) {
      axios({
        url: BASE_URL + `/api/v1/users/badge`, 
        method:'put',
        data: {"badge":credentialsToset},
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        dispatch('fetchCurrentUser')
        alert('메인뱃지를 설정했습니다.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    profileImg ({ getters}, formdata) {
      axios({
        url: BASE_URL + `/api/v1/users/profile`, 
        method:'put',
        data: formdata,
        headers: {
          Authorization: getters.authHeader,
          'Content-Type': 'multipart/form-data' 
        },
      })
      .then(() => {
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
