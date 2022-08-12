import { router } from "@/router";
import axios from "axios";
import { useRouter } from "vue-router";

const state= {
    // 회원가입
    token: localStorage.getItem('token') || '',
    UserList:{},
    HistoryList:{},
    isLoggedIn: true,
    emailcode:{},
    pwcode: false,
    pwcodeforedit: false,
    // 풀방여부, 참여시간
    ParticipantList:{},
    // 썸네일 따오기
    ThumnailList:{},
    // 뱃지 관리
    BadgeList:[],
    // 자소서관리
    CoverLetterList:[],
    
      CoverLetterDetail:{},
    // 방 만들기, 
    StudyroomList:[],
    // 녹화된 영상과 피드백 보기위함
    ReplayList:[
      "asdfasdf", 'asdfjb;asdfk'
      // {"videoSeq":11, "videoTitle":"220802 삼성 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:02:09:56:17"},
      // {"videoSeq":12, "videoTitle":"220802 LG 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:06:09:00:17"},
      // {"videoSeq":13, "videoTitle":"220802 SSAFY 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:08:09:56:57"},
      // {"videoSeq":14, "videoTitle":"220802 HYUN DAI 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:09:19:17:17"},
       ],
    ReplayDetail:{
      "videoSeq":11, "videoTitle":"220802 삼성 면접 스터디", "videoUrl":"abc.bbb.com", "videoRegTime":"2022:08:02:09:56:17", "feedbackList": [{"timeline":1000, "feedbackType":"B", "feadbackContent":"못생김"}, {"timeline":1490, "feedbackType":"G", "feadbackContent":"잘생김"}],
    },
  }


const getters = {
    SecretCode(state){return state.SecretCode},
    isLoggedIn(state){return !!state.isLoggedIn},
    UserList(state){return state.UserList},
    HistoryList(state){return state.History},
    Emailcode(state){return state.emailcode},
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
    authHeader: state => (`Bearer ${state.token}`)
  }


