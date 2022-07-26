import axios from "axios";
import { createStore } from "vuex";
import router from '../router'

export const Test = createStore({
  state: {
    // 회원가입
    token: localStorage.getItem('token') || '',
    UserList:{},
    isLoggedIn: false,
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
  },


  getters: {
    isLoggedIn(state){return !!state.isLoggedIn},
    UserList(state){return state.UserList},
    ParticipantList(state){return state.ParticipantList},
    ThumnailList(state){return state.ThumnailList},
    BadgeList(state){return state.BadgeList},
    CoverLetterList(state){return state.CoverLetterList},
    StudyroomList(state){return state.StudyroomList},
    FeedbackList(state){return state.FeedbackList},
    ReplayList(state){return state.ReplayList},
    authHeader(state){return ({"accessToken": `"${state.token}"`})}
  },


  mutations: {
    SET_TOKEN(state, token){
      state.token = token
    },
    SET_USER_LIST(state, user){
      state.UserList = user
    }
  },


  actions: {
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
      axios({
        url: '', //회원가입 api로
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
          .then(res => commit('SET_CURRENT_USER', res.data))
          .catch(err => {
            if (err.response.status === 401) {
              dispatch('removeToken')
              router.push({ name: 'login' })
            }
          })
      }
    },

    checkEmail(credentials) {

      axios({
        url: '',  // 이메일확인 api
        method: 'post',
        data: credentials.userEmial
      })
        .then(res => {
          alert(res + '! 가입 가능 한 이메일입니다.')
        })
        .catch(err => {
          console.error(err.response)
          alert('이미 가입된 이메일입니다.')
        })
    },

    findPW(credentials) {

      axios({
        url: '',  // 비밀번호찾기 api
        method: 'post',
        data: credentials.userEmial
      })
        .then(res => {
          alert('가입한 이메일로 비밀번호가 전송 되었습니다.')
          //기능구현 더해야됨
          //
          //
          //
          //
        })
        .catch(err => {
          console.error(err.response)
          alert('이미 가입된 이메일입니다.')
        })
    },
}});

