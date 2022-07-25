import { createLogger, createStore } from "vuex"
import { lbhModule } from "@/store/lbhModule"
import { rhtModule } from "@/store/rhtModule"

// state는 기존대로 state.moduleName.stateName으로 호출
// getters는 computed(() => store.getters["moduleName/getterName"])으로 호출
// mutation은 store.commit("moduleName/mutationName", params)으로 호출
// action은 store.dispatch("moduleName/actionName", params)으로 호출
// 출처: https://juntcom.tistory.com/174 [쏘니의 개발블로그:티스토리]

export default createStore({
    plugins: [createLogger()], //vuex store의 모든 행위를 console log해줌
    modules: { lbhModule, rhtModule }
})