const mutations= {
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
// const router = useRouter()
const actions= {
  // 토큰저장
    saveToken({ commit }, token){
      commit('SET_TOKEN', token)
    },
  //  토큰 삭제 
    removeToken({ commit }) {
      commit('SET_TOKEN', '')
      localStorage.setItem('token', '') 
    },
    
  // 로그인 
    // login({ dispatch, getters }, credentials) {

    //   console.log("로그인아 안녕?")
    //   axios({
    //     url: 'https://' + location.hostname + ':8081' + '/api/v1/users/login',  
    //     method: 'post',
    //     data: credentials
    //   })
    //     .then(res => {
    //       console.log("해윙")
    //       console.log(res)
    //       const token = res.data.accessToken
    //       dispatch('saveToken', token)
    //       console.log(getters.authHeader)
    //       dispatch('fetchCurrentUser')
    //       console.log(getters.UserList)
    //       dispatch('fetchHistories')
    //       dispatch('getBadge')
    //       router.push('/main')
    //     })
    //     .catch(err => {
    //       console.error(err)
    //       alert("이메일 및 비밀번호를 확인하세요")
    //     })
    // },

    // 로그아웃
    logout({ dispatch }) {
      console.log("로그아웃아 안녕?")
      dispatch('removeToken')
      router.push('/main')
      alert('성공적으로 logout!')
      router.push({ name: 'Account' })
    },

    // 사용자 정보 가져오기
    fetchCurrentUser({ commit, getters, dispatch }) {
      if (getters.isLoggedIn) {
        axios({
          // url: 'https://' + location.hostname + '/api/v1/users/detail', //정보 가져오는 api
          url: 'http://' + location.hostname + ':8081' + '/api/v1/users/detail',
          method: 'get',
          headers: {Authorization: getters.authHeader },
        })
          .then(res => {
            commit('SET_USER_LIST', res.data)
            //이병헌 시작
            console.log('모듈....', res.data)
            commit("lbhModule/GET_USER_INFO", res.data, {root:true})
            //이병헌 끝
            })
          .catch(err => {
            if (err.response.status === 401) {
              dispatch('removeToken')
              console.log('여기가 잘못된거야 바보아')
              useRouter.push({ name: 'Account' })
            }
          })
      }
    },
    fetchHistories({ commit, getters, dispatch }) {
      if (getters.isLoggedIn) {
        axios({
          // url: 'https://' + location.hostname + '/api/v1/users/histories', //정보 가져오는 api
          url: 'http://' + location.hostname + ':8081' + '/api/v1/users/histories',
          method: 'get',
          headers: {Authorization: getters.authHeader },
        })
          .then(res => commit('SET_HISTORY_LIST', res.data))
          .catch(err => {
            if (err.response.status === 401) {
              dispatch('removeToken')
              console.log('여기가 잘못된거야 바보아')
              useRouter.push({ name: 'Account' })
            }
          })
      }
    },

    // 회원삭제를 위한 비번 확인
    confirmPW({commit, getters}, confirmPW) {
      console.log("비밀번호 확인아 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/users/check/password', // 비밀번호 컨펌 api
        url: 'http://' + location.hostname + ':8081' + '/api/v1/users/check/password', 
        method:'post',
        data: {"password":confirmPW.password},
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('진심 탈퇴 할거여?.')
        commit('SET_PW_CODE', true)
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE', false)
        alert('비밀번호를 확인하세요.')
        
      })
    },

    // 회원삭제를 위한 비번 확인
    confirmEmail(Email) {
      console.log("비밀번호 확인아 안녕?")
      axios({
        // url:'https://' + location.hostname + `/api/v1/users/check/${Email}`, // 비밀번호 컨펌 api 
        url: 'http://' + location.hostname + ':8081' + `/api/v1/users/check/${Email}`,
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

    //비번수정을 위한 비번확인 
    confirmPWforEdit({commit, getters}, confirmPW) {
      console.log("비밀번호 확인아 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/users/check/password', // 비밀번호 컨펌 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/users/check/password',
        method:'post',
        data: {"password":confirmPW.password},
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('비밀번호를 확인되었습니다.')
        commit('SET_PW_CODE_FOR_EDIT', true)
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE_FOR_EDIT', false)
        alert('비밀번호를 확인하세요.')
        
      })
    },

    // 회원탈퇴
    deleteID({getters, commit}) {
      console.log("회원탈퇴야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/users', // 회원탈퇴 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/users',
        method:'put',
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('정상적으로 회원탈퇴 되었습니다.')
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

    // 비밀번호 수정
    changePW({commit, getters}, changepassword) {
      console.log("비번수정아 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/users/password', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/users/password',
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

    // 자소서 만들기
    createCoverLetter({dispatch, getters}, credentials) {
      console.log("자소서만들기야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/coverletters', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/coverletters',
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

    //자소서 정보 가져오기
    getCoverLetter({commit, getters}) {
      console.log("자소서가져오기야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/coverletters', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/coverletters',
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_COVERLETTER_LIST', res.data)
        alert('자소서 정보를 가져왔습니다.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    //자소서 상세보기
    detailCoverLetter({commit, getters}, credentialsTodelete) {
      console.log("자소서상세보기야 안녕?")
      axios({
        // url:'https://' + location.hostname + `/api/v1/coverletters/${credentialsTodelete.coverLetterSeq}`, // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + `/api/v1/coverletters/${credentialsTodelete}`,
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_COVERLETTER_DETAIL', res.data)
        alert('자소서 상세 정보를 가져왔습니다.')
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
        // //자소서 상세보기
        // detailCoverLetter({commit, getters}, credentialsTodelete) {
        //   console.log("자소서상세보기야 안녕?")
        //   axios({
        //     url:'https://' + location.hostname + ':8081' + '/api/v1/coverletters', // 비번수정 api 
        //     method:'get',
        //     headers: {Authorization: getters.authHeader },
        //     data: credentialsTodelete
        //   })
        //   .then(res => {
        //     commit('SET_COVERLETTER_DETAIL', res.data)
        //     alert('자소서 상세 정보를 가져왔습니다.')
        //   })
        //   .catch(err => {
        //     console.error(err.response)
        //     alert('실패.')
        //   })
        // },

    //자소서 삭제하기
    deleteCoverLetter({dispatch, getters}, credentialsTodelete) {
      console.log("자소서 삭제하기야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/coverletters', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/coverletters',
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
    //자소서 수정하기
    updateCoverLetter({dispatch, getters}, CoverLetterDetail) {
      console.log("자소서수정하기야 안녕? 여기까진 괜찮네?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/coverletters', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/coverletters',
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
        alert('자소서가 수정되었습니다 됐다^^')
      })
      .catch(err => {
        console.error(err.response)
        alert('실패 ㅅㅂ....')
      })
    },
    //스터디룸 정보 얻어오기
    getStudyRoom({commit}) {
      console.log("스터디룸가져오기야야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/studyroom', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/studyroom',
        method:'get',
      })
      .then(res => {
        commit('SET_STUDYROOM_LIST', res.data)
        alert('스터디룸정보를 가져왔습니다.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    /// 이병헌 시작(바로 아래 줄에는 commit넣어줌)
    createStudyroom({commit, dispatch, getters},credentials) {
      console.log("스터디룸만들기야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/studyroom', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/studyroom',
        method:'post',
        data: credentials,
        headers: {Authorization: getters.authHeader }
      })
      .then((res) => {
        console.log(res.data.roomSeq)
        dispatch('getStudyRoom')
        alert('스터디룸이 생성되었습니다.')
        router.push({
          name: 'setting-room', 
          // query: {
          //   roomSeq : res.data.roomSeq,
          //   studyRoomMode : credentials.type,
          //   moderator : true
          // }
        })
        const data = {
          roomSeq: res.data.roomSeq,
          roomType : credentials.type,
          roomTitle: credentials.title,
          isSuperUser: true,
        } 
        commit("lbhModule/GET_ROOM_INFO", data, {root:true})
        /// 이병헌 끝 
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    // 일반방스터디룸 입장
    /// 이병헌 시작(바로 아래 줄에는 commit, state넣어줌)
    enterNormalStudyroom({commit, state, getters}, credentials) {
      console.log("스터디룸입장 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/studyroom/enter', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/studyroom/enter',
        method:'post',
        data: {
          //roomPassword로 빈 string 보내줘야 함
          "roomPassword": "",
          "roomSeq" : credentials
        },
        headers: {Authorization: getters.authHeader }
      })
      .then((res) => {
        console.log(res)
        console.log(credentials)
        alert('스터디룸에 입장되었습니다.')
        /// 이병헌 시작
        router.push({
          name: 'setting-room', 
        //   query: {
        //     roomSeq : credentials.roomSeq,
        //     moderator : false
        //   }
        // })
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
        console.log('room data from rhtModule', data)
        commit("lbhModule/GET_ROOM_INFO", data, {root:true})
        /// 이병헌 끝 
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    // 비번방스터디룸 입장
    //이병헌 시작
    enterStudyroom({state, commit, getters}, credentials) {
      console.log("스터디룸입장 안녕?")
      console.log(getters.SecretCode)
      axios({
        // url:'https://' + location.hostname + '/api/v1/studyroom/enter', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + '/api/v1/studyroom/enter',
        method:'post',
        data: {
          "roomPassword" : credentials.roomPassword,
          "roomSeq" : getters.SecretCode
        },
        headers: {Authorization: getters.authHeader }
      })
      .then((res) => {
        console.log(res)
        alert('스터디룸에 입장되었습니다.')
        router.push({
          name: 'setting-room', 
          // query: {
          //   roomSeq : credentials.roomSeq,
          //   moderator : false
          // }
        })
        console.log('roomSeq',getters.SecretCode, credentials.roomSeq, parseInt(credentials.roomSeq) )
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
        console.log('room data from rhtModule', data)
        commit("lbhModule/GET_ROOM_INFO", data, {root:true})
        //이병헌 끝
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    enterSecretStudyroom({commit}, credentials) {
      commit('SET_SECRETCODE', credentials)
    },
    // 영상 가져오기
    // getReplay({commit, getters}, credentialsTogetReplay) {
    //   console.log("리플레이가져오기야야 안녕?")
    //   axios({
    //     url:'https://' + location.hostname + ':8081' + '/api/v1/video', // 비번수정 api 
    //     method:'get',
    //     headers: {Authorization: getters.authHeader },
    //     params: {order:credentialsTogetReplay.order}
    //   })
    //   .then(res => {
    //     commit('SET_REPLAY_LIST', res.data)
    //     alert('리플레이정보를 가져왔습니다.')
    //   }
    //   )
    //   .catch(err => {
    //     console.error(err.response)
    //     alert('실패.')
    //   })
    // },
    getReplay({commit,getters}){
      axios({
        // 'https://' + location.hostname + '/api/v1/video',
        url : 'http://' + location.hostname + ':8081' + '/api/v1/video',
        method: 'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_REPLAY_LIST', res.data)
        alert('리플레이정보를 가져왔습니다.')
      })
      .catch(err =>{
        console.error(err.response)
        alert('실패.')
      })
    },
    sortReplay({commit,getters}, credentials){
      axios({
        // 'https://' + location.hostname + '/api/v1/video',
        url : 'http://' + location.hostname + ':8081' + '/api/v1/video',
        method: 'get',
        headers: {Authorization: getters.authHeader },
        params:{
          'order': credentials.order
        }
      })
      .then(res => {
        commit('SET_REPLAY_LIST', res.data)
        alert('리플레이정보를 가져왔습니다.')
      })
      .catch(err =>{
        console.error(err.response)
        alert('실패.')
      })
    },
    // 영상 지우기
    deleteReplay({getters}, credentialsTodelete) {
      console.log("리플레이지우기야 안녕?")
      console.log(credentialsTodelete)
      axios({
        // url:'https://' + location.hostname + `/api/v1/video/${credentialsTodelete}`, // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + `/api/v1/video/${credentialsTodelete}`,
        method:'delete',
        headers: {Authorization: getters.authHeader },
      })
      .then(() => {
        alert('리플레이를 삭제했습니다.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    // 영상 지우기
    detailReplay({commit, getters}, credentialsTodetail) {
      console.log("리플레이상세보기야 안녕?")
      console.log(credentialsTodetail)
      axios({
        // url:'https://' + location.hostname + `/api/v1/video/${credentialsTodetail.replaySeq}`, // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + `/api/v1/video/${credentialsTodetail}`,
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_REPLAY_LIST', res.data)
        alert('리플레이 상세보기.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    // 뱃지 가져오기
    getBadge({commit, getters}) {
      console.log("뱃지가져오기야야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/users/badges', // 비번수정 api
        url: 'http://' + location.hostname + ':8081' + `/api/v1/users/badges`, 
        method:'get',
        headers: {Authorization: getters.authHeader },
      })
      .then(res => {
        commit('SET_BADGE_LIST', res.data)
        console.log('뱃지정보를 가져왔습니다.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    // 스터디룸 서치
    searchStudyroom({commit}, credentialsTosearch) {
      console.log("서치기능아 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/studyroom/search', // 비번수정 api
        url: 'http://' + location.hostname + ':8081' + `/api/v1/studyroom/search`  ,
        method:'get',
        params: { keyword: credentialsTosearch.keyword },
      })
      .then(res => {
        commit('SET_STUDYROOM_LIST', res.data)
        console.log('서치했어용')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    //스터디룸 필터
    filterStudyRoom({commit}, credentialsToFilter) {
      console.log("스터디룸가져오기야야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/studyroom', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + `/api/v1/studyroom`, 
        method:'get',
        params:{ 
          privateYN: credentialsToFilter.privateYN,
        }
      })
      .then(res => {
        console.log("너냐?")
        commit('SET_STUDYROOM_LIST', res.data)
        alert('스터디룸정보를 가져왔습니다.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    //스터디룸 정렬
    sortStudyRoom({commit}, credentialsToFilter) {
      console.log("스터디룸가져오기야야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/studyroom', // 비번수정 api
        url: 'http://' + location.hostname + ':8081' + `/api/v1/studyroom`,  
        method:'get',
        params:{ 
          order: credentialsToFilter.order,
        }
      })
      .then(res => {
        commit('SET_STUDYROOM_LIST', res.data)
        alert('스터디룸정보를 가져왔습니다.')
      }
      )
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    //뱃지 설정
    setBadge
    ({dispatch, getters}, credentialsToset) {
      console.log("메인뱃지설정아 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/users/badge', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + `/api/v1/users/badge`, 
        method:'put',
        data: credentialsToset,
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
      console.log("프로필 이미지야 안녕?")
      axios({
        // url:'https://' + location.hostname + '/api/v1/users/profile', // 비번수정 api 
        url: 'http://' + location.hostname + ':8081' + `/api/v1/users/profile`, 
        method:'put',
        data: formdata,
        headers: {
          Authorization: getters.authHeader,
          'Content-Type': 'multipart/form-data' 
        },
      })
      .then(() => {
        // dispatch('fetchCurrentUser')
        alert('메인뱃지를 설정했습니다.')
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
