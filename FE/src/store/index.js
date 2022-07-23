import { createStore } from "vuex"
import { Test } from "@/store/ByungHeonmodules/Test"
import { Try } from "@/store/ByungHeonmodules/Try"

export default createStore({
    modules: { Test, Try }
})


