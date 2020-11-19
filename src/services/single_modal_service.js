import { BehaviorSubject } from "rxjs";

const init = {content: ""}
const store = new BehaviorSubject(init)

export default {
    store: store, 
    show: (modalContent, onClose = () => {}) => {
        store.next({content: modalContent, onClose})
    } 
} 