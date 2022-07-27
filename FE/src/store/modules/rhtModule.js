import axios from "axios";
import router from '@/router'

const state= {
    // 회원가입
    token: localStorage.getItem('token') || '',
    UserList:{},
    isLoggedIn: false,
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
    CoverLetterList:{},
    // 방 만들기, 
    StudyroomList:{},
    // 녹화된 영상과 피드백 보기위함
    FeedbackList:{},
    Replayvideo:{},
    test: {
      "email": "seoktak123@gmail.com",
      "password": "1234",
      "name": "김싸피",
      "profile": "@/assets/images/anyimgs.png",
    }
  }


const getters = {
    isLoggedIn(state){return !!state.isLoggedIn},
    UserList(state){return state.UserList},
    Emailcode(state){return state.emailcode},
    pwCode(state){return state.pwcode},
    pwCodeForEdit(state){return state.pwcodeforedit},
    ParticipantList(state){return state.ParticipantList},
    ThumnailList(state){return state.ThumnailList},
    BadgeList(state){return state.BadgeList},
    CoverLetterList(state){return state.CoverLetterList},
    StudyroomList(state){return state.StudyroomList},
    FeedbackList(state){return state.FeedbackList},
    ReplayList(state){return state.ReplayList},
    authHeader(state){return ({"accessToken": `"${state.token}"`})}
  }


const mutations= {
    SET_TOKEN(state, token){
      state.token = token
    },
    SET_USER_LIST(state, user){
      state.UserList = user
    },
    SET_EMAIL_CODE(state, emailcode){
      state.emailcode = emailcode
    },
    SET_PW_CODE(state, pwcode){
      state.pwcode = pwcode
    },
    SET_PW_CODE_FOR_EDIT(state, pwcodeforedit){
      state.pwcodeforedit = pwcodeforedit
    }
  }


const actions= {
    saveToken({ commit }, token){
      commit('SET_TOKEN', token)
    },

    removeToken({ commit }) {
      /* 
      state.token 삭제
      localStorage에 token 추가
      */
      commit('SET_TOKEN', '')
      localStorage.setItem('token', '')  // token 값 빈값 넣고 보내면, token delete 된 것
    },
    
    login({ dispatch }, credentials) {
      /* 
      POST: 사용자 입력정보를 login URL로 보내기
        성공하면
          응답 토큰 저장
          현재 사용자 정보 받기
          메인 페이지(ArticleListView)로 이동
        실패하면
          에러 메시지 표시
      */
      console.log("로그인아 안녕?")
      axios({
        url: '',  // 로그인 api
        method: 'post',
        data: credentials
      })
        .then(res => {
          const token = res.data.key
          dispatch('saveToken', token)
          dispatch('fetchCurrentUser')
          router.push({ name: 'main' })
        })
        .catch(err => {
          console.error(err.response.data)
        })
    },

    signup({ dispatch }, credentials) {
      /* 
      POST: 사용자 입력정보를 signup URL로 보내기
        성공하면
          응답 토큰 저장
          현재 사용자 정보 받기
          메인 페이지(ArticleListView)로 이동
        실패하면
          에러 메시지 표시
      */
      console.log("회원가입아 안녕?")
      axios({
        url: '', //회원가입 api로
        method: 'post',
        data: credentials
      })
        .then(res => {
          const token = res.data.key
          dispatch('saveToken', token)
          dispatch('fetchCurrentUser')
          alert('성공적으로 회원가입!')
          router.push({ name: 'main' })

        })
        .catch(err => {
          console.error(err.response.data)
        })
    },
    logout({ getters, dispatch }) {
      /* 
      POST: token을 logout URL로 보내기
        성공하면
          토큰 삭제
          사용자 알람
          LoginView로 이동
        실패하면
          에러 메시지 표시
      */
      console.log("로그아웃아 안녕?")
      axios({
        url: '', //logout api로 
        method: 'post',
        headers: getters.authHeader,
      })
        .then(() => {
          dispatch('removeToken')
          alert('성공적으로 logout!')
          router.push({ name: 'Account' })
        })
        .catch(err => {
          console.error(err.response)
        })
    },

    fetchCurrentUser({ commit, getters, dispatch }) {
      /*
      GET: 사용자가 로그인 했다면(토큰이 있다면)
        currentUserInfo URL로 요청보내기
          성공하면
            state.cuurentUser에 저장
          실패하면(토큰이 잘못되었다면)
            기존 토큰 삭제
            LoginView로 이동
      */
      if (getters.isLoggedIn) {
        axios({
          url: '', //정보 가져오는 api
          method: 'get',
          headers: getters.authHeader,
        })
          .then(res => commit('SET_USER_LIST', res.data))
          .catch(err => {
            if (err.response.status === 401) {
              dispatch('removeToken')
              router.push({ name: 'Account' })
            }
          })
      }
    },

    checkEmail(credentials) {
    console.log("중복확인아 안녕?")
      axios({
        url: '',  // 이메일확인 api
        method: 'get',
        data: credentials.userEmial
      })
        .then(() => {
          alert('! 가입 가능 한 이메일입니다.')
        })
        .catch(err => {
          console.error(err.response)
          alert('이미 가입된 이메일입니다.')
        })
    },

    getEmailCode({commit}, credentials) {
        console.log("코드보내기야 안녕?")
        axios({
          url: '',  // 비밀번호찾기 api
          method: 'post',
          data: credentials.userEmail
        })
          .then(res => {
            alert('가입한 이메일로 인증코드가 전송 되었습니다.')
            commit('SET_EMAIL_CODE', res.data)
          })
          .catch(err => {
            console.error(err.response)
            alert('가입된 이메일이 아닙니다.')
          })
        
    },
    getNewPW(emailcode) {
      console.log("새로운비번받기야 안녕?")
      axios({
        url: '',  // 인증번호 api
        method: 'post',
        data: emailcode.emailcode
      })
        .then(() => {
          alert('새 비밀번호를 전송하였습니다. 이메일을 확인하세요.')
          router.push({ name: 'Account' })
        })
        .catch(err => {
          console.error(err.response)
          alert('인증번호를 확인하세요.')
        })
    },
    confirmPW({commit}, confirmPW) {
      console.log("비밀번호 확인아 안녕?")
      axios({
        url:'', // 비밀번호 컨펌 api 
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
    confirmPWforEdit({commit}, confirmPW) {
      console.log("비밀번호 확인아 안녕?")
      axios({
        url:'', // 비밀번호 컨펌 api 
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
    deleteID() {
      console.log("회원탈퇴야 안녕?")
      axios({
        url:'', // 회원탈퇴 api 
        method:'delete',
      })
      .then(() => {
        alert('정상적으로 회원탈퇴 되었습니다.')
        router.push({ name: 'Account' })
      })
      .catch(err => {
        console.error(err.response)
        alert('임시의 도피처.')
      })
    },

    changePW() {
      console.log("비번수정아 안녕?")
      axios({
        url:'', // 비번수정 api 
        method:'delete',
      })
      .then(() => {
        alert('정상적으로 회원탈퇴 되었습니다.')
        router.push({ name: 'Account' })
      })
      .catch(err => {
        console.error(err.response)
        alert('임시의 도피처.')
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