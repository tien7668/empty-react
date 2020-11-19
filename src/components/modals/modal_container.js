import Modal from 'react-modal';
import {useState, useEffect} from 'react'
import modalService from '../../services/single_modal_service'
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
export default function() {
  const [modal, setModal] = useState({content: ""})
  useEffect(()=>{
    modalService.store.subscribe({next: (v) => {setModal(v)} })
  }, [])
  return (
    <Modal isOpen={modal.content != ""}
            ariaHideApp={false}
            style={customStyles}
           onRequestClose={()=>{setModal({content: ""}); modal.onClose()}}>
      {modal.content}
    </Modal>)
}