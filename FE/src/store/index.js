import { createStore } from "vuex"
import { Test } from "@/store/ByungHeonmodules/Test"
import { Try } from "@/store/HyeonTakmodules/Try"

export default createStore({
    modules: { Test, Try }
})


