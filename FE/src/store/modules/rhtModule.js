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
    BadgeList:{},
    // 자소서관리
    CoverLetterList:[
      {"title":"삼성", "content":"합격하고싶다", "seq": "1", "date":"20200221"},
      {"title":"현대", "content":"보내줘요", "seq": "2", "date":"20200221"},
      {"title":"LG", "content":"제바리야~", "seq": "3", "date":"20200221"},
      {"title":"SK", "content":"화이팅", "seq": "4", "date":"20200221"}
    ],
    CoverLetterDetail:{},
    // 방 만들기, 
    StudyroomList:[
      {"roomSeq":"1", "roomType":"1", "roomTitle": "얍", "roomPrivateYN": "Y", "roomLimit": "5", "roomRegTime":"2022:09:03:06:22:58", "roomActiveYN":"Y", "roomFullYN" : "N", "thumbnailUrl":"abc.abc.abc"},
      {"roomSeq":"2", "roomType":"1", "roomTitle": "얍얍", "roomPrivateYN": "Y", "roomLimit": "5", "roomRegTime":"2022:09:03:06:22:58", "roomActiveYN":"Y", "roomFullYN" : "N", "thumbnailUrl":"abc.abc.abc"},
      {"roomSeq":"3", "roomType":"2", "roomTitle": "얍얍얍", "roomPrivateYN": "N", "roomLimit": "5", "roomRegTime":"2022:09:03:06:22:58", "roomActiveYN":"Y", "roomFullYN" : "N", "thumbnailUrl":"abc.abc.abc"},
      {"roomSeq":"4", "roomType":"1", "roomTitle": "얍얍얍얍", "roomPrivateYN": "Y", "roomLimit": "5", "roomRegTime":"2022:09:03:06:22:58", "roomActiveYN":"Y", "roomFullYN" : "N", "thumbnailUrl":"abc.abc.abc"},
      {"roomSeq":"5", "roomType":"2", "roomTitle": "얍얍얍얍얍", "roomPrivateYN": "N", "roomLimit": "5", "roomRegTime":"2022:09:03:06:22:58", "roomActiveYN":"Y", "roomFullYN" : "N", "thumbnailUrl":"abc.abc.abc"},
    ],
    // 녹화된 영상과 피드백 보기위함
    FeedbackList:{},
    Replayvideo:{},
  }


const getters = {
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
    FeedbackList(state){return state.FeedbackList},
    ReplayList(state){return state.ReplayList},
    authHeader: state => (`Bearer ${state.token}`)
  }


const mutations= {
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
  }


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
    login({ dispatch, getters }, credentials) {

      console.log("로그인아 안녕?")
      axios({
        url: 'http://' + location.hostname + ':8081' + '/api/v1/users/login',  
        method: 'post',
        data: credentials
      })
        .then(res => {
          console.log("해윙")
          console.log(res)
          const token = res.data.accessToken
          dispatch('saveToken', token)
          console.log(getters.authHeader)
          dispatch('fetchCurrentUser')
          console.log(getters.UserList)
          dispatch('fetchHistories')
        })
        .catch(err => {
          console.error(err)
          alert("이메일 및 비밀번호를 확인하세요")
        })
    },

    // 로그아웃
    logout({ getters, dispatch }) {
      console.log("로그아웃아 안녕?")
      axios({
        url: '', //logout api로 
        method: 'post',
        headers: getters.authHeader,
      })
        .then(() => {
          dispatch('removeToken')
          alert('성공적으로 logout!')
          useRouter.push({ name: 'Account' })
        })
        .catch(err => {
          console.error(err.response)
        })
    },

    // 사용자 정보 가져오기
    fetchCurrentUser({ commit, getters, dispatch }) {
      if (getters.isLoggedIn) {
        axios({
          url: 'http://' + location.hostname + ':8081' + '/api/v1/users/detail', //정보 가져오는 api
          method: 'get',
          headers: {Authorization: getters.authHeader },
        })
          .then(res => commit('SET_USER_LIST', res.data))
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
          url: 'http://' + location.hostname + ':8081' + '/api/v1/users/histories', //정보 가져오는 api
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
    confirmPW({commit}, confirmPW) {
      console.log("비밀번호 확인아 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/users/check/password', // 비밀번호 컨펌 api 
        method:'post',
        data: confirmPW
      })
      .then(() => {
        alert('진심 탈퇴 할거여?.')
        commit('SET_PW_CODE', true)
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE', true)
        alert('비밀번호를 확인하세요.')
        
      })
    },

    //비번수정을 위한 비번확인 
    confirmPWforEdit({commit}, confirmPW) {
      console.log("비밀번호 확인아 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/users/check/password', // 비밀번호 컨펌 api 
        method:'post',
        data: confirmPW
      })
      .then(() => {
        alert('비밀번호를 확인되었습니다.')
        commit('SET_PW_CODE_FOR_EDIT', true)
      })
      .catch(err => {
        console.error(err.response)
        commit('SET_PW_CODE_FOR_EDIT', true)
        alert('비밀번호를 확인하세요.')
        
      })
    },

    // 회원탈퇴
    deleteID() {
      console.log("회원탈퇴야 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/users', // 회원탈퇴 api 
        method:'delete',
      })
      .then(() => {
        alert('정상적으로 회원탈퇴 되었습니다.')
        useRouter.push({ name: 'Account' })
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    // 비밀번호 수정
    changePW(changepassword) {
      console.log("비번수정아 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/users/password', // 비번수정 api 
        method:'put',
        data: changepassword
      })
      .then(() => {
        alert('정상적으로 비밀번호가 바뀌었습니다.')
        useRouter.push({ name: 'Account' })
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },

    // 자소서 만들기
    createCoverLetter({dispatch},credentials) {
      console.log("자소서만들기야 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/coverletters', // 비번수정 api 
        method:'post',
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
        url:'http://' + location.hostname + ':8081' + '/api/v1/coverletters', // 비번수정 api 
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
    detailCoverLetter({commit, getters}, coverLetterSeq) {
      console.log("자소서상세보기야 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + `/api/v1/coverletters/${coverLetterSeq}}`, // 비번수정 api 
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

    //자소서 삭제하기
    deleteCoverLetter({dispatch}, credentialsTodelete) {
      console.log("자소서 삭제하기야 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/coverletters/', // 비번수정 api 
        method:'delete',
        data: credentialsTodelete
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
    updateCoverLetter({dispatch}, credentials) {
      console.log("자소서수정하기야 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/coverletters', // 비번수정 api 
        method:'put',
        data: credentials
      })
      .then(() => {
        dispatch('getCoverLetter')
        alert('자소서가 수정되었습니다.')
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    },
    //스터디룸 정보 얻어오기
    getStudyRoom({commit}) {
      console.log("스터디룸가져오기야야 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/studyroom', // 비번수정 api 
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
    // 스터디룸 생성
    createStudyroom({dispatch},credentials) {
      console.log("스터디룸만들기야 안녕?")
      axios({
        url:'http://' + location.hostname + ':8081' + '/api/v1/studyroom', // 비번수정 api 
        method:'post',
        data: credentials,
      })
      .then(() => {
        dispatch('getstudyroom')
        alert('스터디룸이 생성되었습니다.')
      })
      .catch(err => {
        console.error(err.response)
        alert('실패.')
      })
    }
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}