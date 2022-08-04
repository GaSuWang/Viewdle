import { createLogger, createStore } from "vuex";
import lbhModule from "./modules/lbhModule";
import rhtModule from "./modules/rhtModule";
import ov from "./modules/ov";
// import rhtModule from "@/store/modules/rhtModule";

// // state는 기존대로state.moduleName.stateName으로호출
// // getters는computed(() => store.getters["moduleName/getterName"])으로 호출
// // mutation은store.commit("moduleName/mutationName", params)으로 호출
// // action은store.dispatch("moduleName/actionName", params)으로 호출
// // 출처: https://juntcom.tistory.com/174 [쏘니의 개발블로그:티스토리]

export default createStore({
  plugins: [createLogger()], //vuex store의 모든 행위를 console log해줌
  modules: { lbhModule, rhtModule, ov },
  // modules: { lbhModule, rhtModule },
});
